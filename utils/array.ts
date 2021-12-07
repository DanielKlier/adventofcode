export function range(start: number, end?: number): number[] {
  start = typeof end === "number" ? start : 0;
  end = typeof end === "number" ? end : start;
  return Array.from({ length: end - start + 1 }, (_, i) => i);
}

export function matrix<T>(rows: number, columns: number, fill?: T): T[][] {
  return [...Array(rows)].map(() => Array(columns).fill(fill));
}
