// Solution for 2022, day 20
import { lines } from '../../utils/input.ts';
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Info);

type PuzzleInput = bigint[];

function parseInput(input: string): PuzzleInput {
  return lines(input).map(a => BigInt(a));
}

class ListNode {
  constructor(public n: bigint, public prev: ListNode, public next: ListNode) {}

  print(): string {
    let str = `${this.n}`;
    let curr = this.next;
    while(curr !== this) {
      str += `, ${curr.n}`;
      curr = curr.next;
    }
    return str;
  }
}

function mix(toMove: ListNode[]) {
  logger.info('Mixing...');
  for (const currentNode of toMove) {
    // Not sure why this works, but mod length doesn't, and mod length + 1 doesn't, either
    const n = currentNode.n % BigInt((toMove.length - 1));

    if (n < 0) {
      for (let i = 0; i > n; i--) {
        // oldPrev.prev <-> oldPrev <-> currentNode <-> oldNext
        // oldPrev.prev <-> currentNode <-> oldPrev <-> oldNext
        const oldNext = currentNode.next;
        const oldPrev = currentNode.prev;
        currentNode.prev = oldPrev.prev;
        currentNode.next = oldPrev;
        currentNode.prev.next = currentNode;
        oldPrev.next = oldNext;
        oldPrev.prev = currentNode;
        oldNext.prev = oldPrev;
      }
    } else {
      for (let i = 0; i < n; i++) {
        // oldPrev <-> currentNode <-> oldNext <-> oldNext.next
        // oldPrev <-> oldNext <-> currentNode <-> oldNext.next
        const oldNext = currentNode.next;
        const oldPrev = currentNode.prev;
        currentNode.prev = oldNext;
        currentNode.next = oldNext.next;
        currentNode.next.prev = currentNode;
        oldPrev.next = oldNext;
        oldNext.prev = oldPrev;
        oldNext.next = currentNode;
      }
    }
  }
}

function solve(encrypted: PuzzleInput, key: bigint, mixCount: number): bigint {
  const len = encrypted.length;
  encrypted = encrypted.map(n => n * key);

  const head = new ListNode(encrypted[0], null!, null!);
  head.next = head;
  head.prev = head;

  let curr = head;
  for (let i = 1; i < len; i++) {
    const newNode = new ListNode(encrypted[i], curr, curr.next);
    curr.next.prev = newNode;
    curr.next = newNode;
    curr = newNode;
  }

  const toMove: ListNode[] = [head];
  curr = head.next;
  while (curr !== head) {
    toMove.push(curr);
    curr = curr.next;
  }

  for (let i = 0; i < mixCount; i++) {
    mix(toMove);
  }

  // Find Node 0
  curr = head;
  while (curr.n !== 0n) {
    curr = curr.next;
  }

  const theNull = curr;

  function getAtOffset(start: ListNode, n: number): bigint {
    let node = start;
    for (let i = 0; i < n; i++) {
      node = node.next;
    }
    return node.n;
  }

  const a = getAtOffset(theNull, 1000);
  const b = getAtOffset(theNull, 2000);
  const c = getAtOffset(theNull, 3000);

  return a + b + c;
}

function part1(encrypted: PuzzleInput): bigint {
  return solve(encrypted, 1n, 1);
}

function part2(encrypted: PuzzleInput): bigint {
  return solve(encrypted, 811589153n, 10);
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `1
2
-3
3
-2
0
4`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 3n);

  logger.info("Tests for Part 1 OK");
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 1623178306n);

  logger.info("Tests for Part 2 OK");
}
