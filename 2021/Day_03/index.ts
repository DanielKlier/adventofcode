// Solution for 2021, day 03
import { lines } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

const toBinaryString =
  (digits: number) =>
  (n: number): string =>
    n.toString(2).padStart(digits, "0");

function parseBinary(input: string): number[] {
  return lines(input).map((line) => parseInt(line, 2));
}

function getBalances(input: number[], digits: number): number[] {
  const zeros = Array(digits).fill(0);
  return input.reduce((balances, x) => {
    return balances.map((b, i) => b + (x & (1 << i) ? 1 : -1));
  }, zeros);
}

function part1(input: number[], digits: number): number {
  const balances = getBalances(input, digits);

  const gamma = balances.reduce((gamma, bal, i) => {
    return gamma | ((bal > 0 ? 1 : 0) << i);
  }, 0);
  const epsilon = ~gamma & ((1 << digits) - 1);

  return gamma * epsilon;
}

function part2(input: number[], digits: number): number {
  let numbers = input;

  let pos = digits - 1;
  while (numbers.length > 1) {
    const balances = getBalances(numbers, pos + 1);
    const mostCommon = balances[pos] >= 0 ? 1 : 0;
    const mask = mostCommon << pos;
    numbers = numbers.filter((n) => !((n & (1 << pos)) ^ mask));
    pos = pos - 1;
  }

  const oxygenGeneratorRating = numbers[0];

  pos = digits - 1;
  numbers = input;
  while (numbers.length > 1) {
    const balances = getBalances(numbers, pos + 1);
    const leastCommon = balances[pos] < 0 ? 1 : 0;
    const mask = leastCommon << pos;
    numbers = numbers.filter((n) => !((n & (1 << pos)) ^ mask));
    pos = pos - 1;
  }

  const co2ScrubberRating = numbers[0];

  return oxygenGeneratorRating * co2ScrubberRating;
}

async function day03(input: string): Promise<void> {
  testPart1();
  testPart2();

  const inputLines = parseBinary(input);

  console.log(`Part1: ${part1(inputLines, 12)}`);
  console.log(`Part2: ${part2(inputLines, 12)}`);
}

export default day03;

const testInput = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

function testPart1() {
  assertEquals(part1(parseBinary(testInput), 5), 198);
}

function testPart2() {
  assertEquals(part2(parseBinary(testInput), 5), 230);
}
