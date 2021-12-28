/**
 * @deprecated use Deno's test utils instead
 */
export function assertTrue(val: boolean) {
  if (!val) throw Error(`Expected true but got false`);
}

/**
 * @deprecated use Deno's test utils instead
 */
export function assertFalse(val: boolean) {
  if (val) throw Error(`Expected false but got true`);
}

/**
 * @deprecated use Deno's test utils instead
 */
export function assertEquals<T>(actual: T, expected: T) {
  if (actual != expected) {
    throw Error(`Expected '${actual}' to equal '${expected}'`);
  }
}
