import { EntityObjectProxy } from "../../entity-object-proxy";
import { EntityUiObjectProxy } from "./entity-ui-object-proxy";
import {
  Color,
  Dimentations,
  State,
  UiBuildTreeNode,
  UiNodeType,
  UiTreeNode,
} from "./ui-tree-node";
import { fabric } from "fabric";

export class UiProgressBarTreeNode implements UiTreeNode {
  readonly frameWidth = 5;
  progressRectangle: fabric.Rect;
  frameRectangle: fabric.Rect;
  id: string;
  type: UiNodeType;
  dimentions: Dimentations;
  isDirty: boolean = false;
  children: UiTreeNode[];
  state: State = State.None;

  constructor(
    id: string,
    width: number,
    height: number,
    public originalBuildNode: UiBuildTreeNode | null,
    topLeft: { x: number; y: number },
    progressColor: Color,
    FrameColor: Color,
    private currValue: number,
    private maxValue: number
  ) {
    this.id = id;
    this.progressRectangle = new fabric.Rect({
      top: topLeft.y,
      left: topLeft.x,
      width,
      height,
      backgroundColor: progressColor,
      fill: progressColor,
    });
    this.frameRectangle = new fabric.Rect({
      top: topLeft.y - this.frameWidth,
      left: topLeft.x - this.frameWidth,
      width: width + 3 * this.frameWidth,
      height: height + this.frameWidth,
      strokeWidth: this.frameWidth,
      fill: Color.Transparent,
      stroke: Color.Black,
    });
    this.dimentions = {
      x: topLeft.x + 2 * this.frameWidth,
      y: topLeft.y + 2 * this.frameWidth,
      width: width + 2 * this.frameWidth,
      height: height + 2 * this.frameWidth,
    };
    this.setValue(this.currValue);
    this.children = [];
    this.type = "button";
  }

  getRenderedComponents(): fabric.Object[] {
    return [this.progressRectangle];
  }

  setValue(value: number) {
    this.progressRectangle.set({
      width: (this.progressRectangle.width! * value) / this.maxValue,
    });
  }

  generateWorldObject() {
    return new ProgressBarEntityObjectProxy(
      new fabric.Group([this.frameRectangle, this.progressRectangle]),
      this.dimentions.width,
      this.maxValue
    );
  }

  setTopLeft(topLeft: { x: number; y: number }) {
    this.progressRectangle.set({
      top: topLeft.y,
      left: topLeft.x,
    });
    this.frameRectangle.set({
      top: topLeft.y + this.frameWidth,
      left: topLeft.x + this.frameWidth,
    });
    this.dimentions = {
      ...this.dimentions,
      x: topLeft.x + 2 * this.frameWidth,
      y: topLeft.y + 2 * this.frameWidth,
    };
  }
}

export function setTopLeftInWorld(
  proxyObject: EntityObjectProxy,
  topLeft: { x: number; y: number },
  frameWidth: number
) {
  let group = proxyObject.getRenderedObject() as fabric.Group;
  {
    group.item(0).set({
      top: topLeft.y,
      left: topLeft.x,
    });
    group.item(1).set({
      top: topLeft.y + frameWidth,
      left: topLeft.x + frameWidth,
    });
  }
}

export class ProgressBarEntityObjectProxy extends EntityObjectProxy {
  constructor(
    public progressBar: fabric.Group,
    public fullProgressWidth: number,
    public maxValue: number
  ) {
    super(progressBar);
  }

  setValue(value: number) {
    this.progressBar.item(1).set({
      width: (this.fullProgressWidth * value) / this.maxValue,
    });
  }
}
