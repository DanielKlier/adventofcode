// Solution for 2020, day 22
import { lines, parse } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

interface State {
  player1: number[];
  player2: number[];
  round: number;
  winner?: Player;
}

function getInitialState(input: string): State {
  const [p1, p2] = input.split("\n\n");
  return {
    player1: lines(p1).slice(1).map(parse.int),
    player2: lines(p2).slice(1).map(parse.int),
    round: 0,
  };
}

function play1(state: State): State {
  const [p1, ...p1Deck] = state.player1;
  const [p2, ...p2Deck] = state.player2;
  if (p1 > p2) {
    return {
      player1: [...p1Deck, p1, p2],
      player2: [...p2Deck],
      round: state.round + 1,
    };
  } else {
    return {
      player1: [...p1Deck],
      player2: [...p2Deck, p2, p1],
      round: state.round + 1,
    };
  }
}

function getScore(state: State): number {
  const winningDeck = state.player1.length ? state.player1 : state.player2;
  return winningDeck.reduce((r, n, i) => r + n * (winningDeck.length - i), 0);
}

function part1(state: State): number {
  while (state.player1.length && state.player2.length) {
    state = play1(state);
  }
  return getScore(state);
}

function hashState(state: State): string {
  return state.player1.join("") + "," +  state.player2.join("");
}

const enum Player {
  Player1 = "Player 1",
  Player2 = "Player 2",
}
let gameCounter = 0;
function recursiveCombatRound(state: State): State {
  const [p1, ...p1Deck] = state.player1;
  const [p2, ...p2Deck] = state.player2;
  let winner: Player;
  if (p1Deck.length >= p1 && p2Deck.length >= p2) {
    winner = recursiveCombat({
      player1: p1Deck.slice(0, p1),
      player2: p2Deck.slice(0, p2),
      round: 0,
    }).winner!;
  } else {
    winner = p1 > p2 ? Player.Player1 : Player.Player2;
  }
  return {
    player1: [...p1Deck, ...(winner === Player.Player1 ? [p1, p2] : [])],
    player2: [...p2Deck, ...(winner === Player.Player2 ? [p2, p1] : [])],
    round: state.round + 1,
    winner,
  };
}

function recursiveCombat(state: State): State {
  gameCounter++;
  const history = new Set<string>();
  while (state.player1.length && state.player2.length) {
    if (history.has(hashState(state))) {
      return { ...state, winner: Player.Player1 };
    }
    history.add(hashState(state));
    state = recursiveCombatRound(state);
  }
  return {
    ...state,
    winner: state.player1.length > 0 ? Player.Player1 : Player.Player2,
  };
}

function part2(state: State): number {
  const endState = recursiveCombat(state);
  return getScore(endState);
}

async function day22(input: string): Promise<void> {
  testPart1();
  testPart2();
  const initialState = getInitialState(input);
  console.log(`Part1: ${part1(initialState)}`);
  console.log(`Part2: ${part2(initialState)}`);
}

export default day22;

const testInput = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

const testInput2 = `Player 1:
43
19

Player 2:
2
29
14`

function testPart1() {
  assertEquals(part1(getInitialState(testInput)), 306);
}

function testPart2() {
  assertEquals(part2(getInitialState(testInput)), 291);
}
