import { Dimentations, State, UiTreeNode } from './ui-tree-node';

export function isPosInsideRect(mousePos: { x: number; y: number }, rectDims: Dimentations) {
  return (
    rectDims.x < mousePos.x &&
    mousePos.x < rectDims.x + rectDims.width &&
    rectDims.y < mousePos.y &&
    mousePos.y < rectDims.y + rectDims.height
  );
}

//return true if subtree success to set to idle
export function tryResetToIdleStateInSubtree(node: UiTreeNode): boolean {
  if (!node.isDirty) return true; //subtee is not dirty - return false
  if (
    node.state !== State.None && // the node itself is the root of dirtiness
    node.tryResetInteractionStateToIdle
  ) {
    const isIdle = node.tryResetInteractionStateToIdle();
    if (isIdle) {
      // the node just stopped being dirty - set dirty flag to false and return false
      node.isDirty = false;
      return true;
    } else {
      // the node itself will continue to make subtree dity - return false
      return false;
    }
  }
  for (const child of node.children) {
    if (!tryResetToIdleStateInSubtree(child)) {
      return false; // the sub tree will continue to be dirty
    }
  }
  node.isDirty = false;
  return true;
}

export function getTargetOfMouse(node: UiTreeNode, mousePos: { x: number; y: number }): string | undefined {
  if (!isPosInsideRect(mousePos, node.dimentions)) return undefined;
  if (node.children.length === 0) return node.id;
  for (const child of node.children) {
    const id = getTargetOfMouse(child, mousePos);
    if (id === undefined) continue;
    return id;
  }
  return undefined;
}

export function updateHoveredElementsInSubtree(node: UiTreeNode, mousePos: { x: number; y: number }): boolean {
  if (!(node.originalBuildNode?.isCatchingInteraction ?? false)) return false;
  if (!isPosInsideRect(mousePos, node.dimentions)) return false;
  if (node.children.length === 0) {
    if (node.onHovered) {
      node.onHovered();
    }
    return true;
  }
  for (const child of node.children) {
    const res = updateHoveredElementsInSubtree(child, mousePos);
    node.isDirty = node.isDirty || child.isDirty;
    if (res) {
      return true;
    }
  }
  return false;
}

export function updateClickedElementsInSubtree(node: UiTreeNode, mousePos: { x: number; y: number }): boolean {
  if (!(node.originalBuildNode?.isCatchingInteraction ?? false)) return false;
  if (!isPosInsideRect(mousePos, node.dimentions)) return false;
  if (node.children.length === 0) {
    if (node.onClicked) node.onClicked();
    return true;
  }
  for (const child of node.children) {
    const res = updateClickedElementsInSubtree(child, mousePos);
    node.isDirty = node.isDirty || child.isDirty;
    if (res) {
      return true;
    }
  }
  return false;
}

export function getRederedUiTree(node: UiTreeNode) {
  return node.getRenderedComponents();
}
