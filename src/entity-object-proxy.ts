import { fabric } from "fabric";

export class GraphicsComponent {
  constructor(private graphics: fabric.Object) {}

  getGraphics(): fabric.Object {
    return this.graphics;
  }

  setPosition(postion: { x: number; y: number }) {
    this.graphics.set({
      top: postion.y,
      left: postion.x,
    });
  }

  getPosition() {
    return {
      y: this.graphics.top!,
      x: this.graphics.left!,
    };
  }
}
