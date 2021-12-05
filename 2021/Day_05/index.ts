// Solution for 2021, day 05
import { lines, parse } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

interface Point {
  x: number;
  y: number;
}

interface LineSegment {
  a: Point;
  b: Point;
}

function parseLineSegment(input: string): LineSegment {
  const [a, b, c, d] = input
    .split(" -> ")
    .flatMap((str) => str.split(",").map((s) => s.trim()))
    .map(parse.int);
  return {
    a: { x: a, y: b },
    b: { x: c, y: d },
  };
}

function parseInput(input: string): LineSegment[] {
  return lines(input).map(parseLineSegment);
}

function bresenham(
  { a: { x: x0, y: y0 }, b: { x: x1, y: y1 } }: LineSegment,
  plot: (p: Point) => void
) {
  const dx = Math.abs(x1 - x0),
    dy = Math.abs(y1 - y0),
    sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (x0 != x1 || y0 != y1) {
    plot({ x: x0, y: y0 });
    const e2 = 2 * err;
    if (e2 > dy * -1) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  plot({ x: x0, y: y0 });
}

function solve(input: LineSegment[]): number {
  const points = new Map<string, number>();
  for (const line of input) {
    console.log("------------------------");
    console.log(line);
    bresenham(line, ({ x, y }) => {
      const k = `${x}:${y}`;
      console.log(k);
      if (!points.has(k)) points.set(k, 0);
      points.set(k, points.get(k)! + 1);
    });
  }
  console.log(Array.from(points.values()));
  return Array.from(points.values()).filter((v) => v >= 2).length;
}

function part1(input: LineSegment[]): number {
  return solve(input.filter((l) => l.a.x === l.b.x || l.a.y === l.b.y));
}

function part2(input: LineSegment[]): number {
  return solve(input);
}

function day05(input: string): void {
  testPart1();
  testPart2();

  const lineSegments = parseInput(input);

  console.log(`Part1: ${part1(lineSegments)}`);
  console.log(`Part2: ${part2(lineSegments)}`);
}

export default day05;

const testInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

function testPart1() {
  assertEquals(parseInput(testInput)[9].a.x, 5);
  assertEquals(part1(parseInput(testInput)), 5);
}

function testPart2() {
  assertEquals(parseInput(testInput)[9].a.x, 5);
  assertEquals(part2(parseInput(testInput)), 12);
}
