export function markAndGetRectangleForId(
  grid: {
    isMarked: boolean;
    value: string | null;
  }[][],
  topLeft: { x: number; y: number }
): { id: string; x: number; y: number; width: number; height: number } {
  let id = grid[topLeft.y][topLeft.x].value;
  if (id === null) throw new Error('invalid id for cell in grid');
  let width = 1;
  let height = 0;
  while (width < grid[0].length) {
    if (grid[topLeft.y + height][topLeft.x + width].value !== id) {
      break;
    }
    width += 1;
  }

  height = 1;
  while (topLeft.y + height < grid.length) {
    let canExpendToRow = [...Array(width).keys()]
      .map((x) => grid[topLeft.y + height][topLeft.x + x])
      .every((cell) => !cell.isMarked && cell.value === id);
    if (!canExpendToRow) {
      break;
    }
    height += 1;
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      grid[topLeft.y + y][topLeft.x + x].isMarked = true;
    }
  }
  return { id, x: topLeft.x, y: topLeft.y, width, height };
}
