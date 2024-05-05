import {
  Dimentations,
  State,
  UiBuildTreeNode,
  UiNodeType,
  UiTreeNode,
} from "./ui-tree-node";
import { fabric } from "fabric";

export class UiTextTreeNode implements UiTreeNode {
  text: fabric.Text;
  id: string;
  type: UiNodeType;
  isDirty: boolean = false;
  children: UiTreeNode[];
  state: State = State.None;

  constructor(
    id: string,
    public originalBuildNode: UiBuildTreeNode,
    text: string,
    public dimentions: Dimentations
  ) {
    this.id = id;
    this.text = new fabric.Text(text, {
      top: dimentions.y,
      left: dimentions.x,
      width: dimentions.width,
      height: dimentions.height,
    });
    this.children = [];
    this.type = "text";
  }

  getRenderedComponents(): fabric.Object[] {
    return [this.text];
  }

  setTopLeft(topLeft: { x: number; y: number }) {
    this.text.set({
      top: topLeft.y,
      left: topLeft.x,
    });
  }
}
