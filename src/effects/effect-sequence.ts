import { IntervalBetweenFramesMilisecs } from "../constants";
import { Color } from "../ui/types/ui-tree-node";
import {
  getVectorLength,
  normalizeVector,
  vectorAdd,
  vectorSub,
} from "../utils";
import { BloodDropParticalEffect } from "./blood-particle-effect";
import { DisapperingParticalEffect } from "./disappering-particle-effect";
import { IEffect } from "./efffect";
import { NewGradientEffect } from "./gradient-effect";

export interface EffectSequenceProccess {
  executeAndTryGetEffects(): IEffect[] | null;
  isDone(): boolean;
}

export function generateGunfireEffectCommand(position: {
  x: number;
  y: number;
}) {
  return new ExplosionEffectCommand(position, 10, 130);
}

export function generateBigExplostionEffectCommand(position: {
  x: number;
  y: number;
}) {
  return new ExplosionEffectCommand(position, 200, 500);
}

export class ExplosionEffectCommand implements EffectSequenceProccess {
  private _isDone = false;

  constructor(
    private position: { x: number; y: number },
    private radius: number,
    private totalAnimationTime: number
  ) {}

  explosionEffectFactory(position: { x: number; y: number }, radius: number) {
    return new NewGradientEffect(
      radius,
      position,
      Color.Yellow,
      {
        stepAnimation: {
          startValue: 0,
          endValue: 1,
        },
      },
      this.totalAnimationTime
    );
  }
  executeAndTryGetEffects(): IEffect[] | null {
    if (!this._isDone) {
      this._isDone = true;
      return [this.explosionEffectFactory(this.position, this.radius)];
    }
    return null;
  }

  isDone(): boolean {
    return this._isDone;
  }
}

export class ConcurrentEffectList implements EffectSequenceProccess {
  private areDoneFlags: boolean[];
  constructor(private effects: EffectSequenceProccess[]) {
    this.areDoneFlags = Array(effects.length).fill(false);
  }

  executeAndTryGetEffects(): IEffect[] | null {
    if (this._isDone) {
      return null;
    }
    const arentDone = this.areDoneFlags
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => value === false)
      .map(({ index }) => index);

    if (arentDone.length === 0) {
      this._isDone = true;
      return null;
    }

    let sumEffects: IEffect[] = [];

    for (const effectIndex of arentDone) {
      let effect = this.effects[effectIndex];
      if (effect.isDone()) {
        this.areDoneFlags[effectIndex] = true;
        continue;
      }
      sumEffects = [...sumEffects, ...(effect.executeAndTryGetEffects() ?? [])];
    }
    return sumEffects;
  }

  private _isDone = false;
  isDone(): boolean {
    return this._isDone;
  }
}

export class ConsecutiveEffectsList implements EffectSequenceProccess {
  private currrentIndex = 0;
  constructor(private effects: EffectSequenceProccess[]) {}

  executeAndTryGetEffects(): IEffect[] | null {
    if (this.effects[this.currrentIndex].isDone()) {
      this.currrentIndex += 1;
    }
    if (this.currrentIndex === this.effects.length) {
      this._isDone = true;
      return null;
    }
    return this.effects[this.currrentIndex].executeAndTryGetEffects();
  }

  private _isDone = false;
  isDone(): boolean {
    return this._isDone;
  }
}

export class BleedingEffectCommand implements EffectSequenceProccess {
  current: { x: number; y: number };
  private timeLeftToNextInterval: number;
  private totalTime: number;
  _isDone = false;

  constructor(start: { x: number; y: number }) {
    this.current = start;
    this.timeLeftToNextInterval = 0;
    this.totalTime = 1000;
  }

  generateBloodDrop() {
    return new BloodDropParticalEffect(
      3,
      this.current,
      { r: 164, b: 23, g: 32 },
      500
    );
  }

  executeAndTryGetEffects(): IEffect[] | null {
    if (this._isDone) {
      return null;
    }
    if (this.totalTime <= 0) {
      this._isDone = true;
      return null;
    }
    this.totalTime -= IntervalBetweenFramesMilisecs;
    if (this.timeLeftToNextInterval > IntervalBetweenFramesMilisecs) {
      this.timeLeftToNextInterval -= IntervalBetweenFramesMilisecs;
      return null;
    } else {
      this.timeLeftToNextInterval = Math.random() * 200;
      return [this.generateBloodDrop()];
    }
  }
  isDone(): boolean {
    return this._isDone;
  }
}

export class ShotTrailEffectCommand implements EffectSequenceProccess {
  delta: { x: number; y: number };
  current: { x: number; y: number };
  _isDone = false;
  timeLeftToNextInterval = 0;

  disapperaingParticalEffectFactory(position: { x: number; y: number }) {
    return new DisapperingParticalEffect(
      7,
      position,
      { r: 100, b: 100, g: 100 },
      4000
    );
  }

  constructor(
    start: { x: number; y: number },
    private end: { x: number; y: number },
    private timeIntervalBetweenEffects: number
  ) {
    this.delta = normalizeVector(vectorSub(end, start), 10);
    this.current = start;
  }

  executeAndTryGetEffects(): IEffect[] | null {
    if (this._isDone) {
      return null;
    }
    const length = getVectorLength(vectorSub(this.end, this.current));
    if (length < 60) {
      this._isDone = true;
      return null;
    }
    this.current = vectorAdd(this.current, this.delta);

    if (this.timeLeftToNextInterval > IntervalBetweenFramesMilisecs) {
      this.timeLeftToNextInterval -= IntervalBetweenFramesMilisecs;
      return null;
    } else {
      this.timeLeftToNextInterval = this.timeIntervalBetweenEffects;
      return [this.disapperaingParticalEffectFactory(this.current)];
    }
  }
  isDone(): boolean {
    return this._isDone;
  }
}

export class EffectAndThenAction implements EffectSequenceProccess {
  constructor(
    private effect: EffectSequenceProccess,
    private onEffectEnd: () => void
  ) {}

  executeAndTryGetEffects(): IEffect[] | null {
    if (this._isDone) {
      return null;
    }
    if (this.effect.isDone()) {
      this.onEffectEnd();
      this._isDone = true;
      return null;
    }
    return this.effect.executeAndTryGetEffects();
  }

  private _isDone = false;
  isDone(): boolean {
    return this._isDone;
  }
}
