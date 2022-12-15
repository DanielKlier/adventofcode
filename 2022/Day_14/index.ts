// Solution for 2022, day 14
import { Point, pointsAreEqual, pointToString } from '../../utils/geom.ts';
import { lines, parse } from '../../utils/input.ts';
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Info);

interface CaveMap {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  tiles: Map<string, string>;
  sandSource: Point;
}

type PuzzleInput = CaveMap;

interface Segment {
  start: Point;
  end: Point;
}

function parseInput(input: string): PuzzleInput {
  const yMin = 0;
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;
  const segments: Segment[] = [];

  for (const line of lines(input)) {
    // Get all points on current line
    const points: Point[] = line
      .split(' -> ')
      .map(s => s.split(','))
      .map(([x, y]) => [parse.int(x), parse.int(y)]);
    // Update min / max from the points on this line
    for (const [x, y] of points) {
      xMin = Math.min(xMin, x);
      xMax = Math.max(xMax, x);
      yMax = Math.max(yMax, y);
    }
    // Construct segments from the points on this line
    let start: Point | undefined = points.shift();
    if (!start) throw new Error('Illegal state');
    let end: Point | undefined = points.shift();
    if (!end) throw new Error('Illegal state');
    while (end) {
      segments.push({start, end});
      start = end;
      end = points.shift();
    }
  }

  // Construct the map
  const tiles = new Map<string, string>();
  for (const {start, end} of segments) {
    const [x0, y0] = start;
    const [x1, y1] = end;
    if (x0 === x1) { // Vertical?
      for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) {
        const pStr = pointToString([x0, y]);
        tiles.set(pStr, '#');
      }
    } else { // Horizontal
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
        const pStr = pointToString([x, y0]);
        tiles.set(pStr, '#');
      }
    }
  }

  const sandSource: Point = [500, 0];
  tiles.set(pointToString(sandSource), '+');

  return {
    sandSource: [500, 0],
    xMax, yMax, xMin, yMin,
    tiles
  };
}

function part1(input: PuzzleInput): number {
  function isFree(p: Point) {
    if (p[0] < input.xMin || p[0] > input.xMax || p[1] > input.yMax) return true;
    else return ['+', '.'].includes(input.tiles.get(pointToString(p)) || '.')
  }

  let numSandUnitsSettled = 0;
  const tiles = input.tiles;
  let prevSandPos: Point = [Infinity, Infinity];
  let currSandPos = input.sandSource;

  while (prevSandPos !== currSandPos) {
    const [x0, y0] = currSandPos;
    prevSandPos = currSandPos;
    // Can we go down?
    if (isFree([x0, y0 + 1])) {
      currSandPos = [x0, y0 + 1];
    } /* Try diagonally left */ else if (isFree([x0 - 1, y0 + 1])) {
      currSandPos = [x0 - 1, y0 + 1];
    } /* Try diagonally right */ else if (isFree([x0 + 1, y0 + 1])) {
      currSandPos = [x0 + 1, y0 + 1];
    } /* Sand is settled */ else {
      numSandUnitsSettled = numSandUnitsSettled + 1;
      tiles.set(pointToString(currSandPos), 'o');
      currSandPos = input.sandSource;
      prevSandPos = [Infinity, Infinity];
    }

    // Are we out of bounds?
    if (currSandPos[1] > input.yMax) {
      break;
    }
  }

  return numSandUnitsSettled;
}

function part2(input: PuzzleInput): number {
  function isFree(p: Point) {
    if (p[1] >= input.yMax + 2) return false;
    else return ['+', '.'].includes(input.tiles.get(pointToString(p)) || '.')
  }

  let numSandUnitsSettled = 0;
  const tiles = input.tiles;
  let prevSandPos: Point = [Infinity, Infinity];
  let currSandPos = input.sandSource;

  while (prevSandPos !== currSandPos) {
    const [x0, y0] = currSandPos;
    prevSandPos = currSandPos;
    // Can we go down?
    if (isFree([x0, y0 + 1])) {
      currSandPos = [x0, y0 + 1];
    } /* Try diagonally left */ else if (isFree([x0 - 1, y0 + 1])) {
      currSandPos = [x0 - 1, y0 + 1];
    } /* Try diagonally right */ else if (isFree([x0 + 1, y0 + 1])) {
      currSandPos = [x0 + 1, y0 + 1];
    } /* Sand is settled */ else {
      numSandUnitsSettled = numSandUnitsSettled + 1;
      tiles.set(pointToString(currSandPos), 'o');

      if (pointsAreEqual(currSandPos, input.sandSource)) break;

      currSandPos = input.sandSource;
      prevSandPos = [Infinity, Infinity];
    }
  }

  return numSandUnitsSettled;
}

export default function run(input: string) {

  test1();
  let parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  parsedInput = parseInput(input);
  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 24);

  logger.info("Tests for Part 1 OK");
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 93);

  logger.info("Tests for Part 2 OK");
}
