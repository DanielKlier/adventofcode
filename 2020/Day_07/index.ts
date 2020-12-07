import { assertEquals } from "../utils/test.ts";

// Solution for 2020, day 07
const ruleRegex = /^(?<container>[a-z ]+) bags contain (?<colors>(?:(?:\d+ [a-z ]+) bags?[,.] ?)+|no other bags.)$/gm;
const contentsRegex = /(?<qty>\d+) (?<col>[a-z ]+) bags?|no other bags/g

interface Content {
  col: string;
  qty: number;
}

interface Rule {
  container: string;
  contents: Content[];
}

function bagsContaining(rules: Rule[], bagColor: string): Set<string> {
  const matching: Rule[] = [];
  const nonMatching: Rule[] = [];
  for (const rule of rules) {
    if (rule.contents.find(c => c.col === bagColor)) matching.push(rule);
    else nonMatching.push(rule);
  }

  const set = new Set<string>();
  matching.forEach(m => {
    set.add(m.container);
    const subMatches = bagsContaining(nonMatching, m.container);
    subMatches.forEach(sm => set.add(sm));
  });

  return set;
}

function bagsNeeded(rules: Rule[], targetBag: string): number {
  const rule = rules.find(r => r.container === targetBag);
 
  let numBags = 0;

  rule?.contents.forEach(content => {
    numBags += content.qty;
    numBags += content.qty * bagsNeeded(rules, content.col);
  });

  return numBags;
}

function parseInput(input: string): Rule[] {
  const matches = input.matchAll(ruleRegex);

  const rules: Rule[] = [];
  for (const match of matches) {
    const {container, colors} = match.groups || {};
    const rule: Rule = {container, contents: []};
    for (const content of colors.matchAll(contentsRegex)) {
      if (content.groups && content.groups.col) {
        rule.contents.push({
          col: content.groups.col,
          qty: parseInt(content.groups.qty, 10)
        })
      }
    }
    rules.push(rule);
  }

  return rules;
}

async function day07(input: string): Promise<void> {
  test_bagsNeeded();

  const rules = parseInput(input);

  assertEquals(rules.length, 594);

  const targetBag = 'shiny gold';
  
  const part1 = bagsContaining(rules, targetBag);
  console.log(`Part1: there are ${part1.size} other bag colors that may contain a ${targetBag} bag.`);

  const part2 = bagsNeeded(rules, targetBag);
  console.log(`Part2: we need ${part2} individual other bags.`);
}

export default day07;

function test_bagsNeeded() {
  const input = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`;

  const rules = parseInput(input);

  assertEquals(bagsNeeded(rules, 'shiny gold'), 126);
}