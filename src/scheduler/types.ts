import { DependenciesList } from '../dependencies-management/get-dependencies';
import { StateDefinition } from '../world/state';

export enum StateEventType {
  Enter,
  Exit,
  In,
}

export interface SystemRunCritiria {
  system?: (dependencies: DependenciesList) => boolean;
}

export function when(): SystemRunCritiriaBuilder {
  return new SystemRunCritiriaBuilder();
}

export class SystemRunCritiriaBuilder {
  stateEventType?: StateEventType;
  target?: number;
  stateIdentifier?: number;

  isInState<T extends number>(stateDef: StateDefinition<T>, value: T) {
    this.stateEventType = StateEventType.In;
    this.target = value;
    this.stateIdentifier = stateDef.getIdentifier();
    return this;
  }

  isEnterState<T extends number>(stateDef: StateDefinition<T>, value: T) {
    this.stateEventType = StateEventType.Enter;
    this.target = value;
    this.stateIdentifier = stateDef.getIdentifier();
    return this;
  }
  isExitState<T extends number>(stateDef: StateDefinition<T>, value: T) {
    this.stateEventType = StateEventType.Exit;
    this.target = value;
    this.stateIdentifier = stateDef.getIdentifier();
    return this;
  }

  build(): SystemRunCritiria | undefined {
    const identifier = this.stateIdentifier;
    if (!identifier) return undefined;
    return {
      system: (deps) => {
        if (this.stateEventType === StateEventType.In) {
          return deps.worldsManager.getState(identifier) === this.target;
        } else if (this.stateEventType === StateEventType.Enter) {
          return (
            (deps.worldsManager.getFormerState(identifier) !== undefined ||
              deps.worldsManager.wasStateJustCreated(identifier)) &&
            deps.worldsManager.getState(identifier) === this.target
          );
        } else if (this.stateEventType === StateEventType.Exit) {
          deps.worldsManager.getFormerState(identifier) === this.target;
        }
        return false;
      },
    };
  }
}

export enum SystemModuleTargetType {
  Modules,
  System,
}
export interface SystemModule {
  critiria: SystemRunCritiria;
  targetsInit: {
    type: SystemModuleTargetType;
    target: SystemModule | SystemDescriptor;
  }[];
  targetsLoop: {
    type: SystemModuleTargetType;
    target: SystemModule | SystemDescriptor;
  }[];
}

export interface SystemDescriptor {
  system: (dependencies: DependenciesList) => void;
}
