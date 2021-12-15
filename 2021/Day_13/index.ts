// Solution for 2021, day 10
import { matrix } from "../../utils/array.ts";
import { Point } from "../../utils/geom.ts";
import { lines, parse } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Info);

interface Origami {
  points: Point[];
  folds: Point[];
}

type PuzzleInput = Origami;

function parseInput(input: string): PuzzleInput {
  const [pointsDecl, foldsDecl] = input.split("\n\n");
  return {
    points: lines(pointsDecl).map(toPoint),
    folds: lines(foldsDecl).map((l) => {
      const [axis, coord] = l.replace("fold along ", "").split("=");
      return axis === "x" ? [parse.int(coord), 0] : [0, parse.int(coord)];
    }),
  };
}

function toKey(point: Point): string {
  return point.join(",");
}

function toPoint(s: string): Point {
  const [x, y] = s.split(",").map(parse.int);
  return [x, y];
}

function fold(points: Point[], axis: Point): Point[] {
  points = points.map((point) => {
    if (axis[0] && point[0] > axis[0]) {
      // Mirror along X
      return [-(point[0] - axis[0]) + axis[0], point[1]];
    } else if (axis[1] && point[1] > axis[1]) {
      // Mirror along X
      return [point[0], -(point[1] - axis[1]) + axis[1]];
    }
    return point;
  });
  const set = new Set<string>(points.map(toKey));
  return [...set].map(toPoint);
}

function part1(input: PuzzleInput): number {
  const points = fold(input.points, input.folds[0]);
  return points.length;
}

function part2(input: PuzzleInput): string {
  const points = input.folds.reduce(
    (points, f) => fold(points, f),
    input.points
  );

  const [xMax, yMax] = points.reduce(
    ([xMax, yMax], [x, y]) => [Math.max(xMax, x), Math.max(yMax, y)],
    [0, 0]
  );
  const [xMin, yMin] = points.reduce(
    ([xMin, yMin], [x, y]) => [Math.min(xMin, x), Math.min(yMin, y)],
    [Infinity, Infinity]
  );
  const field = matrix(yMax - yMin, xMax - xMin, ".");
  points
    .map(([x, y]) => [x - xMin, y - yMin])
    .forEach(([x, y]) => {
      if (!field[y]) field[y] = new Array(xMax - xMin);
      field[y][x] = "#";
    });
  // BLKJRBAG
  return field.map((row) => row.join("")).join("\n");
}

export default async function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  const p2 = part2(parsedInput);
  await Deno.writeTextFile("./p2.txt", p2);
  //console.log(part2(parsedInput));
}

function test() {
  const testInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

  assertEquals(parseInput(testInput).points[17][0], 9);
  assertEquals(parseInput(testInput).points[17][1], 0);
  assertEquals(parseInput(testInput).folds[0][1], 7);
  assertEquals(parseInput(testInput).folds[1][0], 5);
  assertEquals(part1(parseInput(testInput)), 17);

  /*assertEquals(
    part2(parseInput(testInput)),
    `#####
#...#
#...#
#...#
#####`
  );*/

  logger.info("Tests OK");
}
