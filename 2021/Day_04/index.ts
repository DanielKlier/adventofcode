// Solution for 2021, day 04
import { matrix } from "../../utils/array.ts";
import { parse } from "../../utils/input.ts";
import { assertEquals } from "../../utils/test.ts";

const debug = false;

function log(...args: unknown[]) {
  debug && console.log(...args);
}

interface ParsedInput {
  numbers: number[];
  boards: number[][][];
}

function parseBoard(boardString: string): number[][] {
  return boardString.split("\n").map((line) =>
    line
      .split(" ")
      .filter((a) => a)
      .map(parse.int)
  );
}

function parseInput(input: string): ParsedInput {
  const [numberSequence, ...boardStrings] = input.split("\n\n");
  return {
    numbers: numberSequence.split(",").map(parse.int),
    boards: boardStrings.map(parseBoard),
  };
}

class Board {
  private readonly rows: boolean[][];
  private readonly columns: boolean[][];
  private readonly size: number;

  constructor(readonly index: number, readonly numbers: number[][]) {
    this.size = numbers.length;
    this.rows = matrix(this.size, this.size, false);
    this.columns = matrix(this.size, this.size, false);
  }

  mark(drawnNumber: number) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const num = this.numbers[row][col];
        if (num !== drawnNumber) continue;
        log("Marking", drawnNumber, "in", row, col);
        this.rows[row][col] = true;
        this.columns[col][row] = true;
      }
    }
  }

  isWinner(): boolean {
    return (
      this.rows.some((row) => row.every(Boolean)) ||
      this.columns.some((col) => col.every(Boolean))
    );
  }

  getSumOfAllUnmarkedNumbers(): number {
    let sum = 0;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (!this.rows[row][col]) sum += this.numbers[row][col];
      }
    }
    return sum;
  }
}

function part1(input: ParsedInput): number {
  const boards = input.boards.map((board, i) => new Board(i, board));

  for (const drawnNumber of input.numbers) {
    log(drawnNumber);
    for (const board of boards) {
      log("------------------------");
      log("Board");
      log("------------------------");
      board.mark(drawnNumber);
      if (!board.isWinner()) continue;
      // This board is the winner
      return board.getSumOfAllUnmarkedNumbers() * drawnNumber;
    }
  }

  return 0;
}

function part2(input: ParsedInput): number {
  const winningBoards: Board[] = [];
  let boards = input.boards.map((board, i) => new Board(i, board));
  let lastDrawNumber = -1;

  while (boards.length > 0 && input.numbers.length > 0) {
    const numBoardsLeft = boards.length;
    const drawnNumber = input.numbers.shift()!;
    log("------------------------");
    log("Drawn", drawnNumber);
    log(numBoardsLeft, "boards left.");
    for (const board of [...boards]) {
      log("------------------------");
      board.mark(drawnNumber);
      if (board.isWinner()) {
        log("Bingo! Board", board.index, "is a winner");
        boards = boards.filter((b) => b !== board);
        winningBoards.push(board);
      }
    }
    // If there was no winner, we don't store the last drawn number so we still get
    // the correct result even if the last board will never be completed.
    if (boards.length < numBoardsLeft) lastDrawNumber = drawnNumber;
    log("------------------------");
  }

  log(
    "Sum:" +
      winningBoards[winningBoards.length - 1].getSumOfAllUnmarkedNumbers(),
    "Last number:",
    lastDrawNumber
  );
  return (
    winningBoards[winningBoards.length - 1].getSumOfAllUnmarkedNumbers() *
    lastDrawNumber
  );
}

function day04(input: string) {
  testPart1();
  testPart2();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

export default day04;

const testInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

function testPart1() {
  const parsedInput = parseInput(testInput);
  assertEquals(parsedInput.numbers[0], 7);
  assertEquals(parsedInput.numbers[26], 1);
  assertEquals(parsedInput.boards[0][4][4], 19);
  assertEquals(parsedInput.boards[2][4][4], 7);

  assertEquals(part1(parsedInput), 4512);
}

function testPart2() {
  const parsedInput = parseInput(testInput);
  assertEquals(part2(parsedInput), 1924);
}
