import { EffectsSequencesManager } from '../effects/effects-sequences-manager';
import { DevicesInputModule } from '../input-from-devices/devices-input-module';
import { EcsManager } from '../world/ecs-manager';

export type DependenciesList = {
  effectsSequenceManager: EffectsSequencesManager;
  worldsManager: EcsManager;
  devicesInputModule: DevicesInputModule;
};

export function dependenciesFactory(
  canvas: fabric.StaticCanvas,
  uiCanvas: fabric.Canvas
): DependenciesList {
  return {
    effectsSequenceManager: new EffectsSequencesManager(canvas),
    worldsManager: new EcsManager(canvas, uiCanvas),
    devicesInputModule: new DevicesInputModule(canvas, uiCanvas),
  };
}
