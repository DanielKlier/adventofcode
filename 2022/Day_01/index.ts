// Solution for 2022, day 1
import { assertEquals } from 'https://deno.land/std@0.117.0/testing/asserts.ts';
import { Logger } from "../../utils/log.ts";

const logger = new Logger(Logger.Level.Info);

type PuzzleInput = number[][];

function parseInput(input: string): PuzzleInput {
  return input.split('\n\n').map(str => str.split('\n').map(a => parseInt(a, 10)));
}

function part1(input: PuzzleInput): number {
  const sums = input.map(a => a.reduce((b, c)=> b+c, 0));
  sums.sort((a, b) => b - a);
  return sums[0];
}

function part2(input: PuzzleInput): number {
  const sums = input.map(a => a.reduce((b, c)=> b+c, 0));
  sums.sort((a, b) => b - a);
  return sums.slice(0, 3).reduce((a, b) => a + b, 0);
}

export default function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  const testInput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

  assertEquals(part1(parseInput(testInput)), 24000);
  assertEquals(part2(parseInput(testInput)), 45000);

  logger.info("Tests OK");
}
