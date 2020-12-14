// Solution for 2020, day 14
import { lines } from "../utils/input.ts";
import { assertEquals } from "../utils/test.ts";

const getMask = (mask: string) => {
  const or = BigInt("0b" + mask.replaceAll(/[^1]/g, "0"));
  const and = BigInt("0b" + mask.replaceAll(/[^0]/g, "1"));
  return (val: bigint): bigint => (val & and) | or;
};

function part1(input: string[]): bigint {
  const mem = new Map<bigint, bigint>();
  let mask;
  for (const ln of input) {
    const [lhs, rhs] = ln.split(" = ");
    if (lhs === "mask") {
      mask = getMask(rhs);
    } else {
      const val = BigInt(rhs);
      const loc = BigInt(lhs.replaceAll(/mem\[|]/g, ""));
      mask && mem.set(loc, mask(val));
    }
  }
  let sum = BigInt(0);
  for (const n of mem.values()) {
    sum += n;
  }
  return sum;
}

/*interface MemTree {
  val: bigint;
  0?: MemTree;
  1?: MemTree;
}*/

function maskAddress(addr: bigint, mask: string): string {
  const addrStr = addr.toString(2).padStart(36, '0').split("");
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "1") addrStr[i] = "1";
    else if (mask[i] === "X") addrStr[i] = "X";
  }
  return addrStr.join("");
}

/*function write(memTree: MemTree, addr: string[], val: bigint) {
  const [bit, ...rest] = addr;
}*/

function resolve(addr: string, memo = new Map<string, string[]>()): string[] {
  const [bit, ...rest] = addr.split("");
  const addresses: string[] = [];
  switch (bit) {
    case "X":
      addresses.push("1");
      addresses.push("0");
      break;
    case "1":
      addresses.push("1");
      break;
    case "0":
      addresses.push("0");
  }

  if (!rest.length) {
    return addresses;
  }

  const restAddr = rest.join("");
  if (!memo.has(restAddr)) {
    memo.set(restAddr, resolve(restAddr));
  }
  return memo.get(restAddr)!.flatMap((r) => addresses.map((a) => a + r));
}

function resolveAdresses(addr: string): bigint[] {
  return resolve(addr).map((addr) => BigInt(addr));
}

function part2(input: string[]): bigint {
  const mem = new Map<bigint, bigint>();
  let mask: string;
  input.forEach((ln) => {
    const [lhs, rhs] = ln.split(" = ");
    if (lhs === "mask") {
      mask = rhs;
    } else {
      const val = BigInt(rhs);
      const loc = BigInt(lhs.replaceAll(/mem\[|]/g, ""));
      const maskedAddress = maskAddress(loc, mask);
      resolveAdresses(maskedAddress).forEach((addr) => {
        mem.set(addr, val);
      });
    }
  });
  let sum = BigInt(0);
  for (const n of mem.values()) {
    sum += n;
  }
  return sum;
}

async function day14(input: string): Promise<void> {
  testMasks();
  testPart1();
  testPart2();

  const inputLines = lines(input);

  console.log(`Part1: ${part1(inputLines)}`);
  console.log(`Part2: ${part2(inputLines)}`);
}

export default day14;

const sample = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;

function testMasks() {
  const mask = getMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X");
  assertEquals(mask(11n), 73n);
  assertEquals(mask(101n), 101n);
  assertEquals(mask(0n), 64n);

  const allPass = getMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  const ones = 1n << (36n - 1n);
  assertEquals(allPass(ones), ones);
  const allZero = getMask("000000000000000000000000000000000000");
  assertEquals(allZero(ones), 0n);
}

function testPart1() {
  assertEquals(part1(lines(sample)), 165n);
}

function testPart2() {
  const sample2 = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;
  assertEquals(part2(lines(sample2)), 208n);
}