import { IntervalBetweenFramesMilisecs } from '../constants';
import {
  DependenciesList,
  dependenciesFactory,
} from '../dependencies-management/get-dependencies';
import {
  SystemDescriptor,
  SystemModuleTargetType,
  SystemModule,
} from './types';

export class GameLoopScheduler {
  constructor(
    private canvas: fabric.StaticCanvas,
    private uiCanvas: fabric.Canvas
  ) {
    this.depedencies = dependenciesFactory(canvas, uiCanvas);
  }

  depedencies: DependenciesList;

  setModule(systemsModule: SystemModule) {
    this.rootModule = systemsModule;
  }

  startLoop() {
    this.gameInit();
    setInterval(() => {
      this.gameLoop();
      this.depedencies.worldsManager.onEndLoop();
      this.canvas.renderAll();
      this.uiCanvas.renderAll();
    }, IntervalBetweenFramesMilisecs);
  }
  rootModule!: SystemModule;

  generateRootModule(
    initSystems: SystemDescriptor[],
    loopSystems: SystemDescriptor[]
  ): SystemModule {
    return {
      critiria: {
        system: undefined,
      },
      targetsInit: initSystems.map((x) => ({
        type: SystemModuleTargetType.System,
        target: x,
      })),
      targetsLoop: loopSystems.map((x) => ({
        type: SystemModuleTargetType.System,
        target: x,
      })),
    };
  }

  gameInitRec(module: SystemModule) {
    if (
      module.critiria.system &&
      module.critiria.system(this.depedencies) == false
    ) {
      return;
    }
    module.targetsInit.forEach(({ type, target }) => {
      if (type == SystemModuleTargetType.System) {
        (target as SystemDescriptor).system(this.depedencies);
      } else if (type == SystemModuleTargetType.Modules) {
        this.gameInitRec(target as SystemModule);
      }
    });
  }

  gameInit() {
    this.gameInitRec(this.rootModule);
  }

  gameLoopRec(module: SystemModule) {
    if (
      module.critiria.system &&
      module.critiria.system(this.depedencies) === false
    ) {
      return;
    }
    module.targetsLoop.forEach(({ type, target }) => {
      if (type == SystemModuleTargetType.System) {
        (target as SystemDescriptor).system(this.depedencies);
      } else if (type == SystemModuleTargetType.Modules) {
        this.gameLoopRec(target as SystemModule);
      }
    });
  }

  gameLoop() {
    this.gameLoopRec(this.rootModule);
  }
}
