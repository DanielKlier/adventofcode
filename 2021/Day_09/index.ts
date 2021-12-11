// Solution for 2021, day 09
import { lines, parse } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Debug);

type Matrix = number[][];
type Point = [number, number];

function parseInput(input: string): Matrix {
  return lines(input).map((line) => line.split("").map(parse.int));
}

function get<T>(m: T[][], [i, j]: Point): T | undefined {
  return m[i]?.[j];
}

function getHeightOrInfinity(m: Matrix, p: Point) {
  const h = get(m, p);
  return typeof h == "number" ? h : Infinity;
}

function points<T>(m: T[][]): Point[] {
  const points: Point[] = [];

  for (let i = 0; i < m.length; i++) {
    const row = m[i];
    for (let j = 0; j < row.length; j++) {
      points.push([i, j]);
    }
  }
  return points;
}

function neighborPoints([i, j]: Point): Point[] {
  return [
    [i - 1, j], // Top
    [i, j - 1], // Left
    [i + 1, j], // Bottom
    [i, j + 1], // Right
  ];
}

function neighborHeights(heightmap: Matrix, p: Point): number[] {
  return neighborPoints(p).map((p) => getHeightOrInfinity(heightmap, p));
}

function lowPoints(heightMap: Matrix): Point[] {
  return points(heightMap).filter((p) => {
    const h = get(heightMap, p)!;
    return neighborHeights(heightMap, p).every((nh) => nh > h);
  });
}

const riskLevel = (heightMap: Matrix) => (lowPoint: Point) =>
  get(heightMap, lowPoint)! + 1;

const sum = (a: number, b: number) => a + b;

function part1(input: Matrix): number {
  return lowPoints(input).map(riskLevel(input)).reduce(sum);
}

function contains(points: Point[], [i0, j0]: Point): boolean {
  return !!points.find(([i1, j1]) => i0 === i1 && j0 === j1);
}

function part2(input: Matrix): number {
  function expandBasin(start: Point, basin: Point[] = [], d = 0): Point[] {
    if (contains(basin, start)) {
      return basin;
    }
    if (getHeightOrInfinity(input, start) > 8) {
      return basin;
    }

    basin.push(start);
    neighborPoints(start).forEach((n) => {
      expandBasin(n, basin, d + 1);
    });
    return basin;
  }

  const basins: Point[][] = [];

  lowPoints(input).forEach((lowPoint) => {
    if (basins.find((b) => contains(b, lowPoint))) return;
    basins.push(expandBasin(lowPoint));
  });
  basins.sort((a, b) => a.length - b.length);
  basins.reverse();
  return basins.slice(0, 3).reduce((prod, b) => prod * b.length, 1);
}

export default function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  const testInput = `2199943210
3987894921
9856789892
8767896789
9899965678`;

  assertEquals(part1(parseInput(testInput)), 15);
  assertEquals(part2(parseInput(testInput)), 1134);

  logger.info("Tests OK");
}
