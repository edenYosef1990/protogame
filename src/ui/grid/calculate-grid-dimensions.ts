import { SizeType } from '../ui-size';
import { UiGridBuildTreeNode } from './ui-grid-build-tree-node';

export function calculateGridRowsDimentions(node: UiGridBuildTreeNode) {
  const style = node.style;
  if (style.rowsDefintion) {
    let heightAbosulteSum = style.rowsDefintion
      .filter((x) => x.type == SizeType.px)
      .reduce((prev: number, curr) => prev + curr.size, 0);
    let heightPercentageSum = style.rowsDefintion
      .filter((x) => x.type == SizeType.Percentage)
      .reduce((prev: number, curr) => prev + curr.size, 0);
    let heightFractionSum = style.rowsDefintion
      .filter((x) => x.type == SizeType.fr)
      .reduce((prev: number, curr) => prev + curr.size, 0);
    let fractionScale =
      (node.dimentions.height -
        heightAbosulteSum -
        heightPercentageSum * node.dimentions.height) /
      heightFractionSum;
    return style.rowsDefintion.map((x) => {
      switch (x.type) {
        case SizeType.px:
          return x.size;
        case SizeType.fr:
          return x.size * fractionScale;
        case SizeType.Percentage:
          return (x.size * node.dimentions.height) / 100;
      }
    });
  }
  return [node.dimentions.height];
}

export function calculateGridColumnsDimentions(node: UiGridBuildTreeNode) {
  const style = node.style;
  if (style.columnsefintion) {
    let WidthAbosulteSum = style.columnsefintion
      .filter((x) => x.type == SizeType.px)
      .reduce((prev: number, curr) => prev + curr.size, 0);
    let WidthPercentageSum = style.columnsefintion
      .filter((x) => x.type == SizeType.Percentage)
      .reduce((prev: number, curr) => prev + curr.size, 0);
    let widthFractionSum = style.columnsefintion
      .filter((x) => x.type == SizeType.fr)
      .reduce((prev: number, curr) => prev + curr.size, 0);
    let fractionScale =
      (node.dimentions.width -
        WidthAbosulteSum -
        WidthPercentageSum * node.dimentions.width) /
      widthFractionSum;
    return style.columnsefintion.map((x) => {
      switch (x.type) {
        case SizeType.px:
          return x.size;
        case SizeType.fr:
          return x.size * fractionScale;
        case SizeType.Percentage:
          return (x.size * node.dimentions.width) / 100;
      }
    });
  }
  return [node.dimentions.width];
}

export function calculateGridDimentions(node: UiGridBuildTreeNode) {
  let cellWidthValues = calculateGridColumnsDimentions(node);
  let cellHeightValues = calculateGridRowsDimentions(node);
  let gridCellDimensions = [];
  for (let yIndex = 0; yIndex < cellHeightValues.length; yIndex++) {
    let rowDimensions = [];
    for (let xIndex = 0; xIndex < cellWidthValues.length; xIndex++) {
      rowDimensions.push({
        width: cellWidthValues[xIndex],
        height: cellHeightValues[yIndex],
      });
    }
    gridCellDimensions.push(rowDimensions);
  }
  return gridCellDimensions;
}
