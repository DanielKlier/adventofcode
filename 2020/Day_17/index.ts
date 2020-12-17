// Solution for 2020, day 17
import { lines } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

type Coords = [number, number, number];
const CYCLES = 6;

function createCoords(length: number): string[][][] {
  const coords = Array.from({ length }, () =>
    Array.from({ length }, () => Array.from({ length }, () => "."))
  );
  return coords;
}

function parseInput(input: string[]): string[][][] {
  const offset = CYCLES + 1;
  const maxN = input.length + offset * 2;
  const coords = createCoords(maxN);
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < input.length; x++) {
      const [i, j, k] = [x + offset, y + offset, offset];
      coords[k][j][i] = line[x];
    }
  }
  return coords;
}

function neighborCoords(i: number, j: number, k: number): Coords[] {
  const coords: Coords[] = [];
  for (let a = -1; a <= 1; a++) {
    for (let b = -1; b <= 1; b++) {
      for (let c = -1; c <= 1; c++) {
        if (a === 0 && b === 0 && c === 0) {
          continue;
        }
        coords.push([i + a, j + b, k + c]);
      }
    }
  }
  return coords;
}

function simulateOne(coords: string[][][]): string[][][] {
  const N = coords.length;
  const newCoords = createCoords(N);
  for (let i = 1; i < N - 1; i++) {
    for (let j = 1; j < N - 1; j++) {
      for (let k = 1; k < N - 1; k++) {
        const currentCube = coords[i][j][k];

        const numNeighbors = neighborCoords(i, j, k).filter(
          ([a, b, c]) => coords[a][b][c] === "#"
        ).length;
        if (currentCube === "#" && numNeighbors !== 2 && numNeighbors !== 3) {
          newCoords[i][j][k] = ".";
        } else if (currentCube === "." && numNeighbors === 3) {
          newCoords[i][j][k] = "#";
        } else {
          newCoords[i][j][k] = currentCube;
        }
      }
    }
  }
  return newCoords;
}

function draw(coords: string[][][]) {
  coords.forEach((plane, i) => {
    console.log("z =", i - Math.floor(coords.length / 2));
    plane.forEach((row) => console.log(row.join("")));
  });
}

function part1(input: string[]): number {
  console.log(input);
  let coords = parseInput(input);
  //draw(coords);
  for (let t = 0; t < CYCLES; t++) {
    coords = simulateOne(coords);
  }
  //draw(coords);
  return coords.reduce(
    (sum, arr) =>
      sum +
      arr.reduce(
        (sum2, arr2) =>
          sum2 + arr2.reduce((sum3, v) => (v === "#" ? sum3 + 1 : sum3), 0),
        0
      ),
    0
  );
}

function part2(input: unknown[]): number {
  return 0;
}

async function day17(input: string): Promise<void> {
  testPart1();
  const inputLines = lines(input);
  console.log(`Part1: ${part1(inputLines)}`);
  console.log(`Part2: ${part2(inputLines)}`);
}

export default day17;

function testPart1() {
  assertEquals(neighborCoords(1, 1, 1).length, 26);
  const input = `.#.
..#
###`;

  assertEquals(part1(lines(input)), 112);
}
