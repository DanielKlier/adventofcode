// Solution for 2020, day 18
import { lines } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

const enum TokenType {
  NUM,
  OP,
  L_PAR,
  R_PAR,
}

interface OperatorToken {
  type: TokenType.OP;
  value: string;
}

interface NumberToken {
  type: TokenType.NUM;
  value: number;
}

interface ParenToken {
  type: TokenType.L_PAR | TokenType.R_PAR;
  value: string;
}

type Token = OperatorToken | NumberToken | ParenToken;

function* tokens(input: string): Iterable<Token> {
  let numBuffer: string[] = [];
  for (const char of input) {
    if (!isNaN(parseInt(char, 10))) {
      numBuffer.push(char);
      continue;
    }
    if (numBuffer.length) {
      yield { type: TokenType.NUM, value: parseInt(numBuffer.join(""), 10) };
      numBuffer = [];
    }
    if (char.match(/[+*]/)) {
      yield { type: TokenType.OP, value: char };
    } else if (char === "(") {
      yield { type: TokenType.L_PAR, value: "(" };
    } else if (char === ")") {
      yield { type: TokenType.R_PAR, value: ")" };
    }
  }
  if (numBuffer.length) {
    yield { type: TokenType.NUM, value: parseInt(numBuffer.join(""), 10) };
    numBuffer = [];
  }
}

function precedence1(op: string) {
  return 0;
}

function precedence2(op: string) {
  switch (op) {
    case "+":
      return 1;
    default:
      return 0;
  }
}

function calc(l: number, r: number, op: string): number {
  if (op === "*") return l * r;
  else return l + r;
}

const evaluate = (precedence: (op: string) => number) => (
  input: string
): number => {
  const ops: string[] = [];
  const values: number[] = [];
  for (const token of tokens(input)) {
    switch (token.type) {
      case TokenType.NUM:
        values.unshift(token.value);
        break;
      case TokenType.L_PAR:
        ops.unshift(token.value);
        break;
      case TokenType.R_PAR:
        while (ops[0] !== "(") {
          values.unshift(calc(values.shift()!, values.shift()!, ops.shift()!));
        }
        ops.shift();
        break;
      case TokenType.OP:
        while (
          ops.length > 0 &&
          ops[0] !== "(" &&
          precedence(ops[0]) >= precedence(token.value)
        ) {
          const l = values.shift();
          const r = values.shift();
          const op = ops.shift();
          if (!isNaN(l!) && !isNaN(r!) && op) {
            values.unshift(calc(l!, r!, op));
          }
        }
        ops.unshift(token.value);
        break;
    }
  }
  while (ops.length) {
    values.unshift(calc(values.shift()!, values.shift()!, ops.shift()!));
  }
  return values.shift()!;
};

function part1(input: string[]): number {
  return input.reduce((sum, line) => sum + evaluate(precedence1)(line), 0);
}

function part2(input: string[]): number {
  return input.reduce((sum, line) => sum + evaluate(precedence2)(line), 0);
}

async function day18(input: string): Promise<void> {
  testTokens();
  testEvaluate();
  const inputLines = lines(input);

  console.log(`Part1: ${part1(inputLines)}`);
  console.log(`Part2: ${part2(inputLines)}`);
}

export default day18;

function testTokens() {
  const tok = Array.from(tokens("13 + 1"));
  assertEquals(tok[0].type, TokenType.NUM);
  assertEquals(tok[0].value, 13);
  assertEquals(tok[1].type, TokenType.OP);
  assertEquals(tok[1].value, "+");
  assertEquals(tok[2].type, TokenType.NUM);
  assertEquals(tok[2].value, 1);
}

function testEvaluate() {
  const eval1 = evaluate(precedence1);
  assertEquals(eval1("12 + 1"), 13);
  assertEquals(eval1("12 * 10 + 5"), 125);
  assertEquals(eval1("2 * 3 + (4 * 5)"), 26);
  assertEquals(eval1("5 + (8 * 3 + 9 + 3 * 4 * 3)"), 437);
  assertEquals(eval1("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"), 12240);
}
