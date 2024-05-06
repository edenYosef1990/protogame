import { UnitEntityObjectProxy } from "./basic-shapes";
import { EntityObjectProxy } from "./entity-object-proxy";
import {
  divVector,
  getVectorLength,
  getVectorZero,
  normalizeVector,
  vectorAdd,
  vectorSub,
} from "./utils";
import { fabric } from "fabric";

export interface PhysicalObject {
  position: { x: number; y: number };
  acceleration: { x: number; y: number };
  externalForce: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;

  debugSperationForce: { x: number; y: number };

  readonly proximityLimitForAcc: number;
  readonly proximityLimitForMovement: number;
}

function SetLocation(
  renderedObject: fabric.Object,
  position: { x: number; y: number }
) {
  renderedObject.set({
    top: position.y,
    left: position.x,
  });
}

function generateRenderedObject(
  color: string,
  position: { x: number; y: number },
  radius: number | undefined = undefined
): EntityObjectProxy {
  return new UnitEntityObjectProxy(color, position, radius);
}

export function generateRenderedLine(
  color: string,
  p: { x: number; y: number }
): EntityObjectProxy {
  return new EntityObjectProxy(
    new fabric.Line([p.x, p.y, p.x + 100, p.y + 100], {
      top: p.y,
      left: p.x,
      strokeWidth: 5,
      fill: color,
      stroke: color,
      originX: "center",
      originY: "center",
    })
  );
}

export function generateEntityObject(
  position: { x: number; y: number },
  radius: number
): PhysicalObject {
  return {
    position,
    acceleration: getVectorZero(),
    externalForce: getVectorZero(),
    velocity: getVectorZero(),
    radius,

    proximityLimitForAcc: radius * 5,
    proximityLimitForMovement: radius * 1.5,

    debugSperationForce: getVectorZero(),
  };
}

const radius = 10;

function clacSeperationForce(
  entityObject: PhysicalObject,
  otherEntities: PhysicalObject[]
) {
  let maxSpeed = 3;
  let closeEntities = otherEntities.filter(
    (curr) =>
      getVectorLength(vectorSub(entityObject.position, curr.position)) < 400
  );
  if (closeEntities.length > 0) {
    let sum = closeEntities.reduce((prev, curr) => {
      let dist = vectorSub(entityObject.position, curr.position);
      return length < 400
        ? vectorAdd(
            prev,
            normalizeVector(dist, 500 / (getVectorLength(dist) - 2 * radius))
          )
        : getVectorZero();
    }, getVectorZero());
    const avg = divVector(sum, closeEntities.length);
    const desiredVelocity = normalizeVector(avg, maxSpeed);
    return vectorSub(avg, entityObject.velocity);
  }
  return getVectorZero();
}

function calculateTotalForceAndVelocity(
  entityObject: PhysicalObject,
  allUnits: PhysicalObject[]
) {
  const seperationForce = clacSeperationForce(entityObject, allUnits);
  entityObject.debugSperationForce = seperationForce;

  entityObject.acceleration = normalizeVector(entityObject.externalForce, 0.1);
  entityObject.velocity = vectorAdd(
    entityObject.velocity,
    entityObject.acceleration
  );
}

function getFuturePosition(entityObject: PhysicalObject) {
  return vectorAdd(entityObject.position, entityObject.velocity);
}

function keepMoveInVelocity(entityObject: PhysicalObject) {
  entityObject.position = vectorAdd(
    entityObject.position,
    entityObject.velocity
  );
}

function stop(entityObject: PhysicalObject) {
  entityObject.velocity = { x: 0, y: 0 };
  entityObject.acceleration = { x: 0, y: 0 };
}
