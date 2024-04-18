import { createUiSubtree } from '../create-ui-tree';
import { UiContainerTreeNode } from '../ui-container-tree-node';
import { UiBuildTreeNode, UiTreeNode } from '../ui-tree-node';
import { calculateGridColumnsDimentions, calculateGridRowsDimentions } from './calculate-grid-dimensions';
import { markAndGetRectangleForId } from './mark-and-get-rectangle-for-id';
import { UiGridBuildTreeNode } from './ui-grid-build-tree-node';

export function calculateIdAreas(areaIds: { isMarked: boolean; value: string | null }[][]) {
  let dimentionsForId: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[] = [];
  for (let yIndex = 0; yIndex < areaIds.length; yIndex++) {
    for (let xIndex = 0; xIndex < areaIds[0].length; xIndex++) {
      let cell = areaIds[yIndex][xIndex];
      if (cell.isMarked === true || cell.value === null) {
        continue;
      }
      if (dimentionsForId.find((x) => x.id === cell.value) !== undefined) {
        throw new Error('grid layout invalid!');
      }
      dimentionsForId.push(markAndGetRectangleForId(areaIds, { x: xIndex, y: yIndex }));
    }
  }
  return dimentionsForId;
}

function sumValuesInArray(arr: number[], startIdx: number, endIdx: number) {
  return [...Array(endIdx - startIdx).keys()].map((x) => x + startIdx).reduce((prev, curr) => prev + arr[curr], 0);
}

export function setChildToAppropiateGridCells(
  father: UiGridBuildTreeNode,
  child: UiBuildTreeNode,
  rowsDims: number[],
  columnsDims: number[],
  cellsDescription: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[]
) {
  const description = cellsDescription.find((x) => x.id === child.id);
  if (!description) throw new Error(`id ${child.id} foes not exists in grid`);
  const x = sumValuesInArray(columnsDims, 0, description.x);
  const y = sumValuesInArray(rowsDims, 0, description.y);
  const width = sumValuesInArray(columnsDims, description.x + 1, description.x + description.width);
  const height = sumValuesInArray(rowsDims, description.y, description.y + description.height);
  child.dimentions = {
    x: father.dimentions.x + x,
    y: father.dimentions.y + y,
    width,
    height,
  };
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
        value: x !== '.' ? x : null,
      }));
    if (node.style.columnsefintion !== undefined && node.style.columnsefintion.length !== areaIdsInLine.length) {
      throw new Error('incorrect dimentions of grid!');
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
      setChildToAppropiateGridCells(node, child, rowsDimensions, columnsDimensions, areaIdsList);
      return createUiSubtree(child);
    })
  );
}
