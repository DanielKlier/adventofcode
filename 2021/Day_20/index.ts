// Solution for 2021, day 10
import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { matrix } from "../../utils/array.ts";
import { lines, parse } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";

const logger = new Logger(Logger.Level.Info);

interface Pixel {
  lit: boolean;
  row: number;
  col: number;
}

interface PuzzleInput {
  enhancementMap: boolean[];
  pixels: Map<string, Pixel>;
}

function parseInput(input: string): PuzzleInput {
  const [mapStr, imageStr] = input.split("\n\n");
  const pixels = new Map<string, Pixel>();
  lines(imageStr).forEach((line, row) =>
    line.split("").forEach((c, col) => {
      pixels.set(`${row}#${col}`, { lit: c === "#", row, col });
    })
  );
  return {
    enhancementMap: mapStr.split("").map((c) => c === "#"),
    pixels,
  };
}

function enhance(image: PuzzleInput): PuzzleInput {
  const output = new Map<string, Pixel>();
  for (const pixel of image.pixels.values()) {
    const binarySequence = [
      [-1, -1],
      [-1, 0],
      [-1, +1],
      [0, -1],
      [0, 0],
      [0, +1],
      [+1, -1],
      [+1, 0],
      [+1, +1],
    ]
      .map(([dy, dx]) => {
        const pxLookup = `${pixel.row + dy}#${pixel.col + dx}`;
        const px = image.pixels.get(pxLookup);
        return px?.lit ? "1" : "0";
      })
      .join("");
    const index = parse.binary(binarySequence);
    output.set(`${pixel.row}#${pixel.col}`, {
      ...pixel,
      lit: image.enhancementMap[index],
    });
  }

  return {
    enhancementMap: image.enhancementMap,
    pixels: output,
  };
}

function printPixels(pixels: Iterable<Pixel>) {
  let minX = Infinity,
    maxX = 0,
    minY = Infinity,
    maxY = 0;
  for (const pixel of pixels) {
    minX = Math.min(pixel.col, minX);
    minY = Math.min(pixel.row, minY);
    maxX = Math.max(pixel.col, maxX);
    maxY = Math.max(pixel.row, maxY);
  }
  const image = matrix(maxY - minY, maxX - minX, false);
  for (const pixel of pixels) {
    image[pixel.row - minY][pixel.col - minX] = pixel.lit;
  }
  image.forEach((row) => {
    logger.info(row.map((b) => (b ? "#" : ".")).join(""));
  });
}

function part1(input: PuzzleInput): number {
  logger.info("-------- Before ---------");
  printPixels(input.pixels.values());
  logger.info("-------- Enhance! ---------");
  input = enhance(input);
  printPixels(input.pixels.values());
  logger.info("-------- Enhance! ---------");
  input = enhance(input);
  printPixels(input.pixels.values());
  let numLit = 0;
  for (const pixel of input.pixels.values()) {
    if (pixel.lit) numLit += 1;
  }
  return numLit;
}

function part2(input: PuzzleInput): number {
  return 0;
}

export default function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  const testInput = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;

  assertEquals(part1(parseInput(testInput)), 35);
  //assertEquals(part2(parseInput(testInput)), Infinity);

  logger.info("Tests OK");
}
