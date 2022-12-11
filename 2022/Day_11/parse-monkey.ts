import { parse } from '../../utils/input.ts';
import { Monkey } from './monkey.ts';

const indexRegex = /Monkey (\d+):/;

function parseIndex(line: string): number {
  const match = indexRegex.exec(line);
  if (!match) throw new Error('No Match!');
  const [, indexStr] = match;
  return parse.int(indexStr);
}

function parseStartingItems(line: string): bigint[] {
  return line.split(': ')[1].split(', ').map(s => BigInt(parse.int(s)));
}

const opRegex = /Operation: new = old ([+*]) (\d+|old)/;

function parseOperation(line: string): (a: bigint) => bigint {
  const match = opRegex.exec(line);
  if (!match) throw new Error('No Match!');
  const [, op, valStr] = match;

  if (valStr === 'old') return (a) => a * a;

  const val = BigInt(parse.int(valStr));

  if (op === '*') {
    return (a: bigint) => {
      return a * val;
    };
  }
  else if (op === '+') {
    return (a: bigint) => {
      return a + val;
    };
  }
  else throw new Error('Unknown op');
}

const testRegex = /Test: divisible by (\d+)/;

function parseDivisor(line: string): bigint {
  const match = testRegex.exec(line);
  if (!match) throw new Error('No Match!');
  const [, valStr] = match;
  return BigInt(parse.int(valStr));
}

const targetRegex = /If (true|false): throw to monkey (\d+)/;

function parseTarget(line: string): number {
  const match = targetRegex.exec(line);
  if (!match) throw new Error('No Match!');
  const [, , targetStr] = match;
  return parse.int(targetStr);
}

export function parseMonkey(section: string): Monkey {
  const lines = section.split('\n').map(s => s.trim());

  const index = parseIndex(lines[0]);
  const startingItems = parseStartingItems(lines[1]);
  const operation = parseOperation(lines[2]);
  const divisor = parseDivisor(lines[3]);
  const ifTrue = parseTarget(lines[4]);
  const ifFalse = parseTarget(lines[5]);

  return {
    index,
    items: startingItems,
    operation,
    ifTrue,
    ifFalse,
    divisor,
    monkeyBusiness: 0n
  }
}
