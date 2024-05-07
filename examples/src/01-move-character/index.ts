import { graphicsDef } from "../../../src/built-in-ecs-components";
import { DependenciesList } from "../../../src/dependencies-management/get-dependencies";
import { GraphicsComponent } from "../../../src/entity-object-proxy";
import { generateCircle } from "../../../src/basic-shapes";
import { SystemsModuleBuilder } from "../../../src/scheduler";
import { createSystemWithQueries } from "../../../src/world/system/create-system-with-queries";

export function genBoidPlayer(
  depedencies: DependenciesList,
  x: number,
  y: number
) {
  return depedencies.worldsManager.initEntity(
    {
      renderComp: graphicsDef,
    },
    {
      renderComp: new GraphicsComponent(generateCircle("blue", { x, y }, 10)),
    }
  );
}

export const initEntitiesSystem = createSystemWithQueries(
  {},
  (depedencies, _query) => {
    genBoidPlayer(depedencies, 100, 100);
  }
);

export const gameModule = new SystemsModuleBuilder()
  .addInitSystem(initEntitiesSystem)
  .build();
