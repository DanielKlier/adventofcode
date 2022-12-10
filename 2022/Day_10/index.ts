// Solution for 2022, day 10
import { matrix } from '../../utils/array.ts';
import { lines, parse } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

interface Noop {
  op: 'noop';
  cycles: 1;
}

interface AddX {
  op: 'addx';
  val: number;
  cycles: 2;
}

type Instruction=Noop|AddX;

type PuzzleInput = Instruction[];

function parseInput(input: string): PuzzleInput {
  return lines(input).map(ln => ln.split(' ')).map(([a, b])=>{
    switch (a) {
      case 'noop': return {op: 'noop', cycles: 1};
      case 'addx': return {op: 'addx', val: parse.int(b), cycles: 2};
      default:
        throw new Error('Invalid Op');
    }
  })
}

function getOpResult(op: Instruction, x: number): number {
  if (op.op === 'noop') return x;
  else if (op.op === 'addx') return x + op.val;
  else throw new Error('Invalid Op');
}

function part1(input: PuzzleInput): number {
  const measurements: number[] = [];
  const remainingOps = input.slice();
  let x = 1;
  let currentOp: Instruction|undefined;
  let remainingOpCycles = 0;

  for (let cycle = 1; cycle <= 220; cycle++) {
    if (remainingOpCycles === 0) {
      if (currentOp) {
        x = getOpResult(currentOp, x);
      }
      currentOp = remainingOps.shift();
      if (!currentOp) continue;
      remainingOpCycles += currentOp.cycles;
    }
    if ((cycle - 20) % 40 === 0) {
      measurements.push(cycle * x);
    }
    remainingOpCycles--;
  }

  return measurements.reduce((a, b) => a+b, 0);
}

function part2(input: PuzzleInput): string {
  const width = 40;
  const height = 6;
  const str = matrix(height, width, '.');

  const remainingOps = input.slice();
  let x = 1;
  let currentOp: Instruction|undefined;
  let remainingOpCycles = 0;

  for (let cycle = 0; cycle < width * height; cycle++) {
    if (remainingOpCycles === 0) {
      if (currentOp) {
        x = getOpResult(currentOp, x);
      }
      currentOp = remainingOps.shift();
      if (!currentOp) continue;
      remainingOpCycles += currentOp.cycles;
    }

    // Draw a pixel
    const px = cycle % width;
    const py = Math.floor(cycle / width);
    if (px >= x - 1 && px <= x+1) {
      str[py][px] = '#';
    }

    remainingOpCycles--;
  }

  return str.map(ln => ln.join('')).join('\n');
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2:\n${part2(parsedInput)}`);
}

const testInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 13140);

  logger.info('Tests for Part 1 OK');
}

function test2() {
  assertEquals(part2(parseInput(testInput)), `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`);

  logger.info('Tests for Part 2 OK');
}
