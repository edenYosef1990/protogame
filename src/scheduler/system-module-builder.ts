import { DependenciesList } from "../dependencies-management/get-dependencies";
import {
  SystemModule,
  SystemModuleTargetType,
  SystemRunCritiria,
  SystemRunCritiriaBuilder,
} from "./types";

export class SystemsModuleBuilder {
  private _rootModule: SystemModule = {
    critiria: {},
    targetsInit: [],
    targetsLoop: [],
  };

  addLoopModule(systemsModule: SystemModule) {
    this._rootModule.targetsLoop.push({
      type: SystemModuleTargetType.Modules,
      target: systemsModule,
    });
  }

  addInitModule(systemsModule: SystemModule) {
    this._rootModule.targetsLoop.push({
      type: SystemModuleTargetType.Modules,
      target: systemsModule,
    });
  }

  addSystem(
    system: (dependencies: DependenciesList) => void,
    critia?: SystemRunCritiriaBuilder
  ) {
    let critiria = critia?.build();
    this._rootModule.targetsLoop.push(
      critiria
        ? {
            type: SystemModuleTargetType.Modules,
            target: {
              critiria,
              targetsInit: [],
              targetsLoop: [
                {
                  type: SystemModuleTargetType.System,
                  target: { system },
                },
              ],
            },
          }
        : {
            type: SystemModuleTargetType.System,
            target: { system },
          }
    );
    return this;
  }

  addInitSystem(
    system: (dependencies: DependenciesList) => void,
    critia?: SystemRunCritiria
  ) {
    this._rootModule.targetsInit.push(
      critia
        ? {
            type: SystemModuleTargetType.Modules,
            target: {
              critiria: critia,
              targetsLoop: [],
              targetsInit: [
                {
                  type: SystemModuleTargetType.System,
                  target: { system },
                },
              ],
            },
          }
        : {
            type: SystemModuleTargetType.System,
            target: { system },
          }
    );
    return this;
  }

  build() {
    return this._rootModule;
  }
}
