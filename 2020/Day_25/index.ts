// Solution for 2020, day 25
import { lines } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

function memoize(otherFn: (l: number, s: number) => number) {
  const memo = new Map<string, number>();
  return function(l: number, s: number) {
    const hash = `${l}#${s}`;
    if (memo.has(hash)) return memo.get(hash)!;
    const val = otherFn(l, s);
    memo.set(hash, val);
    return val;
  }
}

function transform(loopSize: number, subjectNumber: number): number {
  let value = 1;
  for (let i = 0; i < loopSize; i++) {
    value = value * subjectNumber % 20201227;
  }
  return value;
}

function crackLoopSize(publicKey: number): number {
  let loopSize = 1;
  let key: number;
  const memo = new Map<number, number>();
  memo.set(0, 1);

  do {
    key = memo.get(loopSize - 1)! * 7 % 20201227;
    memo.set(loopSize, key);
    loopSize++;
  } while(key !== publicKey);

  return loopSize - 1;
}

async function day25(input: string): Promise<void> {
  assertEquals(crackLoopSize(5764801), 8);
  assertEquals(crackLoopSize(17807724), 11);
  assertEquals(transform(11, 5764801), 14897079);
  assertEquals(transform(8, 17807724), 14897079);

  const cardPk = 18499292;
  const doorPk = 8790390;

  const cardLoopSize = crackLoopSize(cardPk);
  const doorLoopSize = crackLoopSize(doorPk);

  const encryptionKey1 = transform(cardLoopSize, doorPk);
  const encryptionKey2 = transform(doorLoopSize, doorPk);

  console.log(`Part1: ${encryptionKey1} or ${encryptionKey2}`);
  //console.log(`Part2: ${part2(inputLines)}`);
}

export default day25;
