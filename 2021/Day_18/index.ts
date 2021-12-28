// Solution for 2021, day 10
import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { lines } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";

const logger = new Logger(Logger.Level.Debug);

type SnailfishNumber = [number | SnailfishNumber, number | SnailfishNumber];

class SnailfishTree {
  constructor(
    public left: SnailfishTree | null = null,
    public right: SnailfishTree | null = null,
    public value: number | null = null,
    public parent?: SnailfishTree
  ) {}

  get isLeaf() {
    return typeof this.value === "number";
  }

  get isPair() {
    return !this.isLeaf;
  }

  toValueNode(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  explode(): boolean {
    let depth = 0;
    let explodingNode: SnailfishTree | null;
    const path: SnailfishTree[] = [];

    function traverse(root: SnailfishTree | null) {
      if (root) {
        ++depth;
        traverse(root.left);
        traverse(root.right);
        if (root.isLeaf) path.push(root);
        if (depth === 5 && root.isPair && !explodingNode) {
          explodingNode = root;
        }
        --depth;
      }
    }

    traverse(this);

    if (explodingNode!) {
      const leftIndex = path.indexOf(explodingNode.left!);
      const rightIndex = leftIndex + 1;
      if (leftIndex - 1 >= 0) {
        const leftNode = path[leftIndex - 1];
        if (leftNode.isLeaf) leftNode.value! += explodingNode!.left!.value!;
      }
      if (rightIndex + 1 < path.length) {
        const rightNode = path[rightIndex + 1];
        if (rightNode.isLeaf) rightNode.value! += explodingNode!.right!.value!;
      }
      explodingNode.toValueNode(0);
    }
    return !!explodingNode!;
  }

  split(): boolean {
    let isDone = false;

    function split(tree: SnailfishTree | null) {
      if (!tree || isDone) return;
      split(tree.left);
      split(tree.right);
      if (tree.isLeaf && tree.value! >= 10) {
        const value = tree.value!;
        tree.value = null;
        tree.left = new SnailfishTree(null, null, Math.floor(value / 2), tree);
        tree.right = new SnailfishTree(null, null, Math.ceil(value / 2), tree);
        isDone = true;
      }
    }

    split(this);

    return isDone;
  }

  magnitude(): number {
    if (this.isLeaf) return this.value!;
    return 3 * this.left!.magnitude() + 2 * this.right!.magnitude();
  }
}

type PuzzleInput = SnailfishTree[];

function toSnailfishNumber(tree: SnailfishTree): SnailfishNumber {
  function traverse(tree: SnailfishTree): SnailfishNumber | number {
    if (tree.isLeaf) return tree.value!;
    return [traverse(tree.left!), traverse(tree.right!)];
  }

  return [traverse(tree.left!), traverse(tree.right!)];
}

function reduce(tree: SnailfishTree) {
  while (true) {
    if (!tree.explode()) {
      if (!tree.split()) {
        break;
      }
    }
  }
}

function parseNumber(
  n: SnailfishNumber,
  parent?: SnailfishTree
): SnailfishTree {
  const [l, r] = n;
  const tree = new SnailfishTree();
  tree.parent = parent;
  if (typeof l === "number") {
    tree.left = new SnailfishTree(null, null, l, tree);
  } else {
    tree.left = parseNumber(l, tree);
  }
  if (typeof r === "number") {
    tree.right = new SnailfishTree(null, null, r, tree);
  } else {
    tree.right = parseNumber(r, tree);
  }
  return tree;
}

function parseLine(line: string): SnailfishTree {
  logger.debug(line);
  const arr = JSON.parse(line);
  return parseNumber(arr);
}

function parseInput(input: string): PuzzleInput {
  return lines(input).map(parseLine);
}

function add(a: SnailfishTree, b: SnailfishTree): SnailfishTree {
  return new SnailfishTree(a, b);
}

function part1(input: PuzzleInput): number {
  const [first, ...rest] = input;
  return rest
    .reduce((result, tree) => {
      result = add(result, tree);
      reduce(result);
      return result;
    }, first)
    .magnitude();
}

function part2(input: string): number {
  let maxPairSum = 0;
  const inputs = lines(input);
  for (let i = 0; i < inputs.length - 1; i++) {
    for (let j = i + 1; j < inputs.length; j++) {
      let first = parseLine(inputs[i]);
      let second = parseLine(inputs[j]);
      let sum = add(first, second);
      reduce(sum);
      maxPairSum = Math.max(sum.magnitude(), maxPairSum);

      first = parseLine(inputs[j]);
      second = parseLine(inputs[i]);
      sum = add(first, second);
      reduce(sum);
      maxPairSum = Math.max(sum.magnitude(), maxPairSum);
    }
  }
  return maxPairSum;
}

export default function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(input)}`);
}

function test() {
  let tree = parseNumber([[[[[9, 8], 1], 2], 3], 4]);
  tree.explode();
  assertEquals(toSnailfishNumber(tree), [[[[0, 9], 2], 3], 4]);

  tree = parseNumber([7, [6, [5, [4, [3, 2]]]]]);
  tree.explode();
  assertEquals(toSnailfishNumber(tree), [7, [6, [5, [7, 0]]]]);

  tree = parseNumber([[6, [5, [4, [3, 2]]]], 1]);
  tree.explode();
  assertEquals(toSnailfishNumber(tree), [[6, [5, [7, 0]]], 3]);

  tree = parseNumber([
    [3, [2, [1, [7, 3]]]],
    [6, [5, [4, [3, 2]]]],
  ]);
  tree.explode();
  assertEquals(toSnailfishNumber(tree), [
    [3, [2, [8, 0]]],
    [9, [5, [4, [3, 2]]]],
  ]);

  tree = parseNumber([
    [3, [2, [8, 0]]],
    [9, [5, [4, [3, 2]]]],
  ]);
  tree.explode();
  assertEquals(toSnailfishNumber(tree), [
    [3, [2, [8, 0]]],
    [9, [5, [7, 0]]],
  ]);

  const testInput = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

  assertEquals(part1(parseInput(testInput)), 4140);
  assertEquals(part2(testInput), 3993);

  logger.info("Tests OK");
}
