// Solution for 2021, day 10
import { lines } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";
import { assertEquals } from "../../utils/test.ts";

const logger = new Logger(Logger.Level.Debug);

type AdjacencyMatrix = number[][];
type NodeList = string[];
interface PuzzleInput {
  adjMatrix: AdjacencyMatrix;
  nodeList: NodeList;
}

function isLower(str: string): boolean {
  return str === str.toLowerCase();
}

function parse(input: string): PuzzleInput {
  const nodeList: string[] = [];
  const edgeList: [number, number][] = [];

  for (const line of lines(input)) {
    const [left, right] = line.split("-");
    if (!nodeList.includes(left)) {
      nodeList.push(left);
    }
    if (!nodeList.includes(right)) {
      nodeList.push(right);
    }
    const leftIndex = nodeList.indexOf(left);
    const rightIndex = nodeList.indexOf(right);
    edgeList.push([leftIndex, rightIndex]);
  }

  const adjMatrix: AdjacencyMatrix = new Array(nodeList.length);
  for (let i = 0; i < nodeList.length; i++) {
    adjMatrix[i] = new Array(nodeList.length).fill(0);
  }

  for (const [i, j] of edgeList) {
    adjMatrix[i][j] = 1;
    adjMatrix[j][i] = 1;
  }

  return {
    adjMatrix,
    nodeList,
  };
}

function printAdjMatrix(input: PuzzleInput) {
  logger.info(
    "       " + input.nodeList.map((n) => n.padStart(5, " ")).join(" ")
  );
  input.adjMatrix.forEach((edges, idx) => {
    let str = input.nodeList[idx].padStart(5, " ") + " ";
    str += " " + edges.map((e) => ("" + e).padStart(5, " ")).join(" ");
    logger.info(str);
  });
}

function adjacentVertices(graph: AdjacencyMatrix, start: number): number[] {
  return graph[start]
    .map((e, i) => [e, i])
    .filter(([e]) => !!e)
    .map(([, i]) => i);
}

function path(
  graph: PuzzleInput,
  v: number,
  currPath: number[] = [],
  visited: Record<number, number>,
  paths: number[][] = [],
  canVisit: (
    visited: Record<number, number>,
    graph: PuzzleInput,
    v: number
  ) => boolean
) {
  if (v === graph.nodeList.indexOf("end")) {
    paths.push(currPath);
    return;
  }

  for (const n of adjacentVertices(graph.adjMatrix, v)) {
    const isSmallCave = isLower(graph.nodeList[n]);
    if (canVisit(visited, graph, n)) {
      const newVisited = isSmallCave
        ? { ...visited, [n]: (visited[n] ?? 0) + 1 }
        : visited;
      path(graph, n, [...currPath, n], newVisited, paths, canVisit);
    }
  }
}

function part1(graph: PuzzleInput): number {
  const paths: number[][] = [];
  const start = graph.nodeList.indexOf("start");
  path(
    graph,
    start,
    [start],
    { [start]: 1 },
    paths,
    (visited, _, v) => !visited[v]
  );
  return paths.length;
}

function part2(graph: PuzzleInput): number {
  const paths: number[][] = [];
  const start = graph.nodeList.indexOf("start");
  path(
    graph,
    start,
    [start],
    { [start]: 1 },
    paths,
    (visited, _, v) =>
      graph.nodeList[v] !== "start" &&
      (!visited[v] || !Object.values(visited).find((x) => x > 1))
  );
  return paths.length;
}

export default function run(input: string) {
  test();

  const parsedInput = parse(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  const testInput = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;
  const testInput2 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;
  printAdjMatrix(parse(testInput));
  //assertEquals(part1(parse(testInput)), 10);
  assertEquals(part1(parse(testInput2)), 226);
  assertEquals(part2(parse(testInput)), 36);

  logger.info("Tests OK");
}
