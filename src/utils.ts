import { fabric } from 'fabric';

export function getVectorLength(vec: { x: number; y: number }) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export function divVector(vec: { x: number; y: number }, factor: number = 1) {
  return { x: vec.x / factor, y: vec.y / factor };
}

export function oppositeVector(vec: { x: number; y: number }) {
  return { x: -vec.x, y: -vec.y };
}

export function normalizeVector(
  vec: { x: number; y: number },
  size: number = 1
) {
  let currSize = getVectorLength(vec);
  if (currSize === 0) return { x: 0, y: 0 };
  return { x: (vec.x / currSize) * size, y: (vec.y / currSize) * size };
}

export function vectorSub(
  a: { x: number; y: number },
  b: { x: number; y: number }
): { x: number; y: number } {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function getVectorZero(): { x: number; y: number } {
  return { x: 0, y: 0 };
}

export function vectorAdd(
  a: { x: number; y: number },
  b: { x: number; y: number }
): { x: number; y: number } {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function vectorsAdd(...vectors: { x: number; y: number }[]): {
  x: number;
  y: number;
} {
  let xSum = vectors.map((vec) => vec.x).reduce((prev, curr) => prev + curr, 0);
  let ySum = vectors.map((vec) => vec.y).reduce((prev, curr) => prev + curr, 0);
  return { x: xSum, y: ySum };
}

export function vectorScale(
  vec: { x: number; y: number },
  factor: number
): { x: number; y: number } {
  return { x: vec.x * factor, y: vec.y * factor };
}

export function vectorsDot(
  vecL: { x: number; y: number },
  vecR: { x: number; y: number }
) {
  return vecL.x * vecR.x + vecL.y * vecR.y;
}

export function getDirectionAngle(
  sourcePos: { x: number; y: number },
  target: { x: number; y: number }
) {
  const deltaVec = vectorSub(sourcePos, target);
  const { x: deltaX, y: deltaY } = deltaVec;
  const angle = (Math.atan(deltaY / deltaX) * 180) / Math.PI;
  return deltaX > 0 ? angle : angle + 180;
}

export function getPosition(
  pos: { x: number; y: number },
  rad: number,
  deg: number
): { x: number; y: number } {
  let radians = fabric.util.degreesToRadians(deg);
  const deltaX = rad * Math.cos(radians);
  const deltaY = rad * Math.sin(radians);
  return {
    x: pos.x + deltaX,
    y: pos.y + deltaY,
  };
}
