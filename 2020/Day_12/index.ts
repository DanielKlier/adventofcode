// Solution for 2020, day 12
import { lines } from "../../utils/input.ts";

interface Ship {
  facing: number;
  x: number;
  y: number;
}

interface Ship2 {
  wp: [number, number];
  x: number;
  y: number;
}

type Op = "N" | "E" | "S" | "W" | "L" | "R" | "F";

interface Inst {
  op: Op;
  am: number;
}

function degToRad(x: number): number {
  return (x * Math.PI) / 180;
}

function move1({ facing, x, y }: Ship, { op, am }: Inst): Ship {
  switch (op) {
    case "N":
      return { facing, x, y: y + am };
    case "E":
      return { facing, x: x + am, y };
    case "S":
      return { facing, x, y: y - am };
    case "W":
      return { facing, x: x - am, y };
    case "R":
      return { facing: facing - am, x, y };
    case "L":
      return { facing: facing + am, x, y };
    case "F":
      return {
        facing,
        x: Math.round(x + am * Math.cos(degToRad(facing))),
        y: Math.round(y + am * Math.sin(degToRad(facing))),
      };
  }
}

function rotate(x: number, y: number, deg: number): [number, number] {
  const beta = degToRad(deg);
  return [
    Math.round(x * Math.cos(beta) - y * Math.sin(beta)),
    Math.round(x * Math.sin(beta) + y * Math.cos(beta)),
  ];
}

function move2({ wp: [wx, wy], x, y }: Ship2, { op, am }: Inst): Ship2 {
  let next: Ship2;

  switch (op) {
    case "N":
      next = { wp: [wx, wy + am], x, y };
      break;
    case "E":
      next = { wp: [wx + am, wy], x, y };
      break;
    case "S":
      next = { wp: [wx, wy - am], x, y };
      break;
    case "W":
      next = { wp: [wx - am, wy], x, y };
      break;
    case "R":
      next = { wp: rotate(wx, wy, -am), x, y };
      break;
    case "L":
      next = { wp: rotate(wx, wy, am), x, y };
      break;
    case "F":
      next = {
        wp: [wx, wy],
        x: x + am * wx,
        y: y + am * wy,
      };
  }

  return next;
}

function manhatten(x: number, y: number): number {
  return Math.abs(x) + Math.abs(y);
}

function part1(input: Inst[]): number {
  const shipStart: Ship = { facing: 0, x: 0, y: 0 };
  const { x, y } = input.reduce(move1, shipStart);
  return manhatten(x, y);
}

function part2(input: Inst[]): number {
  const shipStart: Ship2 = { wp: [10, 1], x: 0, y: 0 };
  const { x, y } = input.reduce(move2, shipStart);
  return manhatten(x, y);
}

function parseInput(input: string): Inst[] {
  return lines(input).map(
    (l) =>
      ({
        op: l.substr(0, 1),
        am: parseInt(l.substr(1)),
      } as Inst)
  );
}

async function day12(input: string): Promise<void> {
  const instructions = parseInput(input);

  console.log(`Part1: ${part1(instructions)}`);
  console.log(`Part2: ${part2(instructions)}`);
}

export default day12;
