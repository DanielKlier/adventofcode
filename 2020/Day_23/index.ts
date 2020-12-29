// Solution for 2020, day 23
import { parse } from "../utils/input.ts";
import { CList } from "../utils/list.ts";
import { assertEquals } from "../utils/test.ts";

interface State {
  current: number;
  currentIndex: number;
  cups: number[];
  move: number;
}

let MAX_VAL: number;

function moveCList(cups: CList<number>, log = false) {
  // Remember current for later
  log && console.log('cups:', Array.from(cups).join(' '));
  const current = cups.focus!;
  cups.rotR();
  const picked = cups.removeNL(3);
  log && console.log('picked up:', picked.join(' '));
  let destCup = current.data;
  do {
    destCup--;
    if (destCup < 1) destCup = MAX_VAL;
  } while(picked.includes(destCup));
  cups.focus = cups.map.get(destCup)!;
  log && console.log('destination:', destCup);
  picked.forEach((p) => cups.insertL(p));
  cups.focus = current.right;
}

function part1(initialState: State): string {
  const list = new CList<number>();
  MAX_VAL = Math.max(...initialState.cups);
  initialState.cups.forEach((c) => list.insertL(c));
  list.rotR();
  for (let i = 0; i < 100; i++) {
    console.log(`-- move ${i + 1} --`);
    moveCList(list, true);
  }
  list.focus = list.map.get(1)!;
  const [, ...rest] = Array.from(list);
  return rest.join('');
}

function part2(initialState: State): number {
  const list = new CList<number>();
  initialState.cups.forEach((c) => list.insertL(c));
  const start = Math.max(...initialState.cups) + 1;
  MAX_VAL = 1000000;
  for (let i = start; i <= MAX_VAL; i++) {
    list.insertL(i);
  }
  list.rotR();
  const N = 10000000;
  const enc = new TextEncoder();
  for (let i = 0; i < N; i++) {
    moveCList(list);
    if (i % (N / 10000) === 0) {
      Deno.stdout.writeSync(
        enc.encode(`Progress: ${i.toString().padStart(8)} / ${N}   \r`)
      );
    }
  }
  Deno.stdout.writeSync(enc.encode('\n'));

  list.focus = list.map.get(1)!;
  list.rotR();
  const star1 = list.focus?.data!;
  list.rotR();
  const star2 = list.focus?.data!;
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

  //assertEquals(part2(testState), 149245887792);
  console.log(`Part2: ${part2(puzzleState)}`);
}

export default day23;
