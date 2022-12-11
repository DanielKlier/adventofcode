// Solution for 2022, day 11
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";
import { Monkey } from './monkey.ts';
import { parseMonkey } from './parse-monkey.ts';

const logger = new Logger(Logger.Level.Info);

type PuzzleInput = Monkey[];

function parseInput(input: string): PuzzleInput {
  return input.split('\n\n').map(parseMonkey);
}

const turnFactory = (reliefDivisor: bigint, monkeyTestProduct: bigint) => (monkey: Monkey, monkeys: Monkey[]) => {
  while(monkey.items.length) {
    let item = monkey.items.shift();
    if (!item) break;
    item = item % monkeyTestProduct;
    monkey.monkeyBusiness = monkey.monkeyBusiness + 1n;
    const newWorryLevel = monkey.operation(item) / reliefDivisor;
    const isDivisible = newWorryLevel % monkey.divisor === 0n;
    const target = isDivisible ? monkey.ifTrue : monkey.ifFalse;
    monkeys[target].items.push(newWorryLevel);
  }
}

const roundFactory = (turn: (monkey: Monkey, monkeys: Monkey[]) => void) => (monkeys: PuzzleInput) => {
  for (const monkey of monkeys) {
    turn(monkey, monkeys);
  }
}

const simulateMonkeyBusinessFactory = (round: (monkeys: Monkey[]) => void) => (monkeys: Monkey[], turns: number): bigint => {
  let roundIndex = 1;

  while(roundIndex <= turns) {
    round(monkeys);
    roundIndex = roundIndex + 1;
  }

  const monkeyBusinessLevels = monkeys.map(m => m.monkeyBusiness);
  monkeyBusinessLevels.sort((a, b) => {
    const diff = b - a;
    if (diff > 0n) return 1;
    else if (diff < 0n) return -1;
    else return 0;
  });
  const [a, b] = monkeyBusinessLevels;
  return a * b;
}

function part1(monkeys: PuzzleInput): bigint {
  const monkeyTestProduct = monkeys.reduce((p, m) => p * m.divisor, 1n);
  const turn = turnFactory(3n, monkeyTestProduct);
  const round = roundFactory(turn);
  const simulateMonkeyBusiness = simulateMonkeyBusinessFactory(round);

  return simulateMonkeyBusiness(monkeys, 20);
}

function part2(monkeys: PuzzleInput): bigint {
  const monkeyTestProduct = monkeys.reduce((p, m) => p * m.divisor, 1n);
  const turn = turnFactory(1n, monkeyTestProduct);
  const round = roundFactory(turn);
  const simulateMonkeyBusiness = simulateMonkeyBusinessFactory(round);

  return simulateMonkeyBusiness(monkeys.slice(), 10000);
}

export default function run(input: string) {

  test1();
  let parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  parsedInput = parseInput(input);
  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 10605n);

  logger.info("Tests for Part 1 OK");
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 2713310158n);

  logger.info("Tests for Part 2 OK");
}
