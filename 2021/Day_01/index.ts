// Solution for 2021, day 01
import { lines, parse } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

function part1(input: number[]): number {
  let prev = Infinity;
  let numBigger = 0;

  for (const measurement of input) {
    numBigger += measurement > prev ? 1 : 0;
    prev = measurement;
  }

  return numBigger;
}

function part2(input: number[]): number {
  let numBigger = 0;
  let prevWindowSum = Infinity;

  for (let index = 1; index < input.length - 1; index++) {
    const currentWindowSum = input
      .slice(index - 1, index + 2)
      .reduce((a, b) => a + b, 0);
    numBigger += currentWindowSum > prevWindowSum ? 1 : 0;
    prevWindowSum = currentWindowSum;
  }

  return numBigger;
}

async function day01(input: string): Promise<void> {
  testPart1();
  testPart2();

  const inputLines = lines(input).map(parse.int);

  console.log(`Part1: ${part1(inputLines)}`);
  console.log(`Part2: ${part2(inputLines)}`);
}

export default day01;

const testInput1 = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

function testPart1() {
  assertEquals(part1(testInput1), 7);
}

function testPart2() {
  assertEquals(part2(testInput1), 5);
}
