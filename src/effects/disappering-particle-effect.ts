import { fabric } from "fabric";
import { IntervalBetweenFramesMilisecs } from "../constants";

export class DisapperingParticalEffect {
  renderedObject: fabric.Circle;
  curr = 0;
  currTime: number = 0;
  isDone = false;

  constructor(
    radius: number,
    center: { x: number; y: number },
    private color: { r: number; g: number; b: number },
    private timeDurationInMilisec: number
  ) {
    this.renderedObject = new fabric.Circle({
      radius: radius,
      left: center.x,
      top: center.y,
      originX: "center",
      originY: "center",
      fill: `rgb(${color.r},${color.g},${color.b})`,

      hasBorders: false,
      hasControls: false,
      selectable: false,
      hasRotatingPoint: false,
      objectCaching: false,
    });
  }

  update() {
    if (this.isDone) return;
    if (this.currTime >= this.timeDurationInMilisec) {
      this.isDone = true;
    } else {
      const { r, g, b } = this.color;
      const transpency = this.currTime / this.timeDurationInMilisec;
      const color = `rgba(${r},${g},${b},${1 - transpency})`;
      this.renderedObject.set("fill", color);
      this.currTime += IntervalBetweenFramesMilisecs;
    }
  }
}
