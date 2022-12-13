// Solution for 2022, day 12
import { matrix } from '../../utils/array.ts';
import { Point } from '../../utils/geom.ts';
import { lines } from '../../utils/input.ts';
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Info);

type Heightmap = number[][];
interface PuzzleInput {
  map: Heightmap,
  width: number;
  height: number;
  start: Point;
  goal: Point;
}

function getHeight(char: string): number {
  return char.charCodeAt(0) - 'a'.charCodeAt(0);
}

function parseInput(input: string): PuzzleInput {
  const rows = lines(input);
  const width = rows[0].length;
  const height = rows.length;
  const map = matrix(height, width, 0);
  let start: Point|undefined;
  let goal: Point|undefined;

  for (let rowIdx = 0; rowIdx < height; rowIdx++) {
    for (let colIdx = 0; colIdx < width; colIdx++) {
      const square = rows[rowIdx][colIdx];
      if (square === 'S') {
        start = [colIdx, rowIdx];
        map[rowIdx][colIdx] = getHeight('a');
      } else if (square === 'E') {
        goal = [colIdx, rowIdx];
        map[rowIdx][colIdx] = getHeight('z');
      } else {
        map[rowIdx][colIdx] = getHeight(square);
      }
    }
  }

  if (!goal) throw new Error('Start not found');
  if (!start) throw new Error('Start not found');

  return {goal, start, map, width, height};
}

function shortestPathLength(start: Point, input: PuzzleInput): number {
  function getIndex([x, y]: Point) {
    return y * input.width + x;
  }

  function getPoint(index: number): Point {
    return [index % input.width, Math.floor(index / input.width)];
  }

  function getHeight([x, y]: Point): number {
    if (input.map[y] && typeof input.map[y][x] === 'number') return input.map[y][x];
    return -1;
  }

  // Breadth-first-search
  const startIndex = getIndex(start);
  const goalIndex = getIndex(input.goal);
  const queue = [startIndex];
  const visited = new Set<number>();
  const parents = new Map<number, number>();
  visited.add(startIndex);

  while (queue.length) {
    const currentIndex = queue.shift();
    if (typeof currentIndex === 'undefined') throw new Error('Illegal state');
    if (currentIndex === goalIndex) {
      break;
    }

    const [vx, vy] = getPoint(currentIndex);
    const height = input.map[vy][vx];

    // North
    const pNorth: Point = [vx, vy - 1];
    const hNorth = getHeight(pNorth);
    if (hNorth > -1 && !visited.has(getIndex(pNorth)) && (hNorth -1 <= height)) {
      const idx = getIndex(pNorth);
      visited.add(idx);
      queue.push(idx);
      parents.set(idx, currentIndex);
    }
    // East
    const pEast: Point = [vx + 1, vy];
    const hEast = getHeight(pEast);
    if (hEast > -1 && !visited.has(getIndex(pEast)) && (hEast -1 <= height)) {
      const idx = getIndex(pEast);
      visited.add(idx);
      queue.push(idx);
      parents.set(idx, currentIndex);
    }
    // South
    const pSouth: Point = [vx, vy + 1];
    const hSouth = getHeight(pSouth);
    if (hSouth > -1 && !visited.has(getIndex(pSouth)) && (hSouth -1 <= height)) {
      const idx = getIndex(pSouth);
      visited.add(idx);
      queue.push(idx);
      parents.set(idx, currentIndex);
    }
    // West
    const pWest: Point = [vx - 1, vy];
    const hWest = getHeight(pWest);
    if (hWest > -1 && !visited.has(getIndex(pWest)) && (hWest -1 <= height)) {
      const idx = getIndex(pWest);
      visited.add(idx);
      queue.push(idx);
      parents.set(idx, currentIndex);
    }
  }

  let n = goalIndex;
  let i = 0;
  while(parents.has(n)) {
    n = parents.get(n)!;
    i++;
  }

  return i;
}

function part1(input: PuzzleInput): number {
  return shortestPathLength(input.start, input);
}

function part2(input: PuzzleInput): number {
  const pointsWithHeight0: Point[] = [];
  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      if (input.map[y][x] === 0) {
        pointsWithHeight0.push([x, y]);
      }
    }
  }
  let shortestPath = Infinity;
  for (const p of pointsWithHeight0) {
    const l = shortestPathLength(p, input);
    if (l && l < shortestPath) {
      shortestPath = l;
    }
  }
  return shortestPath;
}

export default function run(input: string) {

  testGetHeight();
  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 31);

  logger.info("Tests for Part 1 OK");
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 29);

  logger.info("Tests for Part 2 OK");
}

function testGetHeight() {
  assertEquals(getHeight('a'), 0);
  assertEquals(getHeight('b'), 1);
  assertEquals(getHeight('y'), 24);
  assertEquals(getHeight('z'), 25);
}
