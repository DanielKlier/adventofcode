export function matrix<T>(rows: number, columns: number, fill?: T): T[][] {
  return [...Array(rows)].map(() => Array(columns).fill(fill));
}
