export function lines(input: string): string[] {
  return input.split("\n");
}

export const parse = {
  int: (input: string) => parseInt(input, 10)
};
