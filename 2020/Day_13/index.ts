// Solution for 2020, day 13
import { lines, parse } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

type Input = [number, number[]];

function parseInput(input: string): Input {
  const [earliest, ids] = lines(input);
  return [
    parse.int(earliest),
    ids.split(",").map((l) => (l === "x" ? 0 : parse.int(l))),
  ];
}

function nextDeparture(start: number, busId: number): number {
  return start - (start % busId) + busId;
}

function part1([start, busIds]: Input): number {
  const busesByDeparture = busIds.filter(x => x > 0).slice();
  busesByDeparture.sort(
    (a, b) => nextDeparture(start, a) - nextDeparture(start, b)
  );
  const result =
    busesByDeparture[0] * (nextDeparture(start, busesByDeparture[0]) - start);
  return result;
}

function* steps(size: number, start: number) {
  let i = 0;
  while(true) yield start + size  * ++i;
}

function part2([, busIds]: Input): number {
  const [first, ...buses] = busIds.map((b, i) => [b, i]).filter(([b]) => b >0);
  let multiplier = first[0];
  let last = 0;
  buses.forEach(([bus, index]) => {
    for (let step of steps(multiplier, last)) {
      if ((step + index) % bus === 0) {
        last = step;
        multiplier *= bus;
        break;
      }
    }
  });
  return last;
}

async function day13(input: string): Promise<void> {
  testPart1();
  testPart2();

  const lineInput = parseInput(input);

  console.log(`Part1: ${part1(lineInput)}`);
  console.log(`Part2: ${part2(lineInput)}`);
}

export default day13;

const testInput = parseInput(`939
7,13,x,x,59,x,31,19`);

function testPart1() {
  assertEquals(part1(testInput), 295);
}

function testPart2() {
  assertEquals(part2([1, [7, 13]]), 77);
  assertEquals(part2(testInput), 1068781);
}
