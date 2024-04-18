import { fabric } from 'fabric';

export class EntityObjectProxy {
  constructor(private renderedObject: fabric.Object) {}

  getRenderedObject(): fabric.Object {
    return this.renderedObject;
  }

  setPosition(postion: { x: number; y: number }) {
    this.renderedObject.set({
      top: postion.y,
      left: postion.x,
    });
  }

  getPosition() {
    return {
      y: this.renderedObject.top!,
      x: this.renderedObject.left!,
    };
  }
}
