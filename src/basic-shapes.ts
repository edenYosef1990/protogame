import { EntityObjectProxy } from "./entity-object-proxy";
import { fabric } from "fabric";
import { vectorAdd, vectorSub } from "./utils";

export class UnitEntityObjectProxy extends EntityObjectProxy {
  base: fabric.Circle;
  canon: fabric.Line;
  centerPosRelative: { x: number; y: number };
  canonEdgePosition: { x: number; y: number };

  constructor(
    color: string,
    position: { x: number; y: number },
    radius: number | undefined = undefined
  ) {
    let base = new fabric.Circle({
      stroke: "black",
      radius: radius ?? 50,
      width: 100,
      height: 100,
      fill: color,
      left: position.x,
      top: position.y,
      originX: "center",
      originY: "center",
    });
    let center = { x: base.left!, y: base.top! };

    let canon = new fabric.Line(
      [position.x, position.y, position.x + 10, position.y],
      {
        // top: position.y,
        // left: position.x,
        strokeWidth: 5,
        fill: Color.Yellow,
        stroke: Color.LightGray,
      }
    );
    super(
      new fabric.Group([base, canon], {
        originX: "center",
        originY: "center",
      })
    );
    this.base = base;
    this.canon = canon;
    let groupBottomRight = super.getPosition();
    this.centerPosRelative = vectorSub(groupBottomRight, center); // relative to bottom right
    this.canonEdgePosition = vectorAdd(this.centerPosRelative, { x: 10, y: 0 });
  }

  override setPosition(postion: { x: number; y: number }) {
    return super.setPosition(vectorAdd(postion, this.centerPosRelative));
  }

  override getPosition() {
    return vectorSub(super.getPosition(), this.centerPosRelative);
  }

  getCanonEdgePosition() {
    return this.canonEdgePosition;
  }

  setHurtGlowValue(value: number) {
    // this.entityObjectProxy.set({
    //   width: (this.fullProgressWidth * value) / this.maxValue,
    // });
  }
}
