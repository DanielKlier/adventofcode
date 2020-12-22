// Solution for 2020, day 20
import { matrix } from "../utils/array.ts";
import { lines } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

interface Tile {
  id: number;
  tile: string[][];
  rotate: number;
  flipped: boolean;
}

function parseTile(input: string): string[][] {
  return lines(input).map((l) => l.split(""));
}

function drawTile(tile: Tile): string {
  return tile.tile.map((l) => l.join("")).join("\n");
}

function drawGrid(grid: Tile[][]): string {
  let result = "";
  const N = grid.length;
  for (let i = 0; i < N; i++) {
    let lines = Array(N).fill("");
    for (let j = 0; j < N; j++) {
      /*for (let k = 0; k < N; k ++) {
        console.log(lines[k]);
        lines[k] += grid[i][j].tile[k].join('');
      }*/
      const tile = grid[i][j];
      console.log(tile.id, tile.flipped, tile.rotate);
      console.log(drawTile(tile));
    }
    result += lines.join("\n");
  }
  return result;
}

function flip(tile: Tile): Tile {
  return {
    ...tile,
    flipped: true,
    tile: tile.tile.map((row) => row.slice().reverse()),
  };
}

function rotate(tile: Tile): Tile {
  const reversed = tile.tile.slice().reverse();
  const res = matrix(tile.tile.length, tile.tile.length, "0");
  for (let i = 0; i < tile.tile.length; i++) {
    for (let j = 0; j < tile.tile.length; j++) {
      res[i][j] = reversed[j][i];
    }
  }
  return {
    ...tile,
    tile: res,
    rotate: tile.rotate + 1,
  };
}

function getTiles(input: string): Tile[] {
  return input
    .split("\n\n")
    .map((part) => part.split(":\n"))
    .map(([idPrt, tilePrt]) => ({
      id: parseInt(idPrt.split(" ")[1], 10),
      rotate: 0,
      flipped: false,
      tile: parseTile(tilePrt),
    }));
}

function col(tile: Tile, i: number): string {
  return tile.tile.map((r) => r[i]).join("");
}

function eqTop(a: Tile, b: Tile): boolean {
  return a.tile[0].join("") === b.tile[b.tile.length - 1].join("");
}

function eqBottom(a: Tile, b: Tile): boolean {
  return eqTop(b, a);
}

function eqLeft(a: Tile, b: Tile): boolean {
  return col(a, 0) === col(b, b.tile.length - 1);
}

function eqRight(a: Tile, b: Tile): boolean {
  return eqLeft(b, a);
}

const matchOne = (eq: (a: Tile, b: Tile) => boolean) => (
  tile: Tile,
  other: Tile
): Tile | null => {
  for (let f = 0; f < 2; f++) {
    for (let rot = 0; rot < 4; rot++) {
      if (eq(tile, other)) {
        return other;
      }
      other = rotate(other);
    }
    other = flip(other);
  }
  return null;
};

const matchMany = (eq: (a: Tile, b: Tile) => boolean) => {
  const one = matchOne(eq);
  return (tile: Tile, tiles: Tile[]): Tile | null => {
    for (const other of tiles) {
      if (one(tile, other) !== null) return other;
    }
    return null;
  };
};

const manyTop = matchMany(eqTop);
const manyBottom = matchMany(eqBottom);
const manyLeft = matchMany(eqLeft);
const manyRight = matchMany(eqRight);

function allButOne(tile: Tile, tiles: Tile[]): Tile[] {
  return tiles.filter((t) => t.id !== tile.id);
}

/*function findTile(
  tiles: Tile[],
  top: Tile | null,
  left: Tile | null,
  right: boolean,
  bottom: boolean
): Tile | null {
  for (const tile of tiles) {
    const others = allButOne(tile, tiles);
    let res = tile;
    for (let f = 0; f < 2; f++) {
      for (let rot = 0; rot < 4; rot++) {
        if (manyTop(res, others) === top && manyLeft(res, others) === left && !!manyRight(res, others) === right && !!manyBottom(res, others) === bottom) {
          return res;
        }
        res = rotate(res);
      }
      res = flip(res);
    }
  }
  return null;
}*/
function findTile(
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean,
  taken: Tile[],
  remaining: Tile[],
): Tile | null {
  for (const tile of remaining) {
    const others = allButOne(tile, [...remaining, ...taken]);
    let res = tile;
    for (let f = 0; f < 2; f++) {
      for (let rot = 0; rot < 4; rot++) {
        if (
          !!manyLeft(res, others) === left &&
          !!manyRight(res, others) === right &&
          !!manyTop(res, others) === top &&
          !!manyBottom(res, others) === bottom
        ) {
          return tile;
        }
        res = rotate(res);
      }
      res = flip(res);
    }
  }
  return null;
}

function part1(input: string): number {
  const tiles = getTiles(input);
  let remainingTiles = tiles;
  let takenTiles: Tile[] = [];

  const topLeft = findTile(false, true, true, false, takenTiles, remainingTiles);
  remainingTiles = allButOne(topLeft!, remainingTiles);
  takenTiles.push(topLeft!);

  const topRight = findTile(false, false, true, true, takenTiles, remainingTiles);
  remainingTiles = allButOne(topRight!, remainingTiles);
  takenTiles.push(topRight!);

  const bottomRight = findTile(true, false, false, true, takenTiles, remainingTiles);
  remainingTiles = allButOne(bottomRight!, remainingTiles);
  takenTiles.push(bottomRight!);

  const bottomLeft = findTile(true, true, false, false, takenTiles, remainingTiles);
  remainingTiles = allButOne(bottomLeft!, remainingTiles);
  takenTiles.push(bottomLeft!);

  return topLeft!.id * topRight!.id * bottomLeft!.id * bottomRight!.id;
}

function part2(input: unknown[]): number {
  return 0;
}

async function day20(input: string): Promise<void> {
  tests();
 
  console.log(`Part1: ${part1(input)}`);
  /*console.log(`Part2: ${part2(inputLines)}`);*/
}

export default day20;

function testFlip() {
  const tile = {
    id: 1,
    flipped: false,
    rotate: 0,
    tile: parseTile(`..##
##..
#...
####`),
  };

  assertEquals(
    drawTile(flip(tile)),
    `##..
..##
...#
####`
  );
}

function testRotate() {
  const tile = {
    id: 1,
    flipped: false,
    rotate: 0,
    tile: parseTile(`..##
##..
#...
####`),
  };

  assertEquals(
    drawTile(rotate(tile)),
    `###.
#.#.
#..#
#..#`
  );
}

function tests() {
  testFlip();
  testRotate();
  testPart1();
}

const testInput = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

function testPart1() {
  assertEquals(part1(testInput), 20899048083289);
}
