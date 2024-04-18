import { fabric } from 'fabric';
import { IntervalBetweenFramesMilisecs } from '../constants';
import { IEffect } from './efffect';

function calculateDeltaForNumberEffect(
  timeDurationInMilisec: number,
  params: EffectNumberAnimationParameters | undefined
) {
  return params !== undefined
    ? ((params.endValue - params.startValue) * IntervalBetweenFramesMilisecs) /
        timeDurationInMilisec
    : undefined;
}

export interface EffectNumberAnimationParameters {
  startValue: number;
  endValue: number;
}

export interface EffectColorAnimationParameters {
  startColor: fabric.Color;
  endColor: fabric.Color;
}

export class NewGradientEffect implements IEffect {
  renderedObject: fabric.Circle;
  curr = 0;
  currTime: number = 0;

  r1Current: number;
  r1Delta = calculateDeltaForNumberEffect(
    this.timeDurationInMilisec,
    this.animationParameters.r1Animation
  );
  stepCurrent: number;
  stepDelta = calculateDeltaForNumberEffect(
    this.timeDurationInMilisec,
    this.animationParameters.stepAnimation
  );

  isDone = false;

  constructor(
    private radius: number,
    center: { x: number; y: number },
    private color: string,
    private animationParameters: {
      r1Animation?: EffectNumberAnimationParameters;
      stepAnimation?: EffectNumberAnimationParameters;
      colorAnimation?: EffectColorAnimationParameters;
    },
    private timeDurationInMilisec: number
  ) {
    this.renderedObject = new fabric.Circle({
      radius: radius,
      left: center.x,
      top: center.y,
      originX: 'center',
      originY: 'center',
      fill: new fabric.Gradient({
        type: 'radial',
        coords: {
          x1: this.radius,
          y1: this.radius,
          x2: this.radius,
          y2: this.radius,

          r1: animationParameters.r1Animation?.startValue ?? 0, // inner circle radius
          r2: radius, // outer circle radius
        },
        colorStops: [
          { offset: 0, color: color }, // first color stop
          { offset: 1, color: 'grey' }, // second color stop
        ],
      }),
    });
    this.r1Current = animationParameters.r1Animation?.startValue ?? 0;
    this.stepCurrent = animationParameters.r1Animation?.startValue ?? 0;
  }

  update() {
    if (this.isDone) return;
    if (this.animationParameters.r1Animation) {
      const params = this.animationParameters.r1Animation;
      const delta = this.r1Delta!;
      if (this.r1Current + delta < params.endValue) {
        this.r1Current += delta;
      } else {
        this.r1Current = params.endValue;
      }
    }
    if (this.animationParameters.stepAnimation) {
      const params = this.animationParameters.stepAnimation;
      const delta = this.stepDelta!;
      if (this.stepCurrent + delta < params.endValue) {
        this.stepCurrent += delta;
      } else {
        this.stepCurrent = params.endValue;
      }
    }
    let gradient = new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: this.radius,
        y1: this.radius,
        x2: this.radius,
        y2: this.radius,

        r1: this.r1Current, // inner circle radius
        r2: this.radius, // outer circle radius
      },
      colorStops: [
        { offset: 0, color: 'rgba(173,255,47,0)' }, // second color stop
        { offset: this.stepCurrent, color: this.color }, // first color stop
        { offset: 1, color: 'rgba(173,255,47,0)' }, // second color stop
      ],
    });
    this.renderedObject.set('fill', gradient);
    if (this.currTime >= this.timeDurationInMilisec) {
      this.isDone = true;
    } else {
      this.currTime += IntervalBetweenFramesMilisecs;
    }
  }
}
