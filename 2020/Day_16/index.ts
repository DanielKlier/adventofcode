// Solution for 2020, day 16
import { lines, parse } from "../utils/input.ts";
import { assertEquals, assertTrue } from "../utils/test.ts";

interface Range {
  min: number;
  max: number;
}
type FieldName = string;
type Rules = Map<FieldName, Range[]>;
type TicketNumbers = number[];
interface PuzzleInput {
  rules: Rules;
  myTicket: TicketNumbers;
  nearbyTickets: TicketNumbers[];
}

function parseTicketFields(ln: string): TicketNumbers {
  return ln.split(",").map(parse.int);
}

function parseInput(input: string): PuzzleInput {
  const puzzleInput: PuzzleInput = {
    rules: new Map<FieldName, Range[]>(),
    myTicket: [],
    nearbyTickets: [],
  };

  let i = 0;
  const lineList = lines(input);
  let line: string;
  // Get rules
  while ((line = lineList[i++].trim()) !== "") {
    const [field, ruleStr] = line.split(": ");
    const rules: Range[] = ruleStr
      .split(" or ")
      .map((r) => r.split("-"))
      .map((a) => a.map(parse.int))
      .map(([min, max]) => ({ min, max }));
    puzzleInput.rules.set(field, rules);
  }
  // Skip empty "your ticket:"
  i += 1;
  // Get my ticket
  puzzleInput.myTicket = parseTicketFields(lineList[i++]);
  // Skip empty line
  i += 2;
  // parse rest
  while (i < lineList.length) {
    line = lineList[i++];
    puzzleInput.nearbyTickets.push(parseTicketFields(line));
  }

  return puzzleInput;
}

const isValidField = (rules: Rules) => {
  const allRanges = Array.from(rules.values()).flatMap((a) => a);
  return (field: number) =>
    !!allRanges.find((r) => r.min <= field && r.max >= field);
};

function part1(input: PuzzleInput): number {
  const valid = matchingRules(input.rules);
  return input.nearbyTickets
    .flatMap((ticket) => ticket.filter((n) => valid(n).size === 0))
    .reduce((s, a) => s + a, 0);
}

const matchingRules = (rules: Rules) => {
  return (val: number) => {
    const matchingRules = new Map<string, Range[]>();
    for (const [field, ranges] of rules.entries()) {
      if (!!ranges.find((r) => r.min <= val && r.max >= val)) {
        matchingRules.set(field, ranges);
      }
    }
    return matchingRules;
  };
};

const inRanges = (ranges: Range[]) => (f: number) =>
  ranges.some(({ min, max }) => f >= min && f <= max);

const ticketDecoder = (input: PuzzleInput) => {
  const valid = matchingRules(input.rules);
  const validTickets = input.nearbyTickets.filter((ticket) =>
    ticket.every((n) => valid(n).size > 0)
  );
  const numPos = validTickets[0].length;
  const posToRules = new Map<number, Set<String>>();
  for (let i = 0; i < numPos; i++) {
    for (const [f, r] of input.rules) {
      const good = inRanges(r);
      if (validTickets.every((t) => good(t[i]))) {
        if (!posToRules.has(i)) {
          posToRules.set(
            i,
            new Set<String>([f])
          );
        } else {
          posToRules.get(i)?.add(f);
        }
      }
    }
  }
  const posToRules2 = Array.from(posToRules.entries());
  const positions = new Map<number, string>();
  while (posToRules2.length > 0) {
    console.log("-----------------------------");
    posToRules2.sort(([, a], [, b]) => a.size - b.size);
    console.log(posToRules2);
    const [pos, rule] = posToRules2.shift()!;
    const r = rule.values().next().value;
    posToRules2.forEach(
      ([, rules]) => rules.delete(r),
      1
    );
    positions.set(pos, r);
  }
  return (t: TicketNumbers) =>
    Array.from(positions.entries()).reduce(
      (obj, [pos, field]) => ({ ...obj, [field]: t[pos] }),
      {} as Record<string, number>
    );
};

function part2(input: PuzzleInput): number {
  const td = ticketDecoder(input);
  const myTicket = td(input.myTicket);
  console.log(myTicket);
  return Object.entries(myTicket).reduce(
    (p, [k, v]) => p * (k.startsWith("departure") ? v : 1),
    1
  );
}

async function day16(input: string): Promise<void> {
  testParse(input);
  testPart1();
  //testPart2();

  const puzzleInput = parseInput(input);

  console.log(`Part1: ${part1(puzzleInput)}`);
  console.log(`Part2: ${part2(puzzleInput)}`);
}

export default day16;

function testParse(input: string) {
  const pi = parseInput(input);
  assertEquals(pi.nearbyTickets.length, 242);
}

const testInput = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;

function testPart1() {
  const pi = parseInput(testInput);
  assertEquals(part1(pi), 71);
}

const testInput2 = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`;

function testPart2() {
  const pi = parseInput(testInput2);
  const td = ticketDecoder(pi);
  const mt = td(pi.myTicket);
  console.log(mt);
  assertEquals(mt["class"], 12);
  assertEquals(mt["row"], 11);
  assertEquals(mt["seat"], 13);
}
