// Solution for 2021, day 10
import { lines } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Debug);

type PuzzleInput = string[][];

const pairs: Record<string, string> = {
  "{": "}",
  "[": "]",
  "(": ")",
  "<": ">",
};

const reversePairs = Object.entries(pairs).reduce(
  (pairs, [a, b]) => ({ ...pairs, [b]: a }),
  {} as typeof pairs
);

const syntaxErrorScoreTable: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const autocompleteScoreTable: Record<string, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

function parse(input: string): PuzzleInput {
  return lines(input).map((line) => line.split(""));
}

function top<T>(stack: T[]): T | undefined {
  return stack[stack.length - 1];
}

function syntaxErrorScore(line: string[]): string[] {
  const stack: string[] = [];

  for (const character of line) {
    logger.debug("Current character", character);
    logger.debug("Stack", stack);
    const lastChar = top(stack);
    if (lastChar && character === pairs[lastChar]) {
      stack.pop();
      logger.debug(`Matched '${lastChar}' and ${character}`);
    } else if (
      character in reversePairs &&
      reversePairs[character] !== lastChar
    ) {
      throw { found: character, expected: pairs[lastChar!] };
    } else {
      logger.debug(`Pushing ${character}`);
      stack.push(character);
    }
  }

  return stack;
}

function part1(input: PuzzleInput): number {
  let score = 0;
  for (const line of input) {
    try {
      syntaxErrorScore(line);
    } catch (e) {
      score += syntaxErrorScoreTable[e.found];
      logger.info(`Expected ${e.expected}, but found ${e.found} instead.`);
    }
  }
  return score;
}

function autocompleteScore(stack: string[]): number {
  let score = 0;
  while (stack.length) {
    const opener = stack.pop();
    const expect = pairs[opener!];
    score *= 5;
    score += autocompleteScoreTable[expect];
  }
  return score;
}

function part2(input: PuzzleInput): number {
  const scores: number[] = [];
  for (const line of input) {
    try {
      const stack = syntaxErrorScore(line);
      if (stack.length) {
        logger.debug("Incomplete line", line, stack);
        const score = autocompleteScore(stack);
        logger.debug("Score", score);
        scores.push(score);
      }
    } catch (e) {
      logger.info(`Expected ${e.expected}, but found ${e.found} instead.`);
    }
  }
  logger.debug("Sorting scores");
  scores.sort((a, b) => a - b);
  logger.debug(scores);
  return scores[Math.floor(scores.length / 2)];
}

export default function run(input: string) {
  test();

  const parsedInput = parse(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  const testInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

  assertEquals(part1(parse(testInput)), 26397);
  assertEquals(
    syntaxErrorScore("<{([{{}}[<[[[<>{}]]]>[]]".split("")).join(""),
    "<{(["
  );
  assertEquals(autocompleteScore("<{([".split("")), 294);
  assertEquals(part2(parse(testInput)), 288957);

  logger.info("Tests OK");
}
