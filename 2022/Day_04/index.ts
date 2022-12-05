// Solution for 2022, day 04
import { lines, parse } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

class Range {
  constructor(readonly min: number, readonly max: number) {
  }

  contains(other: Range) {
    return this.min <= other.min && this.max >= other.max;
  }

  overlaps(other: Range) {
    return (this.min >= other.min && this.min <= other.max) || (this.max >= other.min && this.min <= other.max);
  }
}

type RangePair = [Range, Range];
type PuzzleInput = RangePair[];

function parseRange(rangeStr: string): Range {
  const [min, max] = rangeStr.split('-').map(parse.int);
  return new Range(min, max);
}

function parseRangePair(line: string): RangePair {
  const [left, right] = line.split(',');
  return [
    parseRange(left),
    parseRange(right)
  ]
}

function parseInput(input: string): PuzzleInput {
  return lines(input).map(parseRangePair);
}

function part1(input: PuzzleInput): number {
  let count = 0;

  for (const [left, right] of input) {
    if (left.contains(right) || right.contains(left)) {
      count++;
    }
  }

  return count;
}

function part2(input: PuzzleInput): number {
  let count = 0;

  for (const [left, right] of input) {
    if (left.overlaps(right)) {
      count++;
    }
  }

  return count;
}

export default function run(input: string) {

  const parsedInput = parseInput(input);

  test1();
  console.log(`Part1: ${part1(parsedInput)}`);
  test2();
  console.log(`Part2: ${part2(parsedInput)}`);
}

const testInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 2);

  logger.info('Tests OK');
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 4);

  logger.info('Tests OK');
}
