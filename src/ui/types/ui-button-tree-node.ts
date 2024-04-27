import { IntervalBetweenFramesMilisecs } from "../../constants";
import {
  Color,
  Dimentations,
  State,
  UiBuildTreeNode,
  UiNodeType,
  UiTreeNode,
} from "./ui-tree-node";
import { fabric } from "fabric";

export class UiButtonTreeNode implements UiTreeNode {
  text: fabric.Text;
  rectangle: fabric.Rect;
  id: string;
  type: UiNodeType;
  dimentions: Dimentations;
  children: UiTreeNode[];
  isDirty: boolean = false;
  state: State = State.None;
  readonly totalTimeOfClickDisplayMilisec: number = 100;
  timeLeftForClickDisplayMilisec: number = 0;

  constructor(
    id: string,
    public originalBuildNode: UiBuildTreeNode,
    text: string,
    width: number,
    height: number,
    topLeft: { x: number; y: number },
    private backgroundColor: Color
  ) {
    this.id = id;
    this.rectangle = new fabric.Rect({
      top: topLeft.y,
      left: topLeft.x,
      width,
      height,
      fill: backgroundColor,

      hasBorders: false,
      hasControls: false,
      selectable: false,
      hasRotatingPoint: false,
      objectCaching: false,
    });
    this.text = new fabric.Text(text, {
      top: topLeft.y,
      left: topLeft.x,
      width,
      height,

      hasBorders: false,
      hasControls: false,
      selectable: false,
      hasRotatingPoint: false,
      objectCaching: false,
    });
    this.dimentions = {
      x: topLeft.x,
      y: topLeft.y,
      width,
      height,
    };
    this.children = [];
    this.type = "button";
  }

  getRenderedComponents(): fabric.Object[] {
    return [this.rectangle, this.text];
  }

  setTopLeft(topLeft: { x: number; y: number }) {
    this.rectangle.set({
      top: topLeft.y,
      left: topLeft.x,
    });
    this.text.set({
      top: topLeft.y,
      left: topLeft.x,
    });
  }

  onHovered() {
    if (this.state === State.PressedDown) return;
    this.isDirty = true;
    this.state = State.Hovered;
    this.rectangle.set({ fill: Color.Yellow });
    // console.log(`element ${this.id} is hovered`);
  }

  onClicked() {
    // if (this.state !== State.None) return;
    this.isDirty = true;
    this.state = State.PressedDown;
    this.timeLeftForClickDisplayMilisec = this.totalTimeOfClickDisplayMilisec;
    this.rectangle.set({ fill: Color.Red });
    console.log(`element ${this.id} is clicked`);
  }

  //return true if reset to idle state succeed
  tryResetInteractionStateToIdle(): boolean {
    if (this.state !== State.PressedDown) {
      //the dirt state can be turned hover immeditly after set dirty state
      this.rectangle.set({ fill: this.backgroundColor });
      this.state = State.None;
      return true;
    }
    if (
      this.state === State.PressedDown &&
      this.timeLeftForClickDisplayMilisec <= 0
    ) {
      //the dirt state just stopped happening
      this.rectangle.set({ fill: this.backgroundColor });
      this.state = State.None;
      return true;
    } else if (this.state === State.PressedDown) {
      //the dirt state still occures
      this.timeLeftForClickDisplayMilisec -= IntervalBetweenFramesMilisecs;
      return false;
    } else {
      return false;
    }
  }
}
