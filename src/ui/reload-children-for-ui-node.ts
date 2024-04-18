import { createUiSubtree, createUiGridSubtree } from './create-ui-tree';
import { UiGridBuildTreeNode } from './grid/ui-grid-build-tree-node';
import { DisplayChildrenType } from './style-options';
import { UiTreeNode } from './ui-tree-node';

export function reloadChildrenForUiNode(node: UiTreeNode) {
  switch (node.originalBuildNode!.type) {
    case 'block': {
      const style = node.originalBuildNode!.style;
      if (style.displayChildren === DisplayChildrenType.Flex) {
        const sumWHeights = node.children.reduce((prev: number, current) => prev + current.dimentions.height, 0);
        const gap = (node.dimentions.height - sumWHeights) / (node.children.length - 1);
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

      node.children.map((child) => createUiSubtree(child.originalBuildNode!));
      break;
    }
    case 'grid': {
      let girdNode = createUiGridSubtree(node.originalBuildNode as UiGridBuildTreeNode);
      node.children = girdNode.children;
      break;
    }
    default:
      throw new Error('invaid ui node type to change children for!');
  }
}
