// Solution for 2020, day 19
import { lines } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

type Rules = Record<string | symbol | number, string>;
type Messages = string[];

function parseInput(input: string): [Rules, Messages] {
  const [rulePart, msgPart] = input.split("\n\n");
  return [
    lines(rulePart)
      .map((l) => l.split(": "))
      .reduce((o, [label, rule]) => ({ ...o, [label]: rule }), {} as Rules),
    lines(msgPart),
  ];
}

class Parser {
  private symbols: string[] = [];
  private sym?: string;
  private backtrackBuffer: string[] = [];

  constructor(private rules: Rules, private debug: boolean = false) {}

  parse(chars: string) {
    this.log("Begin parse");
    this.symbols = chars.split("");
    this.backtrackBuffer = [];
    this.nextSym();
    this.nonTerminal("0");
    this.log("End parse");
    if (this.symbols.length) {
      this.log("Excess symbols");
      this.error();
    }
  }

  private log(...args: any[]) {
    this.debug && console.log(args);
  }

  private terminal(sym: string) {
    if (sym === this.sym) {
      this.log("Term", sym);
      this.nextSym();
      this.backtrackBuffer = [];
    } else {
      this.error();
    }
  }

  private sequence(seq: string[]) {
    for (const r of seq) {
      this.nonTerminal(r);
    }
  }

  private nonTerminal(label: string) {
    const rule = this.rules[label];
    const termMatches = rule.match(/\"(.)\"/);
    if (termMatches) {
      this.terminal(termMatches[1]);
    } else {
      const [l, r] = rule.split(" | ");
      try {
        this.log("Seq", l);
        this.sequence(l.split(" "));
      } catch {
        if (r) {
          this.log("Alt Seq", r);
          this.symbols.unshift.apply(this.symbols, this.backtrackBuffer);
          this.log("Backtracking with", this.backtrackBuffer);
          this.backtrackBuffer = [];
          this.sequence(r.split(" "));
        } else {
          this.error();
        }
      }
    }
  }

  private nextSym() {
    this.sym = this.symbols.shift();
    if (this.sym) {
      this.backtrackBuffer.push(this.sym);
    }
  }

  private error() {
    this.log("Parse error", this.sym);
    throw new Error("Parse error: " + this.sym);
  }
}

const validator = (rules: Rules) => {
  const parser = new Parser(rules, true);
  return (message: string): boolean => {
    try {
      parser.parse(message);
      return true;
    } catch {
      return false;
    }
  };
};

function part1([rules, messages]: [Rules, Messages]): number {
  const validate = validator(rules);
  return messages.slice(0, 1).filter(validate).length;
}

function part2([rules, messages]: [Rules, Messages]): number {
  return 0;
}

async function day19(input: string): Promise<void> {
  //testPart1();

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
