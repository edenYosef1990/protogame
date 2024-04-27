import { SizeType } from "../types/ui-size";
import {
  Color,
  UiTreeNode,
  generateUiButtonBuildTreeNode,
  generateUiTextBuildTreeNode,
} from "../types/ui-tree-node";
import { createModal, createUiSubtree } from "../create-ui-tree";

export function testGrid(): UiTreeNode {
  return createModal({
    id: "main",
    type: "grid",
    style: {
      rowsDefintion: [...Array(4).keys()].map((_) => ({
        size: 25,
        type: SizeType.Percentage,
      })),
      columnsefintion: [...Array(7).keys()].map((_) => ({
        size: 1,
        type: SizeType.fr,
      })),
      description: [
        "try    try     try     .   bla   bla .",
        "try    try     try     .   bla   bla .",
        "try    try     try     .   bla   bla .",
        "child  child   child   .   bla   bla .",
      ],
      backgroundColor: Color.Transparent,
    },
    dimentions: { x: 0, y: 0, width: 1000, height: 1000 },
    children: [
      generateUiTextBuildTreeNode(
        "try",
        { text: "try123" },
        { x: 0, y: 0, width: 200, height: 30 }
      ),

      generateUiButtonBuildTreeNode(
        "child",
        { text: "child123", backgroundColor: Color.Gray },
        { x: 0, y: 0, width: 200, height: 200 },
        []
      ),
      // generateUiTextBuildTreeNode(
      //   'child',
      //   { text: 'child123' },
      //   { x: 0, y: 0, width: 200, height: 30 }
      // ),
      generateUiTextBuildTreeNode(
        "bla",
        { text: "bla123" },
        { x: 0, y: 0, width: 200, height: 30 }
      ),
    ],
  });
}
