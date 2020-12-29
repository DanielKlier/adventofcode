// Solution for 2020, day 24
// Big thanks to https://www.redblobgames.com/grids/hexagons/ for their excellent guide on hex tile maps
import { lines } from "../utils/input.ts";

enum Color {
  W = "W",
  B = "B",
}

const neighbors = ["e", "se", "sw", "w", "nw", "ne"];
enum Direction {
  e,
  se,
  sw,
  w,
  nw,
  ne,
}

class Tile {
  color: Color = Color.W;
  constructor(public readonly col: number, public readonly row: number) {}

  flip() {
    this.color = this.color === Color.W ? Color.B : Color.W;
  }

  get isBlack() {
    return this.color === Color.B;
  }
  get isWhite() {
    return this.color === Color.W;
  }
}

const oddrDirections = [
  // even row
  [
    [+1, +0],
    [+0, +1],
    [-1, +1],
    [-1, +0],
    [-1, -1],
    [+0, -1],
  ],
  // odd row
  [
    [+1, +0],
    [+1, +1],
    [+0, +1],
    [-1, +0],
    [+0, -1],
    [+1, -1],
  ],
];

function neighborCoords(tile: Tile, dir: Direction) {
  const parity = tile.row & 1;
  const [dc, dr] = oddrDirections[parity][dir];
  return [tile.col + dc, tile.row + dr];
}

class HexMap {
  readonly tiles = new Map<number, Map<number, Tile>>();
  constructor(public readonly startTile: Tile) {
    this.set(startTile.col, startTile.row, startTile);
  }

  set(col: number, row: number, tile: Tile) {
    if (!this.tiles.has(col)) {
      this.tiles.set(col, new Map<number, Tile>());
    }
    this.tiles.get(col)?.set(row, tile);
  }

  get(col: number, row: number): Tile | undefined {
    return this.tiles.get(col)?.get(row);
  }

  has(col: number, row: number): boolean {
    return !!this.tiles.get(col)?.has(row);
  }

  neighbors(tile: Tile): Tile[] {
    const res: Tile[] = [];
    for (let i = 0; i < 6; i++) {
      const neighbor = this.neighbor(tile, i);
      if (neighbor) res.push(neighbor);
    }
    return res;
  }

  ensureNeighbors(tile: Tile) {
    for (let i = 0; i < 6; i++) {
      const [col, row] = neighborCoords(tile, i);
      if (!this.has(col, row)) {
        this.set(col, row, new Tile(col, row));
      }
    }
  }

  neighbor(tile: Tile, dir: Direction): Tile | undefined {
    const [col, row] = neighborCoords(tile, dir);
    return this.get(col, row);
  }

  visit(visitor: (tile: Tile) => void) {
    this.tiles.forEach((col) =>
      col.forEach((tile) => {
        visitor(tile);
      })
    );
  }

  get numBlack(): number {
    let numBlack = 0;
    this.visit((tile) => (numBlack = numBlack + (tile.isBlack ? 1 : 0)));
    return numBlack;
  }
}

function move(
  map: HexMap,
  [d, ...rest]: Direction[],
  startTile = map.startTile
) {
  if (!isNaN(d)) {
    const [col, row] = neighborCoords(startTile, d);
    if (!map.has(col, row)) {
      map.set(col, row, new Tile(col, row));
    }
    const nextTile = map.get(col, row);
    move(map, rest, nextTile);
  } else {
    startTile.flip();
  }
}

function getDirections(input: string): Direction[] {
  return Array.from(input.matchAll(/e|se|sw|w|nw|ne/gm))
    .flatMap((a) => a)
    .map((a) => neighbors.indexOf(a));
}

function flipTiles(map: HexMap) {
  const toFlip = new Set<Tile>();
  map.tiles.forEach((col) =>
    col.forEach((tile) => {
      if (tile.isBlack) {
        map.ensureNeighbors(tile);
      }
    })
  );
  map.visit((tile) => {
    const numNeighbors = map.neighbors(tile).filter((n) => n.color === Color.B)
      .length;
    if (tile.isBlack && (numNeighbors === 0 || numNeighbors > 2)) {
      toFlip.add(tile);
    } else if (tile.isWhite && numNeighbors === 2) {
      toFlip.add(tile);
    }
  });
  for (const tile of toFlip) {
    tile.flip();
  }
}

async function day24(input: string): Promise<void> {
  const inputLines = lines(input);
  const startTile = new Tile(0, 0);
  const map = new HexMap(startTile);
  inputLines.forEach((line) => {
    move(map, getDirections(line));
  });

  console.log(`Part1: ${map.numBlack}`);

  for (let i = 0; i < 100; i++) {
    flipTiles(map);
  }

  console.log(`Part2: ${map.numBlack}`);
}

export default day24;
