// Solution for 2022, day 06
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Info);

type PuzzleInput = string;

function parseInput(input: string): PuzzleInput {
  return input;
}

function allDiffer(str: string): boolean {
  const set = new Set<string>();
  for (const c of str) {
    if (set.has(c)) return false;
    set.add(c);
  }
  return true;
}

const window = (size: number) => (str: string, offset: number): string => {
  return str.substring(offset, offset + size);
}

function part1(input: PuzzleInput): number {
  const size4Window = window(4);
  let offset = 0;
  while (!allDiffer(size4Window(input, offset))) {
    offset++;
  }

  return offset + 4;
}

function part2(input: PuzzleInput): number {
  const size14Window = window(14);
  let offset = 0;
  while (!allDiffer(size14Window(input, offset))) {
    offset++;
  }

  return offset + 14;
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

function test1() {
  assertEquals(part1(parseInput('bvwbjplbgvbhsrlpgdmjqwftvncz')), 5);
  assertEquals(part1(parseInput('nppdvjthqldpwncqszvftbrmjlhg')), 6);
  assertEquals(part1(parseInput('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')), 10);
  assertEquals(part1(parseInput('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')), 11);

  logger.info("Tests for Part 1 OK");
}

function test2() {
  assertEquals(part2(parseInput('mjqjpqmgbljsphdztnvjfqwrcgsmlb')), 19);
  assertEquals(part2(parseInput('bvwbjplbgvbhsrlpgdmjqwftvncz')), 23);
  assertEquals(part2(parseInput('nppdvjthqldpwncqszvftbrmjlhg')), 23);
  assertEquals(part2(parseInput('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')), 29);
  assertEquals(part2(parseInput('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')), 26);

  logger.info("Tests for Part 2 OK");
}
