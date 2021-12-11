export function range(start: number, end?: number): number[] {
  start = typeof end === "number" ? start : 0;
  end = typeof end === "number" ? end : start;
  return Array.from({ length: end - start + 1 }, (_, i) => i);
}

export function matrix<T>(rows: number, columns: number, fill?: T): T[][] {
  return [...Array(rows)].map(() => Array(columns).fill(fill));
}

export const permute = <T>(inputArr: T[]) => {
  const result: T[][] = [];

  const permuteRec = (arr: T[], m: T[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permuteRec(curr.slice(), m.concat(next));
      }
    }
  };

  permuteRec(inputArr);

  return result;
};

export function sortByLength<T extends { length: number }>(arr: T[]) {
  arr = arr.slice();
  arr.sort((a, b) => a.length - b.length);
  return arr;
}
