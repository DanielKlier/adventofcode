// Solution for 2021, day 10
import { lines } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Debug);

interface PuzzleInput {
  template: string;
  rules: Map<string, string>;
}

function parseInput(input: string): PuzzleInput {
  const [template, rulesString] = input.split("\n\n");
  const rules = new Map<string, string>();
  lines(rulesString)
    .map((line) => line.split(" -> "))
    .forEach(([pair, insertion]) => rules.set(pair, insertion));
  return {
    template,
    rules,
  };
}

function solve({ template, rules }: PuzzleInput, steps: number): number {
  let counts: Record<string, number> = {};
  const elementCounts: Record<string, number> = { [template[0]]: 1 };
  for (let i = 0, j = 1; j < template.length; i++, j++) {
    const pair = template[i] + template[j];
    counts[pair] = (counts[pair] ?? 0) + 1;
    elementCounts[template[j]] = (elementCounts[template[j]] ?? 0) + 1;
  }
  logger.debug(counts);
  logger.debug(elementCounts);

  for (let step = 0; step < steps; step++) {
    logger.debug("------------------------");
    logger.debug("Step", step);
    logger.debug("------------------------");
    const newCounts: Record<string, number> = {};
    for (const [pair, count] of Object.entries(counts)) {
      const inserting = rules.get(pair)!;
      const np1 = pair[0] + inserting;
      const np2 = inserting + pair[1];
      elementCounts[inserting] = (elementCounts[inserting] ?? 0) + count;
      newCounts[np1] = (newCounts[np1] ?? 0) + count;
      newCounts[np2] = (newCounts[np2] ?? 0) + count;
    }
    counts = newCounts;
    logger.debug(counts);
    logger.debug(elementCounts);
  }

  return (
    Math.max(...Object.values(elementCounts)) -
    Math.min(...Object.values(elementCounts))
  );
}

function part1(input: PuzzleInput): number {
  return solve(input, 10);
}

function part2(input: PuzzleInput): number {
  return solve(input, 40);
}

export default function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  const testInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

  // 2NC -> 2NB, 2BC
  // 1CN -> 1CC, 1CN
  // 1NB -> 1NC, 1CB
  // 1BC -> 1BB, 1BC
  // 1CH -> 1CB, 1BH
  // 1HB -> 1HC, 1CB
  // 2NB, 3BC, 1CC, 1CN, 1NC, 3CB, 1BB, 1BH, 1HC

  const parsedInput = parseInput(testInput);
  assertEquals(parsedInput.template, "NNCB");
  assertEquals(parsedInput.rules.get("CH"), "B");

  assertEquals(part1(parsedInput), 1588);
  assertEquals(part2(parsedInput), 2188189693529);

  logger.info("Tests OK");
}
