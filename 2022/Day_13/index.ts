// Solution for 2022, day 13
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Info);

type Packet = Array<number|Packet>;
interface PacketPair {
  left: Packet;
  right: Packet;
}
type PuzzleInput = PacketPair[];

function parseInput(input: string): PuzzleInput {
  return input.split('\n\n').map(s => s.split('\n')).map(([l, r]) => ({
    left: JSON.parse(l) as Packet,
    right: JSON.parse(r) as Packet
  }));
}

function isInRightOrder(left: number|Packet|undefined, right: number|Packet|undefined): number {
  // Right side ran out of items first
  if (typeof right === 'undefined') return -1;
  // Left side ran out of items first
  if (typeof left === 'undefined') return 1;
  // Both are numbers
  if (typeof left === 'number' && typeof right === 'number') {
    return right - left;
  }
  if (!Array.isArray(left)) left = [left];
  if (!Array.isArray(right)) right = [right];

  let i = 0;
  let result = 0;
  while(result === 0 && (i < left.length || i < right.length)) {
    result = isInRightOrder(left[i], right[i]);
    i++;
  }

  return result;
}

function isPacketInRightOrder({left, right}: PacketPair): boolean {
  return isInRightOrder(left, right) >= 0;
}

function part1(input: PuzzleInput): number {
  const inOrderIndices: number[] = [];
  input.forEach((pair, i) => {
    if (isPacketInRightOrder(pair)) inOrderIndices.push(i + 1)
  })
  return inOrderIndices.reduce((a, b) => a+b, 0);
}

function part2(input: PuzzleInput): number {
  const div1 = [[2]];
  const div2 = [[6]];
  const allPackets = input.concat({left: div1, right: div2}).flatMap(({left, right}) => [left, right]);
  allPackets.sort(isInRightOrder).reverse();
  const div1Index = allPackets.indexOf(div1) + 1;
  const div2Index = allPackets.indexOf(div2) + 1;
  return div1Index * div2Index;
}

export default function run(input: string) {
  testIsInRightOrder();
  testIsPacketInRightOrder();
  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 13);

  logger.info("Tests for Part 1 OK");
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 140);

  logger.info("Tests for Part 2 OK");
}

function testIsInRightOrder() {
  assertEquals(isInRightOrder(1, 1), 0);
  assertEquals(isInRightOrder(3, 5), 2);
  assertEquals(isInRightOrder(9, 8), -1);
  assertEquals(isInRightOrder(undefined, 1), 1);
  assertEquals(isInRightOrder(1, undefined), -1);
  assertEquals(isInRightOrder([], [3]), 1);
  assertEquals(isInRightOrder([3], []), -1);
}

function testIsPacketInRightOrder() {
  assertEquals(isPacketInRightOrder({left: [1,1,3,1,1], right: [1,1,5,1,1]}), true);
  assertEquals(isPacketInRightOrder({left: [[1],[2,3,4]], right: [[1],4]}), true);
  assertEquals(isPacketInRightOrder({left: [9], right: [[8,7,6]]}), false);
  assertEquals(isPacketInRightOrder({left: [[4,4],4,4], right: [[4,4],4,4,4]}), true);
  assertEquals(isPacketInRightOrder({left: [7,7,7,7], right: [7,7,7]}), false);
  assertEquals(isPacketInRightOrder({left: [[[]]], right: [[]]}), false);
  assertEquals(isPacketInRightOrder({left: [1,[2,[3,[4,[5,6,7]]]],8,9], right: [1,[2,[3,[4,[5,6,0]]]],8,9]}), false);
}
