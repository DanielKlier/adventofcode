// Solution for 2020, day 11
import { lines } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

type SeatPlan = string[][];

const dirs = [
  [-1, -1], // top left
  [-1, 0], // top middle
  [-1, 1], // top right
  [0, 1], // middle right
  [1, 1], // bottom right
  [1, 0], // bottom middle
  [1, -1], // bottom left
  [0, -1], // middle left
];

function look(map: SeatPlan, sr: number, sc: number, [dr, dc]: [number, number]): string {
  const next = get(map, sr + dr, sc + dc);
  if (next === '.') return look(map, sr + dr, sc + dc, [dr, dc]);
  else return next;
}

function occupied(map: SeatPlan, row: number, col: number) {
  return get(map, row, col) === "#";
}

function get(map: SeatPlan, row: number, col: number): string {
  return map[row] ? map[row][col] || "" : "";
}

function drawMap(map: SeatPlan) {
  map.forEach(ln => console.log(ln.join('')));
}

function solve1(map: SeatPlan): SeatPlan {
  const newMap: SeatPlan = Array.from(Array(map.length), () => Array(map[0].length));
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const numNeighbors = dirs.reduce(
        (sum, [dr, dc]) => (occupied(map, row + dr, col + dc) ? sum + 1 : sum),
        0
      );
      const state = get(map, row, col);
      let newState = state;
      if (state === "L" && numNeighbors === 0) newState = "#";
      else if (state === "#" && numNeighbors >= 4) newState = "L";
      newMap[row][col] = newState;
    }
  }
  return newMap;
}

function solve2(map: SeatPlan): SeatPlan {
  const newMap: SeatPlan = Array.from(Array(map.length), () => Array(map[0].length));
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const numNeighbors = dirs.reduce(
        (sum, [dr, dc]) => (look(map, row, col, [dr, dc]) === '#' ? sum + 1 : sum),
        0
      );
      const state = get(map, row, col);
      let newState = state;
      if (state === "L" && numNeighbors === 0) newState = "#";
      else if (state === "#" && numNeighbors >= 5) newState = "L";
      newMap[row][col] = newState;
    }
  }
  return newMap;
}

function numOccupiedSeats(map: SeatPlan): number {
  return map.reduce(
    (sum, ln) =>
      sum + ln.reduce((rowSum, s) => (s === "#" ? rowSum + 1 : rowSum), 0),
    0
  );
}

function part1(map: SeatPlan): number {
  let prevMap: SeatPlan;
  while(true) {
    prevMap = map;
    map = solve1(prevMap);
    if (numOccupiedSeats(prevMap) === numOccupiedSeats(map)) {
      return numOccupiedSeats(map);
    }
  }
}

function part2(map: SeatPlan): number {
  let prevMap: SeatPlan;
  while(true) {
    prevMap = map;
    map = solve2(prevMap);
    if (numOccupiedSeats(prevMap) === numOccupiedSeats(map)) {
      return numOccupiedSeats(map);
    }
  }
}

function parseMap(input: string): SeatPlan {
  return lines(input).map((l) => l.split(""));
}

async function day11(input: string): Promise<void> {
  testPart1();
  testPart2();

  const map = parseMap(input);

  console.log(`Part1: ${part1(map)}`);
  console.log(`Part2: ${part2(map)}`);
}

export default day11;

const testInput = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

function testPart1() {
  assertEquals(part1(parseMap(testInput)), 37);
}

function testPart2() {
  assertEquals(part2(parseMap(testInput)), 26);
}
