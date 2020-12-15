// Solution for 2020, day 15
import { parse } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

interface State {
  turn: number;
  last: number;
  memory: Map<number, Mem>;
}

function init(numbers: number[]): State {
  return numbers.reduce(
    (s, n) => ({
      turn: s.turn + 1,
      last: n,
      memory: s.memory.set(n, new Mem(s.turn + 1)),
    }),
    { turn: 0, last: 0, memory: new Map<number, Mem>() } as State
  );
}

class Mem {
  a: number = NaN;
  b: number = NaN;

  constructor(a?: number) {
    if (a) this.a = a;
  }

  add(n: number) {
    if (!isNaN(this.a)) {
      this.b = this.a;
    }
    this.a = n;
  }

  get hasB() {
    return !isNaN(this.b);
  }
}

function next(state: State): State {
  let nextNumber: number;
  let turn = state.turn + 1;
  const mem = state.memory.get(state.last)!;
  if (mem.hasB) {
    nextNumber = mem.a - mem.b;
  } else {
    nextNumber = 0;
  }

  const nextNumberMem = state.memory.get(nextNumber) || new Mem();
  nextNumberMem.add(turn);
  state.turn = turn;
  state.last = nextNumber;
  state.memory.set(nextNumber, nextNumberMem);
  return state;
}

function part1(input: number[]): number {
  let state = init(input);
  for (let i = input.length; i < 2020; i++) {
    state = next(state);
  }
  return state.last;
}

function part2(input: number[]): number {
  const turns = 30000000;
  let state = init(input);
  for (let i = input.length; i < turns; i++) {
    state = next(state);
    //f (i % (turns / 100) === 0) console.log((i / turns) * 100);
  }
  return state.last;
}

async function day15(input: string): Promise<void> {
  testPart1();

  const numbers = input.split(",").map(parse.int);

  console.log(`Part1: ${part1(numbers)}`);
  console.log(`Part2: ${part2(numbers)}`);
}

export default day15;

function testPart1() {
  assertEquals(part1([0, 3, 6]), 436);
}
