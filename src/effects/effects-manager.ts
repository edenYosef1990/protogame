import { IEffect } from './efffect';
import { NewGradientEffect } from './gradient-effect';
import { fabric } from 'fabric';

function explosionEffectFactory(position: { x: number; y: number }) {
  return new NewGradientEffect(
    200,
    position,
    'blue',
    {
      stepAnimation: {
        startValue: 0,
        endValue: 1,
      },
    },
    500
  );
}

export class EffectsManager {
  ongoingEffects: IEffect[] = [];
  constructor(
    private adddEffectToCanvas: (object: fabric.Object) => void,
    private removeffectFromCanvas: (object: fabric.Object) => void
  ) {}

  addExplosionEffect(position: { x: number; y: number }) {
    this.addEffect(explosionEffectFactory(position));
  }

  addEffect(effect: IEffect) {
    this.ongoingEffects.push(effect);
    this.adddEffectToCanvas(effect.renderedObject);
  }

  iterate() {
    let toDelete = [];
    for (let i = 0; i < this.ongoingEffects.length; i++) {
      if (this.ongoingEffects[i].isDone) {
        this.removeffectFromCanvas(this.ongoingEffects[i].renderedObject);
        toDelete.push(i);
        continue;
      }
      this.ongoingEffects[i].update();
    }
    toDelete.reverse();
    toDelete.forEach((index) => this.ongoingEffects.splice(index, 1));
  }
}
