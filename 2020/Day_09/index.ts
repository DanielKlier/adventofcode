import { assertEquals, assertFalse, assertTrue } from "../utils/test.ts";

// Solution for 2020, day 09

const getSequence = (input: string): number[] => {
  return input.split("\n").map((n) => parseInt(n, 10));
};

const allSums = (numbers: number[]) => {
  const sums = new Set<number>();
  numbers.forEach((n) => numbers.forEach((n2) => n != n2 && sums.add(n + n2)));
  return Array.from(sums);
};

const isValid = (previous: number[]) => {
  const sums = allSums(previous);
  return (n: number): boolean => !!sums.includes(n);
};

function part2(allNumbers: number[], invalidNum: number): number {
  let part2: number = NaN;
  for (let i = 0; i < allNumbers.length; i++) {
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let j = i + 1;
    while (sum < invalidNum) {
      sum += allNumbers[j];
      max = Math.max(max, allNumbers[j]);
      min = Math.min(min, allNumbers[j]);
      j += 1;
    }
    if (sum === invalidNum) {
      part2 = min + max;
      break;
    }
  }
  return part2;
}

async function day09(input: string): Promise<void> {
  testPart2();

  const allNumbers = getSequence(input);
  const sumsLen = 25;

  // Part 1
  let invalidNum: number = NaN;
  for (let i = 25; i < allNumbers.length; i++) {
    const valid = isValid(allNumbers.slice(i - sumsLen, i))(allNumbers[i]);
    if (!valid) {
      invalidNum = allNumbers[i];
      break;
    }
  }
  console.log(`Part1: ${invalidNum} is not valid.`);

  // Part 2
  console.log(`Part2: ${part2(allNumbers, invalidNum)}.`);
}

export default day09;

function testPart2() {
  const all = [
    35,
    20,
    15,
    25,
    47,
    40,
    62,
    55,
    65,
    95,
    102,
    117,
    150,
    182,
    127,
    219,
    299,
    277,
    309,
    576,
  ];

  assertEquals(part2(all, 127), 62);
}
