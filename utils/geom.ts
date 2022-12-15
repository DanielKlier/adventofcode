export type Point = [number, number];

export function pointToString([x, y]: Point): string {
  return `${x}#${y}`;
}

export function parsePoint(str: string): Point {
  const [xStr, yStr] = str.split('#');
  return [parseInt(xStr, 10), parseInt(yStr, 10)];
}

export function pointsAreEqual([x0, y0]: Point, [x1, y1]: Point) {
  return x0 === x1 && y0 === y1;
}

export function manhattenDist([x1, y1]: Point, [x2, y2]: Point): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
