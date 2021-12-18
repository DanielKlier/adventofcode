// Solution for 2021, day 10
import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parse } from "../../utils/input.ts";
import { Logger } from "../../utils/log.ts";

const logger = new Logger(Logger.Level.Debug);

function hexToBits(input: string): string {
  return input
    .split("")
    .flatMap((hexStr) => parseInt(hexStr, 16).toString(2).padStart(4, "0"))
    .join("");
}

interface Packet {
  version: number;
  typeId: number;
  length: number;
}

interface LiteralValuePacket extends Packet {
  typeId: 4;
  literalValue: number;
}

interface OperatorPacket extends Packet {
  lengthTypeId: number;
  subPackets: Packet[];
}

interface SubpacketLengthOperatorPacket extends OperatorPacket {
  subpacketsLength: number;
}

interface SubpacketCountOperatorPacket extends OperatorPacket {
  subpacketCount: number;
}

function parseLiteralValuePacket(
  bits: string,
  packet: LiteralValuePacket
): LiteralValuePacket {
  let literalValueStr = "";
  let prefix: boolean;
  let index = 0;
  do {
    prefix = bits[index] === "1";
    literalValueStr += bits.slice(index + 1, index + 5);
    index += 5;
  } while (prefix);
  packet.literalValue = parse.binary(literalValueStr);
  packet.length += index;
  return packet;
}

function parseOperatorPacket(
  bits: string,
  packet: OperatorPacket
): OperatorPacket {
  packet.subPackets = [];
  let index = 0;
  const lengthTypeId = parse.binary(bits[index++]);
  packet.lengthTypeId = lengthTypeId;
  if (lengthTypeId) {
    const numSubPackets = parse.binary(bits.slice(index, (index += 11)));
    (packet as SubpacketCountOperatorPacket).subpacketCount = numSubPackets;
    for (let i = 0; i < numSubPackets; i++) {
      const newPacket = parsePacket(bits.slice(index));
      index += newPacket.length;
      packet.subPackets.push(newPacket);
    }
  } else {
    const subpacketsLength = parse.binary(bits.slice(index, (index += 15)));
    (packet as SubpacketLengthOperatorPacket).subpacketsLength =
      subpacketsLength;
    let subIndex = 0;
    while (subIndex < subpacketsLength) {
      const newPacket = parsePacket(bits.slice(index + subIndex));
      subIndex += newPacket.length;
      packet.subPackets.push(newPacket);
    }
    index += subIndex;
  }
  packet.length += index;
  return packet;
}

function parsePacket(bits: string): Packet {
  let index = 0;
  // Read a package header
  const version = parse.binary(bits.slice(index, (index += 3)));
  const typeId = parse.binary(bits.slice(index, (index += 3)));
  const packet = { version, typeId, length: index };
  const subBits = bits.slice(index);
  // Parse a literal value pac1ket
  if (typeId === 4) {
    return parseLiteralValuePacket(subBits, packet as LiteralValuePacket);
  } else {
    return parseOperatorPacket(subBits, packet as OperatorPacket);
  }
}

function parseInput(input: string): Packet {
  return parsePacket(hexToBits(input));
}

function sumVersion(packet: Packet): number {
  let myVersion = packet.version;
  if (packet.typeId === 4) {
    return myVersion;
  }

  for (const subPacket of (packet as OperatorPacket).subPackets) {
    myVersion += sumVersion(subPacket);
  }

  return myVersion;
}

const subPacketReducer =
  (reducer: (a: number, b: number) => number) =>
  (sum: number, packet: Packet) =>
    reducer(sum, evaluatePacket(packet));

function evaluatePacket(packet: Packet): number {
  if (packet.typeId === 4) return (packet as LiteralValuePacket).literalValue;

  const subPackets = (packet as OperatorPacket).subPackets;
  switch (packet.typeId) {
    case 0:
      return subPackets.reduce(
        subPacketReducer((a, b) => a + b),
        0
      );
    case 1:
      return subPackets.reduce(
        subPacketReducer((a, b) => a * b),
        1
      );
    case 2:
      return subPackets.reduce(
        subPacketReducer((a, b) => Math.min(a, b)),
        Infinity
      );
    case 3:
      return subPackets.reduce(
        subPacketReducer((a, b) => Math.max(a, b)),
        0
      );
    case 5:
      return evaluatePacket(subPackets[0]) > evaluatePacket(subPackets[1])
        ? 1
        : 0;
    case 6:
      return evaluatePacket(subPackets[0]) < evaluatePacket(subPackets[1])
        ? 1
        : 0;
    case 7:
      return evaluatePacket(subPackets[0]) === evaluatePacket(subPackets[1])
        ? 1
        : 0;
    default:
      throw new Error("Unknown packet type " + packet.typeId);
  }
}

function part1(packet: Packet): number {
  return sumVersion(packet);
}

function part2(input: Packet): number {
  return evaluatePacket(input);
}

export default function run(input: string) {
  test();

  const parsedInput = parseInput(input);

  console.log(`Part1: ${part1(parsedInput)}`);
  console.log(`Part2: ${part2(parsedInput)}`);
}

function test() {
  assertEquals(hexToBits("0"), "0000");
  assertEquals(hexToBits("1"), "0001");
  assertEquals(hexToBits("2"), "0010");
  assertEquals(hexToBits("3"), "0011");
  assertEquals(hexToBits("4"), "0100");
  assertEquals(hexToBits("5"), "0101");
  assertEquals(hexToBits("6"), "0110");
  assertEquals(hexToBits("7"), "0111");
  assertEquals(hexToBits("8"), "1000");
  assertEquals(hexToBits("9"), "1001");
  assertEquals(hexToBits("A"), "1010");
  assertEquals(hexToBits("B"), "1011");
  assertEquals(hexToBits("C"), "1100");
  assertEquals(hexToBits("D"), "1101");
  assertEquals(hexToBits("E"), "1110");
  assertEquals(hexToBits("F"), "1111");
  assertEquals(hexToBits("D2FE28"), "110100101111111000101000");

  assertEquals(parsePacket("110100101111111000101000"), {
    version: 6,
    typeId: 4,
    literalValue: 2021,
    length: 21,
  });
  assertEquals(
    parsePacket("00111000000000000110111101000101001010010001001000000000"),
    {
      version: 1,
      typeId: 6,
      length: 49,
      lengthTypeId: 0,
      subpacketsLength: 27,
      subPackets: [
        { version: 6, typeId: 4, literalValue: 10, length: 11 },
        { version: 2, typeId: 4, literalValue: 20, length: 16 },
      ],
    }
  );
  assertEquals(
    parsePacket("11101110000000001101010000001100100000100011000001100000"),
    {
      version: 7,
      typeId: 3,
      lengthTypeId: 1,
      subpacketCount: 3,
      length: 51,
      subPackets: [
        { version: 2, typeId: 4, literalValue: 1, length: 11 },
        { version: 4, typeId: 4, literalValue: 2, length: 11 },
        { version: 1, typeId: 4, literalValue: 3, length: 11 },
      ],
    }
  );

  assertEquals(part1(parseInput("8A004A801A8002F478")), 16);
  // 01100010000000001000000000000000000101100001000101010110001011001000100000000010000100011000111000110100
  // VVVTTTILLLLLLLLLLLVVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAAAAAAAAAAAAAVVVTTTILLLLLLLLLLLBBBBBBBBBBBBBBBBBBBBBB00
  //                                         vvvtttaaaaavvvtttaaaaa                  vvvtttaaaaavvvtttbbbbb00
  assertEquals(part1(parseInput("620080001611562C8802118E34")), 12);
  assertEquals(part1(parseInput("C0015000016115A2E0802F182340")), 23);
  assertEquals(part1(parseInput("A0016C880162017C3686B18A3D4780")), 31);

  assertEquals(evaluatePacket(parseInput("C200B40A82")), 3);
  assertEquals(evaluatePacket(parseInput("04005AC33890")), 54);
  assertEquals(evaluatePacket(parseInput("880086C3E88112")), 7);
  assertEquals(evaluatePacket(parseInput("CE00C43D881120")), 9);
  assertEquals(evaluatePacket(parseInput("D8005AC2A8F0")), 1);
  assertEquals(evaluatePacket(parseInput("F600BC2D8F")), 0);
  assertEquals(evaluatePacket(parseInput("9C005AC2F8F0")), 0);
  assertEquals(evaluatePacket(parseInput("9C0141080250320F1802104A08")), 1);
  //assertEquals(part2(parseInput(testInput)), Infinity);

  logger.info("Tests OK");
}
