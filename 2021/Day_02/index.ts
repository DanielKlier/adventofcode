// Solution for 2021, day 02
import { lines } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

enum Command {
  forward = "forward",
  down = "down",
  up = "up",
}

interface CourseChange {
  command: Command;
  x: number;
}

function parseLine(line: string): CourseChange {
  const [commandStr, amountStr] = line.split(" ");
  return {
    x: parseInt(amountStr, 10),
    command: commandStr as Command,
  };
}

function part1(input: string[]): number {
  const pos = input.map(parseLine).reduce(
    (pos, { x, command }) => {
      switch (command) {
        case Command.down:
          return { ...pos, depth: pos.depth + x };
        case Command.up:
          return { ...pos, depth: pos.depth - x };
        case Command.forward:
          return { ...pos, x: pos.x + x };
      }
    },
    { x: 0, depth: 0 }
  );
  return pos.depth * pos.x;
}

function part2(input: string[]): number {
  const pos = input.map(parseLine).reduce(
    (pos, { x, command }) => {
      switch (command) {
        case Command.down:
          return { ...pos, aim: pos.aim + x };
        case Command.up:
          return { ...pos, aim: pos.aim - x };
        case Command.forward:
          return { ...pos, x: pos.x + x, depth: pos.depth + pos.aim * x };
      }
    },
    { x: 0, depth: 0, aim: 0 }
  );
  return pos.depth * pos.x;
}

async function day02(input: string): Promise<void> {
  testPart1();
  testPart2();

  const inputLines = lines(input);

  console.log(`Part1: ${part1(inputLines)}`);
  console.log(`Part2: ${part2(inputLines)}`);
}

export default day02;

const testInput = [
  "forward 5",
  "down 5",
  "forward 8",
  "up 3",
  "down 8",
  "forward 2",
];

function testPart1() {
  assertEquals(part1(testInput), 150);
}

function testPart2() {
  assertEquals(part2(testInput), 900);
}
