import { UiSize } from './ui-size';
import { Color } from './ui-tree-node';

export enum DisplayChildrenType {
  Flex,
  InlineFlex,
}

export interface ContainerStyleOptions {
  backgroundColor: Color;
  displayChildren?: DisplayChildrenType;
}

export interface ButtonStyleOptions {
  backgroundColor: Color;
  text: string;
}

export interface TextStyleOptions {
  text: string;
}

export interface GridStyleOptions {
  rowsDefintion?: UiSize[];
  columnsefintion?: UiSize[];
  description: string[];
  backgroundColor: Color;
}
