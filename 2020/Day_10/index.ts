// Solution for 2020, day 10
import { lines, parse } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

function part1(joltages: number[]): number {
  const diffs: Record<1 | 2 | 3, number[]> = { 1: [], 2: [], 3: [] };

  const arr = [0, ...joltages, joltages[joltages.length - 1] + 3];

  for (let i = 1; i < arr.length; i++) {
    const diff = arr[i] - arr[i - 1];
    switch (diff) {
      case 1:
      case 2:
      case 3:
        diffs[diff].push(arr[i]);
        break;
    }
  }

  return diffs[1].length * diffs[3].length;
}

function last<T>(arr: T[]) {
  return arr[arr.length - 1];
}

function nextPath(allNumbers: number[], index = 0, memo: Record<number, number> = {}): number {
  const startJ = allNumbers[index];
  if (startJ === last(allNumbers)) {
    return 1;
  }

  if (memo[index]) return memo[index];

  let ret = 0;
  for (const diff of [1,2,3]) {
    let nextInd = -1;
    for (let i = 1; i < 4; i++) {
      if (startJ + diff === allNumbers[index + i]) {
        nextInd = index + i;
      }
    }

    if (nextInd > -1) {
      ret += nextPath(allNumbers, nextInd, memo);
    }
  }

  memo[index] = ret;

  return ret;
}

function part2(joltages: number[]): number {
  const numbers = [0, ...joltages, last(joltages) + 3];
  return nextPath(numbers);
}

function parseInput(input: string): number[] {
  const joltages = lines(input).map(parse.int);
  joltages.sort((a, b) => a - b);
  return joltages;
}

async function day10(input: string): Promise<void> {
  testPart1();
  testPart2();

  const joltages = parseInput(input);
  console.log(`Part 1: ${part1(joltages)}`);
  console.log(`Part 2: ${part2(joltages)}`);
}

export default day10;

const testInput1 = parseInput(`16
10
15
5
1
11
7
19
6
12
4`);

const testInput2 = parseInput(`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`);

function testPart1() {
  assertEquals(part1(testInput2), 220);
}

function testPart2() {
  assertEquals(part2(testInput1), 8);
  assertEquals(part2(testInput2), 19208);
}
