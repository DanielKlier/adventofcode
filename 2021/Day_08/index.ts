// Solution for 2021, day 08
import { lines } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Debug);

const LENGTH_DIGIT_MAPPING: Record<string, number[]> = {
  2: [1],
  3: [7],
  4: [4],
  5: [2, 3, 5],
  6: [0, 6, 9],
  7: [8],
};

interface PuzzleInputLine {
  signalPatterns: string[];
  outputValues: string[];
}

function parse(input: string): PuzzleInputLine[] {
  return lines(input).map((line) => {
    const [signalPatterns, outputValues] = line.split(" | ");
    return {
      signalPatterns: signalPatterns.split(" "),
      outputValues: outputValues.split(" "),
    };
  });
}

function uniquePatterns(patterns: string[]): string[] {
  return patterns.filter((v) => LENGTH_DIGIT_MAPPING[v.length].length === 1);
}

function part1(input: PuzzleInputLine[]): number {
  return input.reduce(
    (sum, line) => sum + uniquePatterns(line.outputValues).length,
    0
  );
}

function arr(s: string) {
  return s.split("");
}

function sortAlphabetically(s: string): string {
  const a = s.slice().split("");
  a.sort();
  return a.join("");
}

function findNumbers(signals: string[]): string[] {
  logger.debug(signals);
  const n1 = signals.find((s) => s.length === 2)!;
  const n4 = signals.find((s) => s.length === 4)!;
  const n7 = signals.find((s) => s.length === 3)!;
  const n8 = signals.find((s) => s.length === 7)!;
  const n9 = signals.find(
    (s) => s.length === 6 && arr(n4).every((c) => arr(s).includes(c))
  )!;
  const n6 = signals.find(
    (s) => s.length === 6 && !arr(n1).every((c) => arr(s).includes(c))
  )!;
  const n0 = signals.find((s) => s.length === 6 && s !== n9 && s !== n6)!;
  const n3 = signals.find(
    (s) => s.length === 5 && arr(n1).every((c) => arr(s).includes(c))
  )!;
  const n5 = signals.find(
    (s) =>
      s.length === 5 && s !== n3 && arr(s).every((c) => arr(n9).includes(c))
  )!;
  const n2 = signals.find((s) => s.length === 5 && s !== n3 && s !== n5)!;

  return [n0, n1, n2, n3, n4, n5, n6, n7, n8, n9].map((a) =>
    sortAlphabetically(a)
  );
}

function solveEntry(entry: PuzzleInputLine) {
  const numbers = findNumbers(entry.signalPatterns);
  logger.debug(numbers);
  logger.debug(entry.outputValues);
  return parseInt(
    entry.outputValues
      .map(sortAlphabetically)
      .reduce((s, v) => s + numbers.indexOf(v), ""),
    10
  );
}

function part2(input: PuzzleInputLine[]): number {
  return input.reduce((sum, entry) => sum + solveEntry(entry), 0);
}

export default function run(input: string) {
  test();

  const parsedInput = parse(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  const testInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

  assertEquals(part1(parse(testInput)), 26);
  assertEquals(
    solveEntry({
      signalPatterns:
        "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab".split(" "),
      outputValues: "cdfeb fcadb cdfeb cdbaf".split(" "),
    }),
    5353
  );
  assertEquals(part2(parse(testInput)), 61229);
  logger.info("Tests OK");
}
