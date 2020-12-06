// Solution for 2020, day 06
import { assertEquals } from "../utils/test.ts";

type Group = string[][];

function parseInput(input: string): Group[] {
  return input.split("\n").reduce(
    ({ groups, current }: { groups: Group[]; current: Group }, line) => {
      if (line.trim() === "")
        return { groups: [...groups, current], current: [] };
      return { groups, current: [...current, line.split("")] };
    },
    { groups: [], current: [] }
  ).groups;
}

function sum(a: number, b: number): number {
  return a + b;
}

function groupToMap(group: Group): Map<string, number> {
  return group.reduce((map, person) => {
    person.forEach((c) => {
      map.set(c, (map.get(c) || 0) + 1);
    });
    return map;
  }, new Map<string, number>());
}

function yesAnswersPerGroup(group: Group): number {
  return groupToMap(group).size;
}

function allYesAnswersPerGroup(group: Group): number {
  let result = 0;
  for (let number of groupToMap(group).values()) {
    if (number === group.length) result++;
  }
  return result;
}

function yesAnswersAllGroups(groups: Group[]): number {
  return groups.map(yesAnswersPerGroup).reduce(sum);
}

function allYesAnswersAllGroups(groups: Group[]): number {
  return groups.map(allYesAnswersPerGroup).reduce(sum);
}

async function day06(input: string): Promise<void> {
  const groups = parseInput(input);
  assertEquals(groups.length, 495);
  test_yesAnswersPerGroup();
  test_yesAnswersAllGroups();
  test_allYesAnswersPerGroup();
  test_allYesAnswersAllGroups();

  console.log(
    `Part 1: there are ${yesAnswersAllGroups(groups)} yes answers in total.`
  );
  console.log(
    `Part 2: there are ${allYesAnswersAllGroups(groups)} all yes answers in total.`
  );
}

export default day06;

function test_yesAnswersPerGroup() {
  const group = `abcx
abcy
abcz`
    .split("\n")
    .map((l) => l.split(""));
  assertEquals(yesAnswersPerGroup(group), 6);
}

function test_yesAnswersAllGroups() {
  const groups = parseInput(`abc

a
b
c

ab
ac

a
a
a
a

b
`);
  assertEquals(yesAnswersAllGroups(groups), 11);
}

function test_allYesAnswersPerGroup() {
  const groups = parseInput(`abc

a
b
c

ab
ac

a
a
a
a

b
`);

  assertEquals(allYesAnswersPerGroup(groups[0]), 3);
  assertEquals(allYesAnswersPerGroup(groups[1]), 0);
  assertEquals(allYesAnswersPerGroup(groups[2]), 1);
  assertEquals(allYesAnswersPerGroup(groups[3]), 1);
  assertEquals(allYesAnswersPerGroup(groups[4]), 1);
}

function test_allYesAnswersAllGroups() {
  const groups = parseInput(`abc

a
b
c

ab
ac

a
a
a
a

b
`);

  assertEquals(allYesAnswersAllGroups(groups), 6);
}
