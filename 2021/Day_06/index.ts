// Solution for 2021, day 06
import { parse } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

function parseInput(input: string): number[] {
  return input.split(",").map(parse.int);
}

function simulate(fish: number[], duration: number): number {
  const generations = new Array(9).fill(0);
  for (const f of fish) generations[f] += 1;

  for (let day = 0; day < duration; day++) {
    generations[7] += generations[0];
    const newGenCount = generations.shift();
    generations.push(newGenCount);
  }

  return generations.reduce((sum, a) => sum + a, 0);
}

function part1(fish: number[]): number {
  return simulate(fish, 80);
}

function part2(fish: number[]): number {
  return simulate(fish, 256);
}

function day06(input: string): void {
  test();

  const initialFish = parseInput(input);

  console.log(`Part1: ${part1([...initialFish])}`);
  console.log(`Part2: ${part2([...initialFish])}`);
}

export default day06;

const testInput = "3,4,3,1,2";

function test() {
  assertEquals(part1(parseInput(testInput)), 5934);
  assertEquals(part2(parseInput(testInput)), 26984457539);
  console.log("Tests OK");
}
