import { ButtonStyleOptions, ContainerStyleOptions, TextStyleOptions } from './style-options';

export type UiNodeType = 'button' | 'text' | 'block' | 'grid';

export const blueRgbs: { r: number; g: number; b: number } = {
  r: 0,
  g: 0,
  b: 255,
};

export enum Color {
  Red = 'red',
  Blue = 'blue',
  Black = 'black',
  Green = 'green',
  Gray = 'gray',
  Yellow = 'yellow',
  LightGray = 'lightgray',
  Transparent = 'transparent',
}

export enum State {
  None = 'None',
  Hovered = 'Hovered',
  PressedDown = 'PressedDown',
}

export interface Dimentations {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UiBuildTreeNode {
  id: string;
  type: UiNodeType;
  style: any;
  dimentions: Dimentations;
  isCatchingInteraction?: boolean;
  children: UiBuildTreeNode[];
}

export function generateUiButtonBuildTreeNode(
  id: string,
  style: ButtonStyleOptions,
  dimentions: Dimentations,
  children: UiBuildTreeNode[]
): UiButtonBuildTreeNode {
  return {
    id,
    type: 'button',
    isCatchingInteraction: true,
    style,
    dimentions,
    children,
  };
}

export interface UiButtonBuildTreeNode extends UiBuildTreeNode {
  id: string;
  type: 'button';
  style: ButtonStyleOptions;
  dimentions: Dimentations;
  children: UiBuildTreeNode[];
}

export function generateUiContainerBuildTreeNode(
  id: string,
  style: ContainerStyleOptions,
  dimentions: Dimentations,
  children: UiBuildTreeNode[]
): UiBlockBuildTreeNode {
  return {
    id,
    type: 'block',
    style,
    dimentions,
    children,
  };
}

export interface UiBlockBuildTreeNode extends UiBuildTreeNode {
  id: string;
  type: 'block';
  style: ContainerStyleOptions;
  dimentions: Dimentations;
  children: UiBuildTreeNode[];
}

export function generateUiTextBuildTreeNode(
  id: string,
  style: TextStyleOptions,
  dimentions: Dimentations
): UiTextBuildTreeNode {
  return {
    id,
    type: 'text',
    style,
    dimentions,
    children: [],
  };
}

export interface UiTextBuildTreeNode extends UiBuildTreeNode {
  id: string;
  type: 'text';
  style: TextStyleOptions;
  dimentions: Dimentations;
  children: UiBuildTreeNode[];
}

export interface UiTreeNode {
  id: string;
  type: UiNodeType;
  dimentions: Dimentations;
  originalBuildNode: UiBuildTreeNode | null;
  children: UiTreeNode[];
  state: State;
  isDirty: boolean;
  setTopLeft(topLeft: { x: number; y: number }): void;
  getRenderedComponents(): fabric.Object[];
  onHovered?(): void;
  onClicked?(): void;
  tryResetInteractionStateToIdle?(): boolean;
}
