import { InputSnapshot, KeyState, MouseKeyState } from './input-snapshot';

export class InputFromDevicesCollector {
  keysCollectedState: Map<string, KeyState> = new Map();
  leftMouseKeyCollectedState: MouseKeyState = {
    isDown: false,
    isThereClickEventUnconsumed: false,
    currentPosition: null,
    currentUiPosition: null,
  };

  constructor() {}

  collectLeftMouseState(state: Partial<MouseKeyState>) {
    this.leftMouseKeyCollectedState = {
      ...this.leftMouseKeyCollectedState,
      ...state,
    };
  }

  collectKey(key: string, state: Partial<KeyState>) {
    const originalState = this.keysCollectedState.get(key)!;
    this.keysCollectedState.set(key, {
      ...originalState,
      ...state,
    });
  }

  //   resetState() {
  //     this.keysCollectedState = new Map();
  //     this.leftMouseKeyCollectedState = {
  //       isDown: false,
  //       isThereClickEventUnconsumed: false,
  //     };
  //   }

  calculateInputSnapshot(): InputSnapshot {
    return {
      keysState: this.keysCollectedState,
      leftMouseKey: this.leftMouseKeyCollectedState,
    };
  }
}
