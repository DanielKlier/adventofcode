// Solution for 2021, day 10
import { lines, parse } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Debug);

type PuzzleInput = number[][];
type Point = [number, number];

function parseInput(input: string): PuzzleInput {
  return lines(input).map((line) => line.split("").map(parse.int));
}

const kernel = [
  [-1, +0], // top
  [-1, -1], // top left
  [+0, -1], // left
  [+1, -1], // bottom left
  [+1, +0], // bottom
  [+1, +1], // bottom right
  [+0, +1], // right
  [-1, +1], // top right
];

function printField(field: PuzzleInput) {
  field.forEach((row) => {
    logger.debug(row.map((n) => Math.min(n, 9)).join(""));
  });
}

function neighbors(field: PuzzleInput, i: number, j: number): Point[] {
  return kernel
    .map(([di, dj]) => [i + di, j + dj])
    .filter(
      ([i, j]) => i >= 0 && j >= 0 && i < field.length && j < field[i].length
    ) as Point[];
}

function flashCell(field: PuzzleInput, [i, j]: Point) {
  field[i][j] += 1;
  if (field[i][j] === 10) {
    neighbors(field, i, j).forEach((p) => flashCell(field, p));
  }
}

function simulate(input: PuzzleInput): number {
  let sumFlashes = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      flashCell(input, [i, j]);
    }
  }
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] > 9) {
        input[i][j] = 0;
        sumFlashes += 1;
      }
    }
  }
  return sumFlashes;
}

function part1(input: PuzzleInput, steps = 100): number {
  let sumFlashes = 0;

  for (let step = 0; step < steps; step++) {
    logger.debug("------------------------------");
    logger.debug("Step", step + 1);
    logger.debug("------------------------------");
    printField(input);
    sumFlashes += simulate(input);
  }

  return sumFlashes;
}

function part2(input: PuzzleInput): number {
  let step = 0;
  let flashes = 0;
  while (flashes !== input.length * input.length) {
    logger.debug("------------------------------");
    logger.debug("Step", step + 1);
    logger.debug("------------------------------");
    printField(input);
    flashes = simulate(input);
    logger.debug("------------------------------");
    printField(input);
    step += 1;
    logger.debug("Flashes:", flashes);
  }

  return step;
}

export default function run(input: string) {
  test();

  console.log(`Part1: ${part1(parseInput(input))}`);
  console.log(`Part2: ${part2(parseInput(input))}`);
}

function test() {
  const testInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`;

  part1(
    parseInput(`11111
19991
19191
19991
11111`),
    3
  );

  assertEquals(parseInput(testInput)[9][9], 6);
  assertEquals(part1(parseInput(testInput)), 1656);
  assertEquals(part2(parseInput(testInput)), 195);

  logger.info("Tests OK");
}
