// Solution for 2022, day 02
// noinspection PointlessArithmeticExpressionJS

import { lines } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

type RPS_A = 'A' | 'B' | 'C';
type RPS_B = 'X' | 'Y' | 'Z';
type RPS = 'R' | 'P' | 'S';
type PuzzleInputLine = [RPS_A, RPS_B];
type PuzzleInput = PuzzleInputLine[];

function parseInput(input: string): PuzzleInput {
  return lines(input).map(line => (line.split(' ') as PuzzleInputLine));
}

const lookup: Record<string, RPS> = {
  'A': 'R',
  'B': 'P',
  'C': 'S',
  'X': 'R',
  'Y': 'P',
  'Z': 'S'
}

const roundScores: Record<string, number> = {
  // I choose rock!
  'RR': 3 + 1,
  'PR': 0 + 1,
  'SR': 6 + 1,
  // I choose paper!
  'RP': 6 + 2,
  'PP': 3 + 2,
  'SP': 0 + 2,
  // I choose scissors!
  'RS': 0 + 3,
  'PS': 6 + 3,
  'SS': 3 + 3
}

// We could directly calculate the score here, too.
const part2Lookup: Record<string, RPS> = {
  // I choose rock!
  'AX': 'S',
  'AY': 'R',
  'AZ': 'P',
  // I choose paper!
  'BX': 'R',
  'BY': 'P',
  'BZ': 'S',
  // I choose scissors!
  'CX': 'P',
  'CY': 'S',
  'CZ': 'R'
}

function roundScore(opponent: RPS, player: RPS): number {
  return roundScores[`${opponent}${player}`];
}

function part1(input: PuzzleInput): number {
  return input.reduce((score, [a, b]) => {
    const opponentChoice = lookup[a];
    const playerChoice = lookup[b];
    return score + roundScore(opponentChoice, playerChoice);
  }, 0);
}

function part2(input: PuzzleInput): number {
  return input.reduce((score, [a, b]) => {
    const opponentChoice = lookup[a];
    const playerChoice = part2Lookup[`${a}${b}`];
    return score + roundScore(opponentChoice, playerChoice);
  }, 0);
}

export default function run(input: string) {


  const parsedInput = parseInput(input);

  test1();
  console.log(`Part1: ${part1(parsedInput)}`);
  test2();
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test1() {
  const testInput = `A Y
B X
C Z`;

  assertEquals(part1(parseInput(testInput)), 15);

  logger.info('Tests for 1 OK');
}

function test2() {
  const testInput = `A Y
B X
C Z`;

  assertEquals(part2(parseInput(testInput)), 12);

  logger.info('Tests for 2 OK');
}
