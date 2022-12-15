// Solution for 2022, day 15
import { manhattenDist, Point } from '../../utils/geom.ts';
import { lines, parse } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

interface SensorReading {
  sensor: Point;
  beacon: Point;
  dist: number;
}

type PuzzleInput = SensorReading[];

function parseInput(input: string): PuzzleInput {
  const regex = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;
  return lines(input).map(line => {
    const matches = regex.exec(line);
    if (!matches) throw new Error(`Found non matching line: ${line}`);
    const [, sx, sy, bx, by] = matches;
    const sensor: Point = [parse.int(sx), parse.int(sy)];
    const beacon: Point= [parse.int(bx), parse.int(by)];
    const dist = manhattenDist(sensor, beacon);
    return {sensor, beacon, dist};
  });
}

function coveredXPositions(input: PuzzleInput, row: number): [number, number][] {
  const ranges: [number, number][] = [];

  for (const reading of input) {
    const [sx, sy] = reading.sensor;
    const distToRow = Math.abs(sy - row);
    const xDiff = reading.dist - distToRow;
    if (xDiff < 0) continue;
    ranges.push([sx - xDiff, sx + xDiff]);
  }

  return ranges;
}

function rangesExtent(ranges: [number, number][]): [number, number] {
  let minX = Infinity;
  let maxX = -Infinity;
  for (const [x0, x1] of ranges) {
    minX = Math.min(minX, x0);
    maxX = Math.max(maxX, x1);
  }
  return [minX, maxX];
}

function part1(input: PuzzleInput, row: number): number {
  const [minX, maxX] = rangesExtent(coveredXPositions(input, row));
  return maxX - minX;
}

function part2(input: PuzzleInput, maxCoord: number): number {
  for (let y = 0; y <= maxCoord; y++) {
    const ranges = coveredXPositions(input, y);
    ranges.sort(([aMin], [bMin]) => aMin - bMin);
    let x = 0;
    let range = ranges.shift();
    while (range) {
      const [min, max] = range;
      if (min > x) break;
      x = Math.max(max + 1, x);
      range = ranges.shift();
    }
    if (x <= maxCoord) {
      return x * 4000000 + y;
    }
  }
  return NaN;
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput, 2000000)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput, 4000000)}`);
}

const testInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

function test1() {
  assertEquals(part1(parseInput(testInput), 10), 26);

  logger.info('Tests for Part 1 OK');
}

function test2() {
  assertEquals(part2(parseInput(testInput), 20), 56000011);

  logger.info('Tests for Part 2 OK');
}
