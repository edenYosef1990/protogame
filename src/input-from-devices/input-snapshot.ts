export interface KeyState {
  isDown: boolean;
  isThereClickEventUnconsumed: boolean;
}

export interface MouseKeyState extends KeyState {
  currentPosition: { x: number; y: number } | null;
  currentUiPosition: { x: number; y: number } | null;
}

export interface InputSnapshot {
  keysState: Map<string, KeyState>;
  leftMouseKey: MouseKeyState;
}

export class KeyTracker {
  constructor(public readonly key: string) {}
  isDown: boolean = false;

  update(isDown: boolean) {
    this.isDown = isDown;
  }
}

export function updateKeyTrackerFromSnapshot(
  tracker: KeyTracker,
  snapshot: InputSnapshot
) {
  let keyState = snapshot.keysState.get(tracker.key);
  tracker.update(keyState?.isDown ?? false);
}
