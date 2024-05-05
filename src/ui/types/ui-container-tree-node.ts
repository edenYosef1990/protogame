import {
  Color,
  Dimentations,
  State,
  UiBuildTreeNode,
  UiNodeType,
  UiTreeNode,
} from "./ui-tree-node";
import { fabric } from "fabric";

export class UiContainerTreeNode implements UiTreeNode {
  rectangle: fabric.Rect;
  id: string;
  type: UiNodeType;
  isDirty: boolean = false;
  dimentions: Dimentations;
  children: UiTreeNode[];
  state: State = State.None;

  constructor(
    id: string,
    public originalBuildNode: UiBuildTreeNode,
    width: number,
    height: number,
    bottomRight: { x: number; y: number },
    backgroundColor: Color,
    children: UiTreeNode[]
  ) {
    this.id = id;
    this.rectangle = new fabric.Rect({
      top: bottomRight.y,
      left: bottomRight.x,
      width,
      height,
      rx: 20,
      ry: 20,
      fill: backgroundColor,
    });
    this.dimentions = {
      x: bottomRight.x,
      y: bottomRight.y,
      width,
      height,
    };
    this.children = children;
    this.type = "block";
  }

  getRenderedComponents(): fabric.Object[] {
    let childrenRenderedComponents = this.children.reduce(
      (prev: fabric.Object[], curr: UiTreeNode) => [
        ...prev,
        ...curr.getRenderedComponents(),
      ],
      []
    );
    return [this.rectangle, ...childrenRenderedComponents];
  }

  setTopLeft(topLeft: { x: number; y: number }) {
    this.rectangle.set({
      top: topLeft.y,
      left: topLeft.x,
    });
  }
}
