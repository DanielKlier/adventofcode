// Solution for 2020, day 20
import { matrix } from "../utils/array.ts";
import { lines } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

const monsterPattern = [
  /..................#./,
  /#....##....##....###/,
  /.#..#..#..#..#..#.../,
];

interface Tile {
  id: number;
  tile: string[][];
  rotate: number;
  flipped: boolean;
}

enum Edge {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}
interface TileMatch {
  a: Tile;
  b: Tile;
  edge: Edge;
  i: number;
  j: number;
}

type AdjMat = (TileMatch | null)[][];

function parseTile(input: string): string[][] {
  return lines(input).map((l) => l.split(""));
}

function drawTile(tile: Tile): string {
  return tile.tile.map((l) => l.join("")).join("\n");
}

function markMonsters(tile: Tile): [Tile, number] {
  const tileCopy = {
    ...tile,
    tile: parseTile(tile.tile.map((r) => r.join("")).join("\n")),
  };
  const lines = tile.tile.map((r) => r.join(""));
  const ll = lines[0].length;
  const mpl = monsterPattern[0].source.length;
  let matches = 0;
  for (let i = 0; i < lines.length - monsterPattern.length; i++) {
    const subLines = lines.slice(i, monsterPattern.length + i);
    for (let off = 0; off < ll - mpl; off++) {
      if (
        subLines.every((sl, i) => sl.substr(off, mpl).match(monsterPattern[i]))
      ) {
        for (let subI = 0; subI < subLines.length; subI++) {
          for (let subJ = 0; subJ < mpl; subJ++) {
            if (monsterPattern[subI].source[subJ] === "#") {
              tileCopy.tile[i + subI][subJ + off] = "O";
            }
          }
        }
        matches++;
      }
    }
  }
  return [tileCopy, matches];
}

function drawGrid(grid: Tile[][]): string {
  const N = grid.length;
  const M = grid[0][0].tile.length - 2;
  let lines: string[] = Array(N * M).fill("");
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const tile = grid[i][j].tile;
      for (let k = 0; k < M; k++) {
        lines[i * M + k] += tile[k + 1].join("").substr(1, M);
      }
    }
  }
  return lines.join("\n");
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
    rotate: (tile.rotate + 1) % 4,
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

const matchTop = matchOne(eqTop);
const matchRight = matchOne(eqRight);
const matchBottom = matchOne(eqBottom);
const matchLeft = matchOne(eqLeft);

function adjacencyMatrix(tiles: Tile[]): AdjMat {
  const mat = matrix<TileMatch | null>(tiles.length, tiles.length, null);

  tiles.forEach((tile, i) => {
    tiles.forEach((ot, j) => {
      if (ot === tile) return;
      let match: Tile | null;
      if ((match = matchTop(tile, ot))) {
        mat[i][j] = { a: tile, b: match, edge: Edge.TOP, i, j };
      } else if ((match = matchRight(tile, ot))) {
        mat[i][j] = { a: tile, b: match, edge: Edge.RIGHT, i, j };
      } else if ((match = matchBottom(tile, ot))) {
        mat[i][j] = { a: tile, b: match, edge: Edge.BOTTOM, i, j };
      } else if ((match = matchLeft(tile, ot))) {
        mat[i][j] = { a: tile, b: match, edge: Edge.LEFT, i, j };
      }
    });
  });

  return mat;
}

function part1(adjMat: AdjMat): number {
  const corners = adjMat
    .filter((row) => row.filter((a) => a).length === 2)
    .map((r) => r.find((a) => a)?.a!);
  return corners.reduce((p, c) => p * c.id, 1);
}

function findTopLeftCorner(tiles: Tile[], adjMat: AdjMat): Tile {
  return tiles.find(
    (_, i) =>
      adjMat[i].filter((a) => a).length === 2 &&
      adjMat[i].find((adj) => adj?.edge === Edge.RIGHT) &&
      adjMat[i].find((adj) => adj?.edge === Edge.BOTTOM)
  )!;
}

function findRightMatch(tile: Tile, tiles: Tile[]): Tile {
  let res: Tile | null;
  for (const ot of tiles) {
    if (ot === tile) continue;
    res = matchRight(tile, ot);
    if (res) break;
  }
  return res!;
}

function findBottomMatch(tile: Tile, tiles: Tile[]): Tile {
  let res: Tile | null;
  for (const ot of tiles) {
    if (ot === tile) continue;
    res = matchBottom(tile, ot);
    if (res) break;
  }
  return res!;
}

function without(arr: Tile[], item: Tile): Tile[] {
  return arr.filter(it => it.id !== item.id);
}

function part2(tiles: Tile[], adjMat: AdjMat): number {
  const N = Math.sqrt(adjMat.length);
  const grid = matrix<Tile>(N, N);
  let prevY = findTopLeftCorner(tiles, adjMat);

  for (let y = 0; y < N; y++) {
    grid[y][0] = prevY;
    tiles = without(tiles, prevY);
    let prevX = prevY;
    // Complete the row
    for (let x = 1; x < N; x++) {
      const t = findRightMatch(prevX, tiles);
      grid[y][x] = t;
      tiles = without(tiles, t);
      prevX = t;
    }
    prevY = findBottomMatch(prevY, tiles);
  }

  const image = drawGrid(grid);

  let imageTile: Tile = {
    tile: parseTile(image),
    flipped: false,
    id: 0,
    rotate: 0,
  };

  console.log(drawTile(flip(rotate(rotate(imageTile)))));

  let maxMatches = 0;
  let maxMatchTile: Tile;
  for (let rot = 0; rot < 4; rot++) {
    for (let f = 0; f < 2; f++) {
      const [matchingTile, matches] = markMonsters(imageTile);
      if (matches > maxMatches) {
        maxMatchTile = matchingTile;
        maxMatches = matches;
      }
      imageTile = flip(imageTile);
    }
    imageTile = rotate(imageTile);
  }

  return maxMatchTile!.tile.reduce(
    (sum, row) => sum + row.filter((s) => s === "#").length,
    0
  );
}

async function day20(input: string): Promise<void> {
  tests();

  const tiles = getTiles(input);
  const adjMat = adjacencyMatrix(tiles);

  console.log(`Part1: ${part1(adjMat)}`);
  console.log(`Part2: ${part2(tiles, adjMat)}`);
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
  testPart2();
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
  const tiles = getTiles(testInput);
  const adjMat = adjacencyMatrix(tiles);
  assertEquals(part1(adjMat), 20899048083289);
}

function testPart2() {
  const tiles = getTiles(testInput);
  const adjMat = adjacencyMatrix(tiles);
  assertEquals(part2(tiles, adjMat), 273);
}

const in2 = `.#.#..#.##...#.##..#####
###....#.#....#..#......
##.##.###.#.#..######...
###.#####...#.#####.#..#
##.#....#.##.####...#.##
...########.#....#####.#
....#..#...##..#.#.###..
.####...#..#.....#......
#..#.##..#..###.#.##....
#.####..#.####.#.#.###..
###.#.#...#.######.#..##
#.####....##..########.#
##..##.#...#...#.#.#.#..
...#..#..#.#.##..###.###
.#.#....#.##.#...###.##.
###.#...#..#.##.######..
.#.#.###.##.##.#..#.##..
.####.###.#...###.#..#.#
..#.#..#..#.#.#.####.###
#..####...#.#.#.###.###.
#####..#####...###....##
#.##..#..#...#..####...#
.#.###..##..##..####.##.
...###...##...#...#..###`;
