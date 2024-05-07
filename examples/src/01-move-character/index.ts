import { graphicsDef } from "../../../src/built-in-ecs-components";
import { DependenciesList } from "../../../src/dependencies-management/get-dependencies";
import { GraphicsComponent } from "../../../src/entity-object-proxy";
import { generateCircle } from "../../../src/basic-shapes";
import { SystemsModuleBuilder } from "../../../src/scheduler";
import { createSystem } from "../../../src/world/system/create-system";
import { createSystemWithQueries } from "../../../src/world/system/create-system-with-queries";

export function genBoidPlayer(
  depedencies: DependenciesList,
  x: number,
  y: number
) {
  return depedencies.worldsManager.initEntity(
    {
      graphics: graphicsDef,
    },
    {
      graphics: new GraphicsComponent(generateCircle("blue", { x, y }, 10)),
    }
  );
}

export const initEntitiesSystem = createSystem((depedencies) => {
  genBoidPlayer(depedencies, 100, 100);
});

export const moveEntity = createSystemWithQueries(
  {
    entities: {
      graphics: graphicsDef,
    },
  },
  (_, queries) => {
    let singleEntity = queries.entities[0];
    let { x, y } = singleEntity.graphics.getPosition();
    singleEntity.graphics.setPosition({ x, y: y + 1 });
  }
);

export const gameModule = new SystemsModuleBuilder()
  .addInitSystem(initEntitiesSystem)
  .addSystem(moveEntity)
  .build();
