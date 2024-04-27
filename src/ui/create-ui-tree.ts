import {
  calculateGridColumnsDimentions,
  calculateGridRowsDimentions,
} from "./grid/calculate-grid-dimensions";
import {
  calculateIdAreas,
  setChildToAppropiateGridCells,
} from "./grid/create-ui-grid-subtree";
import { UiGridBuildTreeNode } from "./grid/ui-grid-build-tree-node";
import { DisplayChildrenType } from "./types/style-options";
import { UiButtonTreeNode } from "./types/ui-button-tree-node";
import { UiContainerTreeNode } from "./types/ui-container-tree-node";
import { UiTextTreeNode } from "./types/ui-text-tree-node";
import {
  UiTreeNode,
  UiButtonBuildTreeNode,
  UiTextBuildTreeNode,
  UiBlockBuildTreeNode,
  UiBuildTreeNode,
} from "./types/ui-tree-node";

export function patchTreeCatchingInteractionFlagUpwards(
  root: UiBuildTreeNode
): void {
  let rec = (node: UiBuildTreeNode) => {
    if (node.isCatchingInteraction ?? false) return true;
    if (node.children.find((x) => rec(x)) !== undefined) {
      node.isCatchingInteraction = true;
    }
    return false;
  };

  rec(root);
}

export function createUiGridSubtree(node: UiGridBuildTreeNode): UiTreeNode {
  const style = node.style;
  let areaIds: { isMarked: boolean; value: string | null }[][] = [];
  for (const line of node.style.description) {
    let areaIdsInLine = line
      .trimStart()
      .trimEnd()
      .split(/\s+/)
      .map((x) => ({
        isMarked: false,
        value: x !== "." ? x : null,
      }));
    if (
      node.style.columnsefintion !== undefined &&
      node.style.columnsefintion.length !== areaIdsInLine.length
    ) {
      throw new Error("incorrect dimentions of grid!");
    }
    areaIds.push(areaIdsInLine);
  }

  let areaIdsList = calculateIdAreas(areaIds);
  const columnsDimensions = calculateGridColumnsDimentions(node);
  const rowsDimensions = calculateGridRowsDimentions(node);

  return new UiContainerTreeNode(
    node.id,
    node,
    node.dimentions.width,
    node.dimentions.height,
    { x: node.dimentions.x, y: node.dimentions.y },
    style.backgroundColor,
    node.children.map((child) => {
      setChildToAppropiateGridCells(
        node,
        child,
        rowsDimensions,
        columnsDimensions,
        areaIdsList
      );
      return createUiSubtree(child);
    })
  );
}

export function createModal(
  node:
    | UiButtonBuildTreeNode
    | UiTextBuildTreeNode
    | UiBlockBuildTreeNode
    | UiGridBuildTreeNode
): UiTreeNode {
  let nodeTree = createUiSubtree(node);
  patchTreeCatchingInteractionFlagUpwards(nodeTree.originalBuildNode!);
  return nodeTree;
}

export function createUiSubtree(
  node:
    | UiButtonBuildTreeNode
    | UiTextBuildTreeNode
    | UiBlockBuildTreeNode
    | UiGridBuildTreeNode
): UiTreeNode {
  switch (node.type) {
    case "block": {
      const style = node.style;
      if (style.displayChildren === DisplayChildrenType.Flex) {
        const sumWHeights = node.children.reduce(
          (prev: number, current) => prev + current.dimentions.height,
          0
        );
        const gap =
          (node.dimentions.height - sumWHeights) / (node.children.length - 1);
        let currTopLeft = { x: node.dimentions.x, y: node.dimentions.y };
        for (let child of node.children) {
          child.dimentions = {
            ...child.dimentions,
            x: currTopLeft.x,
            y: currTopLeft.y,
          };
          currTopLeft.y += gap;
        }
      } else {
        let currTopCord = node.dimentions.height;
        for (let child of node.children) {
          child.dimentions = { ...child.dimentions, y: currTopCord };
          currTopCord += node.dimentions.height;
        }
      }

      return new UiContainerTreeNode(
        node.id,
        node,
        node.dimentions.width,
        node.dimentions.height,
        { x: node.dimentions.x, y: node.dimentions.y },
        style.backgroundColor,
        node.children.map((child) => createUiSubtree(child))
      );
    }
    case "button": {
      const style = node.style;
      return new UiButtonTreeNode(
        node.id,
        node,
        style.text,
        node.dimentions.width,
        node.dimentions.height,
        { x: node.dimentions.x, y: node.dimentions.y },
        node.style.backgroundColor
      );
    }
    case "text": {
      const style = node.style;
      return new UiTextTreeNode(node.id, node, style.text, node.dimentions);
    }
    case "grid": {
      return createUiGridSubtree(node);
    }
  }
}
