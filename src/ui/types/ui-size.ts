export enum SizeType {
  px,
  fr,
  Percentage,
}
export interface UiSize {
  size: number;
  type: SizeType;
}

export interface NewDimensions {
  bottomRight: { x: number; y: number };
  width: number;
  height: number;
}

export interface BuildDimensions {
  marginVertical: number;
  marginHorizontal: number;
  width: UiSize;
  height: UiSize;
}
