import { fabric } from "fabric";
import { UiBuildTreeNode, UiTreeNode } from "./ui-tree-node";
import {
  getTargetOfMouse,
  updateClickedElementsInSubtree,
  updateHoveredElementsInSubtree,
} from "../detect-and-handle-ui-interaction";
import { UiTextTreeNode } from "./ui-text-tree-node";
import { reloadChildrenForUiNode } from "../reload-children-for-ui-node";

export class EntityUiObjectProxy {
  constructor(private node: UiTreeNode) {}

  getRenderedObject(): fabric.Object[] {
    return this.node.getRenderedComponents();
  }

  getTagetOfMouse(pos: { x: number; y: number }) {
    return getTargetOfMouse(this.node, pos);
  }

  handleHovering(pos: { x: number; y: number }) {
    return updateHoveredElementsInSubtree(this.node, pos);
  }

  handleClick(pos: { x: number; y: number }) {
    return updateClickedElementsInSubtree(this.node, pos);
  }

  private findElementInNodeRec(
    node: UiTreeNode,
    id: string
  ): UiTreeNode | null {
    if (node.id === id) return node;
    for (const child of node.children) {
      const res = this.findElementInNodeRec(child, id);
      if (res !== null) return res;
    }
    return null;
  }

  public findElementInNode(id: string): UiTreeNode | null {
    return this.findElementInNodeRec(this.node, id);
  }

  private findFatherOfElementInNode(
    node: UiTreeNode,
    id: string
  ): { node: UiTreeNode; index: number } | null {
    if (node.children.length === 0) return null;
    let index = 0;
    for (const child of node.children) {
      if (child.id === id) return { node, index };
      index += 1;
    }
    return null;
  }

  replaceElementInUi(
    targetId: string,
    replaceWith: UiBuildTreeNode
  ): {
    toAdd: fabric.Object[];
    toRemove: fabric.Object[];
  } {
    let locationFromFather = this.findFatherOfElementInNode(
      this.node,
      targetId
    );
    if (locationFromFather === null)
      throw new Error(`ui node by id ${targetId} not found`);
    let toRemove = locationFromFather.node.getRenderedComponents();
    locationFromFather.node.originalBuildNode?.children.splice(
      locationFromFather.index,
      1,
      replaceWith
    );
    reloadChildrenForUiNode(locationFromFather.node);
    return { toAdd: locationFromFather.node.getRenderedComponents(), toRemove };
  }

  changeTextValueInUi(targetId: string, replaceWith: string) {
    let node = this.findElementInNodeRec(this.node, targetId);
    if (node === null) throw new Error(`ui node by id ${targetId} not found`);
    if (node.type !== "text")
      throw new Error(`ui node by id ${targetId} is not a text element`);
    let textNode = node as UiTextTreeNode;
    textNode.text.set({ text: replaceWith });
  }

  getNode() {
    return this.node;
  }
}
