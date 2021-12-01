// Solution for 2020, day 19
import { lines, parse } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

type Rules = Record<number, number[][] | string>;
type Messages = string[];

function parseInput(input: string): [Rules, Messages] {
  const [rulePart, msgPart] = input.split("\n\n");
  return [
    lines(rulePart)
      .map((l) => l.split(": "))
      .map(([index, rule]) => [
        index,
        rule.startsWith('"')
          ? rule.substr(1, 1)
          : rule
              .split(" | ")
              .filter((a) => a)
              .map((sr) => sr.split(" "))
              .map((s) => s.map(parse.int)),
      ])
      .reduce(
        (o, [label, rule]) => ({ ...o, [label as string]: rule }),
        {} as Rules
      ),
    lines(msgPart),
  ];
}

const validator = (rules: Rules) => {
  const validate = ([c, ...rest]: string[], ruleStack: (string|number)[]): boolean => {
    if (!c && !ruleStack.length) return true;

    if ((!c && ruleStack.length) || (c && !ruleStack.length)) {
      return false;
    }

    const rule = ruleStack.shift();

    if (typeof rule === "string") {
      return rule === c && validate(rest, ruleStack.slice());
    }

    if (!rule) {
      return false;
    }

    for (const sr of rules[rule]) {
      if (validate([c, ...rest], [...sr, ...ruleStack])) {
        return true;
      }
    }

    return false;
  };

  return (message: string): boolean => {
    return validate(message.split(""), (rules[0] as (string|number)[][])[0].slice());
  };
};

function part1([rules, messages]: [Rules, Messages]): number {
  const validate = validator(rules);
  return messages.filter(validate).length;
}

function part2([rules, messages]: [Rules, Messages]): number {
  rules[8] = [[42], [42, 8]];
  rules[11] = [[42, 31], [42, 11, 31]];
  const validate = validator(rules);
  return messages.filter(validate).length;
}

async function day19(input: string): Promise<void> {
  testPart1();

  const parsed = parseInput(input);
  console.log(`Part1: ${part1(parsed)}`);
  console.log(`Part2: ${part2(parsed)}`);
}

export default day19;

function testPart1() {
  const inputStr = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;

  assertEquals(part1(parseInput(inputStr)), 2);
}
