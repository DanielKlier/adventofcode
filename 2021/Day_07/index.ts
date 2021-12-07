// Solution for 2021, day 07
import { range } from "../../utils/array.ts";
import { parse } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

type DistFn = (a: number, b: number) => number;

const logger = new Logger(Logger.Level.Debug);

const part1Dist = (a: number, b: number) => Math.abs(a - b);
const part2Dist = (a: number, b: number) => {
  const dist = Math.abs(a - b);
  return (dist * (dist + 1)) / 2;
};

function alignmentCost(
  input: number[],
  target: number,
  distFn: (a: number, b: number) => number
) {
  return input.reduce((cost, pos) => cost + distFn(pos, target), 0);
}

function solve(input: number[], distFn: DistFn): number {
  const min = Math.min(...input);
  const max = Math.max(...input);
  return range(min, max).reduce(
    (cost, target) => Math.min(cost, alignmentCost(input, target, distFn)),
    Infinity
  );
}

function part1(input: number[]): number {
  return solve(input, part1Dist);
}

function part2(input: number[]): number {
  return solve(input, part2Dist);
}

function day07(input: string): void {
  tests();

  const positions = parse.numberList(input);

  console.log(`Part1: ${part1(positions)}`);
  console.log(`Part2: ${part2(positions)}`);
}

export default day07;

function tests() {
  const testInput = "16,1,2,0,4,2,7,1,2,14";
  assertEquals(part1(parse.numberList(testInput)), 37);
  assertEquals(part2(parse.numberList(testInput)), 168);
  logger.info("Tests OK");
}
