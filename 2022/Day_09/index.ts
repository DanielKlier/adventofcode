// Solution for 2022, day 09
import { range } from '../../utils/array.ts';
import { Point } from '../../utils/geom.ts';
import { lines, parse } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

type Dir = 'U' | 'D' | 'L' | 'R';

interface Move {
  dir: Dir;
  dist: number;
}

type PuzzleInput = Move[];

function parseInput(input: string): PuzzleInput {
  return lines(input)
    .map(ln => ln.split(' '))
    .map(([a, b]) => ({dir: a as Dir, dist: parse.int(b)}))
}

function pointToString([x, y]: Point): string {
  return `${x}#${y}`;
}

function part1(moves: PuzzleInput): number {
  let head: Point = [0, 0];
  let tail: Point = [0, 0];
  const tailPositions = new Set<string>();
  tailPositions.add(pointToString(tail));

  for (const {dir, dist} of moves) {
    const [dx, dy] = {U: [0, 1], D: [0, -1], L: [-1, 0], R: [1, 0]}[dir];

    for (let i = 0; i < dist; i++) {
      let [hx, hy] = head;
      hx += dx;
      hy += dy;
      let [tx, ty] = tail;

      // If the head is ever two steps directly up, down, left, or right from the tail,
      // the tail must also move one step in that direction, so it remains close enough.
      // Otherwise, if the head and tail aren't touching and aren't in the same row or column,
      // the tail always moves one step diagonally to keep up
      const [vx, vy] = [hx - tx, hy - ty];
      if (Math.abs(vx) > 1 || Math.abs(vy) > 1) {
        tx += Math.min(1, Math.max(-1, vx));
        ty += Math.min(1, Math.max(-1, vy));
      }
      head = [hx, hy];
      tail = [tx, ty];
      tailPositions.add(pointToString(tail));
    }
  }

  return Array.from(tailPositions.values()).length;
}

function part2(moves: PuzzleInput): number {
  const rope: Point[] = range(1, 10).map(_ => [0, 0]);
  const tailPositions = new Set<string>();
  tailPositions.add(pointToString([0, 0]));

  for (const {dir, dist} of moves) {
    const [dx, dy] = {U: [0, 1], D: [0, -1], L: [-1, 0], R: [1, 0]}[dir];

    for (let i = 0; i < dist; i++) {
      let [hx, hy] = rope[0];
      hx += dx;
      hy += dy;
      rope[0] = [hx, hy];

      for (let r = 1; r < rope.length; r++) {
        const myHead = rope[r - 1];
        let [tx, ty] = rope[r];

        // If the head is ever two steps directly up, down, left, or right from the tail,
        // the tail must also move one step in that direction, so it remains close enough.
        // Otherwise, if the head and tail aren't touching and aren't in the same row or column,
        // the tail always moves one step diagonally to keep up
        const [vx, vy] = [myHead[0] - tx, myHead[1] - ty];
        if (Math.abs(vx) > 1 || Math.abs(vy) > 1) {
          tx += Math.min(1, Math.max(-1, vx));
          ty += Math.min(1, Math.max(-1, vy));
        }
        rope[r] = [tx, ty];
      }
      tailPositions.add(pointToString(rope[rope.length - 1]));
    }
  }

  return Array.from(tailPositions.values()).length;
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 13);

  logger.info('Tests for Part 1 OK');
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 1);

  logger.info('Tests for Part 2 OK');
}
