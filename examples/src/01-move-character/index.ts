import { graphicsDef } from "@protogame/built-in-ecs-components";
import { DependenciesList } from "@protogame/dependencies-management";
import { GraphicsComponent } from "@protogame/entity-object-proxy";
import { generateCircle } from "@protogame/basic-shapes";
import { SystemsModuleBuilder } from "@protogame/scheduler";
import { createSystem } from "@protogame/world";
import { createSystemWithQueries } from "@protogame/world";

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

export const handleKeysForMainCharacter = createSystemWithQueries(
  {
    entities: {
      graphics: graphicsDef,
    },
  },
  (_deps, queryResults) => {
    const snapshot =
      _deps.devicesInputModule.inputFromDevicesCollector.calculateInputSnapshot();
    let main = queryResults.entities[0];

    const deltaLeft =
      snapshot.keysState.get("ArrowLeft")?.isDown ?? false ? 2 : 0;
    const deltaRight =
      snapshot.keysState.get("ArrowRight")?.isDown ?? false ? 2 : 0;
    const deltaUp = snapshot.keysState.get("ArrowUp")?.isDown ?? false ? 2 : 0;
    const deltaDown =
      snapshot.keysState.get("ArrowDown")?.isDown ?? false ? 2 : 0;

    let { x, y } = main.graphics.getPosition();
    main.graphics.setPosition({
      x: x + deltaRight - deltaLeft,
      y: y + deltaDown - deltaUp,
    });
  }
);

export const gameModule = new SystemsModuleBuilder()
  .addInitSystem(initEntitiesSystem)
  .addSystem(handleKeysForMainCharacter)
  .build();
