export function assertTrue(val: boolean) {
  if (!val) throw Error(`Expected true but got false`);
}

export function assertFalse(val: boolean) {
  if (val) throw Error(`Expected false but got true`);
}

export function assertEquals<T>(actual: T, expected: T) {
  if (actual != expected) {
    throw Error(`Expected '${actual}' to equal '${expected}'`);
  }
}
