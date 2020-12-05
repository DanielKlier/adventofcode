// Solution for 2020, day 05
import { assertEquals } from "../utils/test.ts";

function seatId(seatStr: string): number {
  return parseInt(seatStr.replaceAll(/[FL]/g, "0").replaceAll(/[BR]/g, "1"), 2);
}


function seatRow(seatId: number): number {
  return seatId >> 3;
}

function seatCol(seatId: number): number {
  return seatId & 0b000000111;
}

function max(a: number, b: number) {
  return Math.max(a, b);
}

function min(a: number, b: number) {
  return Math.min(a, b);
}

async function day05(input: string): Promise<void> {
  test_seatId();
  test_seatRow();
  test_seatCol();

  const seatIds = input.split('\n').map(seatId);
  const maxSeatId = seatIds.reduce(max, -Infinity);
  const minSeatId = seatIds.reduce(min, Infinity);
  const seatSet = new Set(seatIds);

  console.log(`The smallest seat id is ${minSeatId}`);
  console.log(`The biggest seat id is ${maxSeatId}`);

  for (let id = minSeatId; id<=maxSeatId; id++) {
    if(!seatSet.has(id)) {
      console.log(`Your seat id is ${id}`);
      break;
    }
  }
}

export default day05;


function test_seatId() {
  const expected = 0b0101100101;
  assertEquals(seatId("FBFBBFFRLR"), expected);
}

function test_seatRow() {
  assertEquals(seatRow(0b0101100101), 44);
}

function test_seatCol() {
  assertEquals(seatCol(0b0101100101), 5);
}
