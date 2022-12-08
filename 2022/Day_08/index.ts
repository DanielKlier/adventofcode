// Solution for 2022, day 08
import { matrix } from '../../utils/array.ts';
import { lines, parse } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

type PuzzleInput = number[][];

function parseInput(input: string): PuzzleInput {
  const inputLines = lines(input);
  const width = inputLines[0].length;
  const height = inputLines.length;
  const mat = matrix(height, width, 0);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      mat[row][col] = parse.int(inputLines[row][col]);
    }
  }
  return mat;
}

function part1(input: PuzzleInput): number {
  const size = input.length;
  const visibleOuterRing = 4 * size - 4;
  const visibilityMatrix = matrix(size, size, 0);

  // Left to right
  for (let row = 1; row < size - 1; row++) {
    let max = input[row][0];
    for (let col = 1; col < size - 2; col++) {
      if (input[row][col] > max) {
        visibilityMatrix[row][col] = visibilityMatrix[row][col] + 1;
        max = input[row][col];
      }
    }
  }
  // Right to left
  for (let row = 1; row < size - 1; row++) {
    let max = input[row][size - 1];
    for (let col = size - 2; col > 0; col--) {
      if (input[row][col] > max) {
        visibilityMatrix[row][col] = visibilityMatrix[row][col] + 1;
        max = input[row][col];
      }
    }
  }
  // Top to bottom
  for (let col = 1; col < size - 1; col++) {
    let max = input[0][col];
    for (let row = 1; row < size - 1; row++) {
      if (input[row][col] > max) {
        visibilityMatrix[row][col] = visibilityMatrix[row][col] + 1;
        max = input[row][col];
      }
    }
  }
  // Bottom to top
  for (let col = 1; col < size - 1; col++) {
    let max = input[size-1][col];
    for (let row = size - 2; row > 0; row--) {
      if (input[row][col] > max) {
        visibilityMatrix[row][col] = visibilityMatrix[row][col] + 1;
        max = input[row][col];
      }
    }
  }

  return visibleOuterRing + visibilityMatrix.reduce((total, row) => total + row.reduce((rowSum, a) => rowSum + Math.min(1, a)), 0);
}

function scenicScore(input: PuzzleInput, row: number, col: number): number {
  const ownHeight = input[row][col];
  let north = 0;
  let south = 0;
  let west = 0;
  let east = 0;
  let y = row;
  // Look north
  do {
    north++;
    y -= 1;
  } while(y > 0 && input[y][col] < ownHeight);
  // Look south
  y = row;
  do {
    south++;
    y += 1;
  } while(y < input.length - 1 && input[y][col] < ownHeight);
  // Look west
  let x = col;
  do {
    west++;
    x -= 1;
  } while(x > 0 && input[row][x] < ownHeight);
  // Look east
  x = col;
  do {
    east++;
    x += 1;
  } while(x < input.length - 1 && input[row][x] < ownHeight);

  return north * south * east * west;
}

function part2(input: PuzzleInput): number {
  const size = input.length;
  const scoreMatrix = matrix(size, size, 0);

  // For inner each tree
  for (let row = 1; row < size - 1; row++) {
    for (let col = 1; col < size - 1; col++) {
      scoreMatrix[row][col] = scenicScore(input, row, col);
    }
  }

  return scoreMatrix.reduce(
    (totalMax, row) => Math.max(
      totalMax, row.reduce((rowMax, a) => Math.max(rowMax, a), 0)
    ),
    0
  );
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `30373
25512
65332
33549
35390`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 21);

  logger.info('Tests for Part 1 OK');
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 8);

  logger.info('Tests for Part 2 OK');
}
