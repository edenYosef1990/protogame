import { fabric } from "fabric";

export function generateCircle(
  color: string,
  position: { x: number; y: number },
  radius: number | undefined = undefined
): fabric.Circle {
  console.log("reached here");
  return new fabric.Circle({
    stroke: "black",
    radius: radius ?? 50,
    // width: 100,
    // height: 100,
    fill: color,
    left: position.x,
    top: position.y,
    originX: "center",
    originY: "center",
  });
}

export function generateRectangle(
  color: string,
  topLeftCornerPosition: { x: number; y: number },
  width: number,
  height: number
): fabric.Rect {
  return new fabric.Rect({
    stroke: "black",
    width,
    height,
    fill: color,
    left: topLeftCornerPosition.x,
    top: topLeftCornerPosition.y,
    originX: "center",
    originY: "center",
  });
}

export function generateLine(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  color: string
) {
  return new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
    stroke: color,
    fill: color,
    top: p1.y,
    left: p1.x,
    strokeWidth: 5,
    originX: "center",
    originY: "center",
  });
}
