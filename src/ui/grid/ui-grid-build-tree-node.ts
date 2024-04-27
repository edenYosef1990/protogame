import { GridStyleOptions } from "../types/style-options";
import { Dimentations, UiBuildTreeNode } from "../types/ui-tree-node";

export interface UiGridBuildTreeNode extends UiBuildTreeNode {
  id: string;
  type: "grid";
  style: GridStyleOptions;
  dimentions: Dimentations;
  children: UiBuildTreeNode[];
}
