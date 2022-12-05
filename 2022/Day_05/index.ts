// Solution for 2022, day 05
import { lines, parse } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

type CrateStack = string[];

interface Move {
  qty: number;
  src: number;
  dst: number;
}

type PuzzleInput = {
  stacks: CrateStack[];
  moves: Move[];
};

function parseCrates(input: string): CrateStack[] {
  const inputLines = input.split('\n').reverse().slice(1);

  const numStacks = Math.ceil(inputLines[0].length / 4);
  const stacks = new Array<CrateStack>(numStacks);

  for (let stackIdx = 0; stackIdx < numStacks; stackIdx++) {
    stacks[stackIdx] = [];

    for (const line of inputLines) {
      const substr = line.substring(stackIdx * 4, stackIdx * 4 + 3).trim();
      if (substr) {
        stacks[stackIdx].push(substr[1]);
      }
    }
  }

  return stacks;
}

function parseMoves(input: string): Move[] {
  const regex = /move (\d+) from (\d+) to (\d+)/;

  return lines(input).map(line => {
    const matches = line.match(regex);

    if (!matches) throw new Error('Illegal state. You parsed it wrong!');

    const [, qty, src, dst] = matches;
    return {
      qty: parse.int(qty),
      src: parse.int(src) - 1,
      dst: parse.int(dst) - 1
    };
  });
}

function parseInput(input: string): PuzzleInput {
  const [crateInput, movesInput] = input.split('\n\n');

  return {
    stacks: parseCrates(crateInput),
    moves: parseMoves(movesInput)
  }
}

function movesReducer9000(state: CrateStack[], move: Move): CrateStack[] {
  // Create copy of stacks, so we don't mutate the input
  const newStacks = state.map(s => s.slice());

  const stacksToMove: CrateStack = newStacks[move.src].slice(-move.qty).reverse();
  newStacks[move.src] = newStacks[move.src].slice(0, newStacks[move.src].length - move.qty);
  newStacks[move.dst] = newStacks[move.dst].concat(stacksToMove);

  return newStacks;
}

function movesReducer9001(state: CrateStack[], move: Move): CrateStack[] {
  // Create copy of stacks, so we don't mutate the input
  const newStacks = state.map(s => s.slice());

  const stacksToMove: CrateStack = newStacks[move.src].slice(-move.qty);
  newStacks[move.src] = newStacks[move.src].slice(0, newStacks[move.src].length - move.qty);
  newStacks[move.dst] = newStacks[move.dst].concat(stacksToMove);

  return newStacks;
}

function part1(input: PuzzleInput): string {
  const finalStacks = input.moves.reduce(movesReducer9000, input.stacks);

  return finalStacks.reduce((str, stack) => str + stack[stack.length - 1], '');
}

function part2(input: PuzzleInput): string {
  const finalStacks = input.moves.reduce(movesReducer9001, input.stacks);

  return finalStacks.reduce((str, stack) => str + stack[stack.length - 1], '');
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);
  logger.info(`Part1: ${part1(parsedInput)}`);
  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

function test1() {

  assertEquals(part1(parseInput(testInput)), 'CMZ');

  logger.info('Tests OK');
}

function test2() {

  assertEquals(part2(parseInput(testInput)), 'MCD');

  logger.info('Tests OK');
}
