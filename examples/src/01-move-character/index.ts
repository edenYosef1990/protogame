import { renderedProxyDef } from "../../../src/built-in-ecs-components";
import { DependenciesList } from "../../../src/dependencies-management/get-dependencies";
import { gene } from "../../../src/physical-object";
import { SystemsModuleBuilder } from "../../../src/scheduler";

export function genBoidPlayer(
  depedencies: DependenciesList,
  x: number,
  y: number,
  groupId: number
) {
  return depedencies.worldsManager.initEntity(
    {
      physicalObjectDef,
      renderComp: renderedProxyDef,
    },
    {
      physicalObjectDef: generatePhysicalObject({ x, y }, 10),
      renderComp: generateRenderedObject("blue", { x, y }, 10),
    }
  );
}

const gameModule = new SystemsModuleBuilder().addInitSystem().build();
