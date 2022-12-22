// Solution for 2022, day 21
import { lines, parse } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

type Op = '+' | '-' | '*' | '/';

interface BinOp {
  operator: Op;
  leftId: string;
  rightId: string;
}

interface NumNode {
  label: string;
  val: number;
}

interface BinOpNode {
  label: string;
  operator: Op;
  left: ExpTree;
  right: ExpTree;
}

type PuzzleInput = BinOpNode;
type ExpTree = NumNode | BinOpNode;

function parseAsBinOp(line: string): RegExpExecArray | null {
  const exprRegex = /^([a-z]+): ([a-z]+) ([+\-*/]) ([a-z]+)$/;
  return exprRegex.exec(line);
}

function parseAsNumber(line: string): RegExpExecArray | null {
  const numberRegex = /^([a-z]+): (\d+)$/;
  return numberRegex.exec(line);
}

function parseInput(input: string): PuzzleInput {
  const expressions = new Map<string, BinOp>();
  const numbers = new Map<string, number>();

  lines(input).forEach(line => {
    let matches = parseAsBinOp(line);
    if (matches) {
      const [, label, left, op, right] = matches;
      expressions.set(label, {operator: op as Op, leftId: left, rightId: right});
      return;
    }
    matches = parseAsNumber(line);
    if (matches) {
      const [, label, num] = matches;
      numbers.set(label, parse.int(num));
    }
  });

  return recursiveGenTree('root') as BinOpNode;

  function recursiveGenTree(label: string): ExpTree {
    if (numbers.has(label)) {
      return {val: numbers.get(label)!, label};
    }
    const {operator, leftId, rightId} = expressions.get(label)!;
    const left = recursiveGenTree(leftId);
    const right = recursiveGenTree(rightId);
    return {
      label,
      operator,
      left,
      right
    };
  }
}

function isNumNode(tree: ExpTree): tree is NumNode {
  return 'val' in tree;
}

function evaluate(tree: ExpTree): number {
  if (isNumNode(tree)) {
    return tree.val;
  }
  const leftResult = evaluate(tree.left);
  const rightResult = evaluate(tree.right);
  return eval(`${leftResult}
  ${tree.operator}
  ${rightResult}`);
}

function part1(input: PuzzleInput): number {
  return evaluate(input);
}

function findLabel(tree: ExpTree, label: string): ExpTree | null {
  if (tree.label === label) return tree;
  if (isNumNode(tree)) return tree.label === label ? tree : null;
  const leftHasLabel = findLabel(tree.left, label);
  const rightHasLabel = findLabel(tree.right, label);
  return leftHasLabel || rightHasLabel;
}

function part2(root: PuzzleInput): number {
  const opposites: Record<Op, Op> = {
    '*': '/',
    '/': '*',
    '+': '-',
    '-': '+'
  };

  const [humnSide, otherSide] = getHumnSide(root);
  const dummyMinusOne = {val: -1, label: 'dummy'};
  // We then isolate the humn node by reorganizing the tree until the left side has only one node (the humn node)
  while (root[humnSide].label !== 'humn') {
    // Take the side that does not have the humn node and put it on the other side, with the opposite operator
    const node = root[humnSide] as BinOpNode;
    const [humn, other] = getHumnSide(node as BinOpNode);
    const tmp = root[otherSide];
    const toMove = node[other];
    let opposite = opposites[node.operator];
    if (other === 'left' && node.operator === '-') {
      opposite = '-';
    }
    root[otherSide] = {operator: opposite, left: tmp, right: toMove, label: toMove.label + '\''};
    // If we move the left side and the operator is minus, we will have to invert the sign
    if (node.operator === '-' && other === 'left') {
      const tmp2 = root[otherSide];
      root[otherSide] = {operator: '*', left: dummyMinusOne, right: tmp2, label: 'invertSign'};
    }/* else if (node.operator === '/' && other === 'left') {
      const tmp2 = root[otherSide];
      root[otherSide] = {operator: '/', left: {val: 1, label: 'one'}, right: tmp2, label: '1div'};
    }*/
    root[humnSide] = node[humn];
  }

  return evaluate(root[otherSide]);

  function getHumnSide(tree: BinOpNode): ['left' | 'right', 'left' | 'right'] {
    if (findLabel(tree.left, 'humn')) return ['left', 'right'];
    else return ['right', 'left'];
  }
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 152);

  logger.info('Tests for Part 1 OK');
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 301);

  logger.info('Tests for Part 2 OK');
}
