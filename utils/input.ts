export function lines(input: string): string[] {
  return input.trim().split("\n");
}

export const parse = {
  int: (input: string) => parseInt(input, 10),
  numberList: (input: string) => input.split(",").map((s) => parseInt(s, 10)),
};
