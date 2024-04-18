import { GridStyleOptions } from '../style-options';
import { Dimentations, UiBuildTreeNode } from '../ui-tree-node';

export interface UiGridBuildTreeNode extends UiBuildTreeNode {
  id: string;
  type: 'grid';
  style: GridStyleOptions;
  dimentions: Dimentations;
  children: UiBuildTreeNode[];
}
