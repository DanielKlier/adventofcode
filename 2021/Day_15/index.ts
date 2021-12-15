// Solution for 2021, day 10
import { matrix } from "../../utils/array.ts";
import { parse, readGrid } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { PriorityQueue } from "../../utils/priority-queue.ts";
import { assertEquals } from "../../utils/test.ts";

// Great article on path finding: https://www.redblobgames.com/pathfinding/a-star/introduction.html

const logger = new Logger(Logger.Level.Debug);

type PuzzleInput = number[][];

function parseInput(input: string): PuzzleInput {
  return readGrid(input, parse.int);
}

function mapIndex(width: number, index: number) {
  return [index % width, Math.floor(index / width)];
}

function mapPoint(width: number, [x, y]: number[]) {
  return y * width + x;
}

const createFindNeighborIndexes =
  (width: number, height: number) => (current: number) => {
    const [x, y] = mapIndex(width, current);
    return [
      [x, y - 1],
      [x - 1, y],
      [x, y + 1],
      [x + 1, y],
    ]
      .filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height)
      .map((p) => mapPoint(width, p));
  };

function findShortestPathCost(input: PuzzleInput) {
  const start = 0;
  const width = input[0].length;
  const height = input.length;
  const goal = width * height - 1;
  const neighbors = createFindNeighborIndexes(width, height);

  // Dijkstra’s Algorithm
  const frontier = new PriorityQueue<number>();
  const cameFrom = new Map<number, number>();
  const costSoFar = new Map<number, number>();

  frontier.unshift(start, 0);
  costSoFar.set(start, 0);

  while (frontier.length) {
    const current = frontier.shift()!;
    if (current.value === goal) break;
    for (const next of neighbors(current.value)) {
      const [x, y] = mapIndex(width, next);
      const newCost = costSoFar.get(current.value)! + input[y][x];
      if (!costSoFar.get(next) || newCost < costSoFar.get(next)!) {
        costSoFar.set(next, newCost);
        cameFrom.set(next, current.value);
        frontier.unshift(next, newCost);
      }
    }
  }

  // Trace the path
  let current = goal;
  const path: number[] = [];
  while (current !== start) {
    path.unshift(current);
    current = cameFrom.get(current)!;
  }
  path.unshift(start);

  logger.debug(path.map((i) => mapIndex(width, i)));
  logger.debug(
    path.map((i) => mapIndex(width, i)).map(([x, y]) => input[y][x])
  );

  return (
    path
      .map((i) => mapIndex(width, i))
      .map(([x, y]) => input[y][x])
      .reduce((a, b) => a + b, 0) - input[0][0]
  );
}

function part1(input: PuzzleInput): number {
  return findShortestPathCost(input);
}

function part2(input: PuzzleInput): number {
  const newMap = matrix(input.length * 5, input.length * 5, 0);

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input.length; x++) {
      for (let tileX = 0; tileX < 5; tileX++) {
        for (let tileY = 0; tileY < 5; tileY++) {
          let newVal = input[y][x] + (tileX + tileY);
          if (newVal > 9) newVal -= 9;
          newMap[tileY * input.length + y][tileX * input.length + x] = newVal;
        }
      }
    }
  }

  logger.debug(newMap.map((row) => row.join("")).join("\n"));

  return findShortestPathCost(newMap);
}

export default function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  assertEquals(mapIndex(10, 10)[0], 0);
  assertEquals(mapIndex(10, 10)[1], 1);

  const neighbors = createFindNeighborIndexes(10, 10);
  assertEquals(neighbors(0)[0], 10);
  assertEquals(neighbors(0)[1], 1);

  assertEquals(neighbors(19)[0], 9);
  assertEquals(neighbors(19)[1], 18);
  assertEquals(neighbors(19)[2], 29);
  assertEquals(neighbors(19)[3], undefined);

  const testInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

  assertEquals(part1(parseInput(testInput)), 40);
  assertEquals(part2(parseInput(testInput)), 315);

  logger.info("Tests OK");
}
