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

function markMonsters(tile: Tile): [Tile,number] {
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

function dfs(
  start: number,
  x: number,
  y: number,
  tiles: Tile[],
  adjMat: AdjMat,
  grid: Tile[][],
  visited: boolean[],
  rot: number,
  flip: boolean,
  tile: Tile
) {
  visited[start] = true;
  grid[y][x] = tile;
  for (let i = 0; i < tiles.length; i++) {
    const adj = adjMat[start][i];
    if (adj) {
      let dx = 0,
        dy = 0;
      switch ((adj.edge + rot) % 4) {
        case Edge.BOTTOM:
          dy = 1;
          break;
        case Edge.LEFT:
          dx = -1;
          break;
        case Edge.RIGHT:
          dx = 1;
          break;
        case Edge.TOP:
          dy = -1;
          break;
      }
      if (!visited[i]) {
        if (flip) dx = -dx;
        dfs(
          i,
          x + dx,
          y + dy,
          tiles,
          adjMat,
          grid,
          visited,
          rot + adj.b.rotate,
          adj.b.flipped,
          adj.b
        );
      }
    }
  }
}

function part2(tiles: Tile[], adjMat: AdjMat): number {
  const N = Math.sqrt(adjMat.length);
  const grid = matrix<Tile>(N, N);
  const startRow = adjMat
    .find(
      (row) =>
        row.filter((a) => a).length === 2 &&
        row.find((m) => m?.edge === Edge.RIGHT) &&
        row.find((m) => m?.edge === Edge.BOTTOM)
    )
    ?.filter((a) => a);
  const startTile = startRow![0];
  let start = startTile?.i!;

  dfs(
    start,
    0,
    0,
    tiles,
    adjMat,
    grid,
    Array(tiles.length).fill(false),
    0,
    false,
    startTile?.a!
  );

  const image = drawGrid(grid);
  let imageTile: Tile = {
    tile: parseTile(image),
    flipped: false,
    id: 0,
    rotate: 0,
  };

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
  console.log(drawTile(flip(rotate({id: 1, rotate: 0, flipped: false, tile: parseTile(in2)}))));
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
