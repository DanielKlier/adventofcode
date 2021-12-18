export function lines(input: string): string[] {
  return input.trim().split("\n");
}

export function readGrid<T>(
  input: string,
  convertCell: (inp: string) => T
): T[][] {
  return lines(input).map((line) => line.split("").map(convertCell));
}

export const parse = {
  int: (input: string) => parseInt(input, 10),
  binary: (input: string) => parseInt(input, 2),
  numberList: (input: string) => input.split(",").map((s) => parseInt(s, 10)),
};
