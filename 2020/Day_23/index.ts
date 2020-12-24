// Solution for 2020, day 23
import { parse } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

interface State {
  current: number;
  currentIndex: number;
  cups: number[];
  move: number;
}

function indexOf<T>(arr: T[], el: T, from: number): number {
  let i = arr.indexOf(el, from);
  if (i < 0) i = arr.indexOf(el, 0);
  return i;
}

function take<T>(arr: T[], after: number, n: number): T[] {
  const taken: T[] = [];
  for (let i = 0; i < n; i++) {
    taken.push(arr[(after + i + 1) % arr.length]);
  }
  taken.forEach((t) => {
    arr.splice(indexOf(arr, t, after), 1);
  });
  return taken;
}

let MAX_VAL: number;

function move({ cups, current, currentIndex, move }: State): State {
  // Get next three cups
  //const cupsCopy = cups.slice();
  const cupsCopy = cups;
  const next = take(cupsCopy, currentIndex, 3);
  let destinationCup = current - 1;
  while (next.includes(destinationCup)) {
    destinationCup--;
  }
  if (destinationCup < 1) {
    destinationCup = MAX_VAL;
    while (next.includes(destinationCup)) {
      destinationCup--;
    }
  }
  const destIndex = indexOf(cupsCopy, destinationCup, currentIndex);
  cupsCopy.splice(destIndex + 1, 0, ...next);
  const newCurrentIndex =
    (indexOf(cupsCopy, current, currentIndex) + 1) % cupsCopy.length;
  return {
    cups: cupsCopy,
    current: cupsCopy[newCurrentIndex],
    move: move + 1,
    currentIndex: newCurrentIndex,
  };
}

function* moves(state: State, N: number) {
  for (let i = 0; i < N; i++) {
    state = move(state);
    yield state;
  }
}

function part1(initialState: State): string {
  let state: State = initialState;
  MAX_VAL = Math.max(...initialState.cups);
  for (state of moves(initialState, 100));
  const startIndex = state.cups.indexOf(1);
  let result = "";
  for (let i = 1; i < state.cups.length; i++) {
    result += state.cups[(startIndex + i) % state.cups.length];
  }
  return result;
}

function part2(initialState: State): number {
  const start = Math.max(...initialState.cups) + 1;
  for (let i = start; i <= 1000000; i++) {
    initialState.cups.push(i);
  }
  let state: State = initialState;
  const N = 10000000;
  const enc = new TextEncoder();
  for (let i = 0; i < N; i++) {
    state = move(state);
    if (i % (N / 10000) === 0) {
      Deno.stdout.writeSync(
        enc.encode(`Progress: ${i.toString().padStart(8)} / ${N}   \r`)
      );
    }
  }
  MAX_VAL = 1000000;

  const startIndex = state.cups.indexOf(1);
  const star1 = state.cups[(startIndex + 1) % state.cups.length];
  const star2 = state.cups[(startIndex + 2) % state.cups.length];
  return star1 * star2;
}

async function day23(): Promise<void> {
  const testState = {
    cups: "389125467".split("").map(parse.int),
    current: 3,
    currentIndex: 0,
    move: 1,
  };
  assertEquals(part1(testState), "67384529");
  const puzzleState = {
    cups: "459672813".split("").map(parse.int),
    current: 4,
    currentIndex: 0,
    move: 1,
  };
  console.log(`Part1: ${part1(puzzleState)}`);

  assertEquals(part2(testState), 149245887792);
  console.log(`Part2: ${part2(puzzleState)}`);
}

export default day23;
