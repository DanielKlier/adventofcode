// Solution for 2021, day 10
import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parse } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";

const logger = new Logger(Logger.Level.Info);

class Rectangle {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;

  constructor(left: number, top: number, right: number, bottom: number) {
    this.left = Math.min(left, right);
    this.right = Math.max(left, right);
    this.bottom = Math.min(top, bottom);
    this.top = Math.max(top, bottom);
  }

  get width() {
    return Math.abs(this.right - this.left);
  }

  get height() {
    return Math.abs(this.bottom - this.top);
  }

  contains([x, y]: Vec2): boolean {
    return (
      x >= this.left && x <= this.right && y >= this.bottom && y <= this.top
    );
  }
}

type Vec2 = [number, number];

function add(...vecs: Vec2[]): Vec2 {
  return vecs.reduce((v, a) => [v[0] + a[0], v[1] + a[1]], [0, 0]);
}

interface State {
  pos: Vec2;
  vel: Vec2;
}

function step(state: State): State {
  return {
    pos: add(state.pos, state.vel),
    vel: [Math.max(0, state.vel[0] - 1), state.vel[1] - 1],
  };
}

function simulate(
  initialState: State,
  targetArea: Rectangle
): [boolean, number] {
  let state = initialState;
  let maxHeight = initialState.pos[1];
  let inTargetArea = false;

  while (!inTargetArea && state.pos[1] >= targetArea.bottom) {
    inTargetArea = targetArea.contains(state.pos);
    maxHeight = Math.max(maxHeight, state.pos[1]);
    state = step(state);
  }

  return [inTargetArea, maxHeight];
}

function parseInput(input: string): Rectangle {
  const [x, y] = input.slice(13).split(", ");
  const [left, right] = x.slice(2).split("..").map(parse.int);
  const [top, bottom] = y.slice(2).split("..").map(parse.int);
  return new Rectangle(left, top, right, bottom);
}

function part1(targetArea: Rectangle): number {
  const minVelX = Math.ceil((Math.sqrt(1 + 8 * targetArea.left) - 1) * 0.5);
  let minVelY = 0;

  // Find minimum Y velocity
  while (true) {
    const [inTarget] = simulate(
      { pos: [0, 0], vel: [minVelX, minVelY] },
      targetArea
    );
    if (inTarget) {
      break;
    }
    minVelY += 1;
  }

  let maxVelY = minVelY;
  //let vel = maxVelY - minVelY;
  let maxHeight = 0;
  while (maxVelY < 500) {
    const [inTarget, height] = simulate(
      { pos: [0, 0], vel: [minVelX, maxVelY] },
      targetArea
    );
    if (inTarget) {
      maxHeight = height;
    }
    maxVelY += 1;
  }
  return maxHeight;
}

function part2(targetArea: Rectangle): number {
  const minVelX = Math.ceil((Math.sqrt(1 + 8 * targetArea.left) - 1) * 0.5);
  const velocities: Vec2[] = [];
  for (let xVel = minVelX; xVel <= targetArea.right; xVel++) {
    for (let yVel = -500; yVel < 500; yVel++) {
      const [inTarget] = simulate(
        { pos: [0, 0], vel: [xVel, yVel] },
        targetArea
      );
      if (inTarget) {
        velocities.push([xVel, yVel]);
      }
    }
  }
  return velocities.length;
}

export default function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}
const arsch = [
  [23, -10],
  [25, -9],
  [27, -5],
  [29, -6],
  [22, -6],
  [21, -7],
  [9, 0],
  [27, -7],
  [24, -5],
  [25, -7],
  [26, -6],
  [25, -5],
  [6, 8],
  [11, -2],
  [20, -5],
  [29, -10],
  [6, 3],
  [28, -7],
  [8, 0],
  [30, -6],
  [29, -8],
  [20, -10],
  [6, 7],
  [6, 4],
  [6, 1],
  [14, -4],
  [21, -6],
  [26, -10],
  [7, -1],
  [7, 7],
  [8, -1],
  [21, -9],
  [6, 2],
  [20, -7],
  [30, -10],
  [14, -3],
  [20, -8],
  [13, -2],
  [7, 3],
  [28, -8],
  [29, -9],
  [15, -3],
  [22, -5],
  [26, -8],
  [25, -8],
  [25, -6],
  [15, -4],
  [9, -2],
  [15, -2],
  [12, -2],
  [28, -9],
  [12, -3],
  [24, -6],
  [23, -7],
  [25, -10],
  [7, 8],
  [11, -3],
  [26, -7],
  [7, 1],
  [23, -9],
  [6, 0],
  [22, -10],
  [27, -6],
  [8, 1],
  [22, -8],
  [13, -4],
  [7, 6],
  [28, -6],
  [11, -4],
  [12, -4],
  [26, -9],
  [7, 4],
  [24, -10],
  [23, -8],
  [30, -8],
  [7, 0],
  [9, -1],
  [10, -1],
  [26, -5],
  [22, -9],
  [6, 5],
  [7, 5],
  [23, -6],
  [28, -10],
  [10, -2],
  [11, -1],
  [20, -9],
  [14, -2],
  [29, -7],
  [13, -3],
  [23, -5],
  [24, -8],
  [27, -9],
  [30, -7],
  [28, -5],
  [21, -10],
  [7, 9],
  [6, 6],
  [21, -5],
  [27, -10],
  [7, 2],
  [30, -9],
  [21, -8],
  [22, -7],
  [24, -9],
  [20, -6],
  [6, 9],
  [29, -5],
  [8, -2],
  [27, -8],
  [30, -5],
  [24, -7],
];

arsch.sort((a, b) => {
  if (a[0] === b[0]) return a[1] - b[1];
  return a[0] - b[0];
});

function test() {
  const testInput = `target area: x=20..30, y=-10..-5`;
  const rect = parseInput(testInput);
  assertEquals(rect.top, -5);
  assertEquals(rect.bottom, -10);
  assertEquals(rect.left, 20);
  assertEquals(rect.right, 30);
  assertEquals(rect.width, 10);
  assertEquals(rect.height, 5);

  assertEquals(part1(parseInput(testInput)), 45);
  logger.info(simulate({ pos: [0, 0], vel: [9, 0] }, parseInput(testInput)));
  assertEquals(part2(parseInput(testInput)), 112);

  logger.info("Tests OK");
}
