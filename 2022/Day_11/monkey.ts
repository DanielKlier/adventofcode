export interface Monkey {
  index: number;
  items: bigint[];
  operation: (a: bigint) => bigint;
  divisor: bigint;
  ifTrue: number;
  ifFalse: number;
  monkeyBusiness: bigint;
}
