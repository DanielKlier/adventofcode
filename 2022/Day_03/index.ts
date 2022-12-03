// Solution for 2022, day 03
import { lines } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

type Rucksack = [string, string];
type PuzzleInput = Rucksack[];

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function prio(str: string): number {
  return ALPHABET.indexOf(str) + 1;
}

function parseInput(input: string): PuzzleInput {
  return lines(input).map(line => {
    const len = line.length;
    const left = line.substring(0, len / 2);
    const right = line.substring(len / 2);
    return [left, right];
  })
}

function part1(input: PuzzleInput): number {
  let sum = 0;

  for (const rucksack of input) {
    const set = new Set<string>();
    const [left, right] = rucksack;

    for (const c of left) {
      if (right.includes(c)) set.add(c);
    }

    sum += [...set.values()].reduce((s, [c]) => s + prio(c), 0)
  }

  return sum;
}

function part2(input: PuzzleInput): number {
  let sum = 0;

  for (let i = 0; i < input.length; i += 3) {
    const first = input[i][0] + input[i][1];
    const second = input[i + 1][0] + input[i + 1][1];
    const third = input[i + 2][0] + input[i + 2][1];

    let badgeType: string;

    for (const c of first) {
      if (second.includes(c) && third.includes(c)) {
        badgeType = c;
        break;
      }
    }

    sum += prio(badgeType!);
  }

  return sum;
}

export default function run(input: string) {

  const parsedInput = parseInput(input);

  test1();
  console.log(`Part1: ${part1(parsedInput)}`);

  test2();
  console.log(`Part2: ${part2(parsedInput)}`);
}

const testInput = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 157);

  logger.info('Tests 1 OK');
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 70);

  logger.info('Tests 2 OK');
}
