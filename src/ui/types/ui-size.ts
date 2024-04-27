import { Dimentations } from './ui-tree-node';

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

function calculateSize(
  dimensions: BuildDimensions,
  fathersDimention: NewDimensions
): NewDimensions {
  const width =
    dimensions.width.type === SizeType.Percentage
      ? fathersDimention.width * dimensions.width.size
      : dimensions.width.size;
  const x =
    dimensions.width.type === SizeType.Percentage
      ? dimensions.marginHorizontal + fathersDimention.bottomRight.x
      : dimensions.height.size;

  const height =
    dimensions.height.type === SizeType.Percentage
      ? fathersDimention.height * dimensions.height.size
      : dimensions.height.size;
  return {
    bottomRight: { x: 0, y: 0 },
    width,
    height,
  };
}
