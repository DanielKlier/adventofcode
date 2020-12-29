class CListNode<T> {
  right: CListNode<T> = this;
  left: CListNode<T> = this;
  constructor(public readonly data: T) {}
}

export class CList<T> implements Iterable<T> {
  size: number = 0;
  focus: CListNode<T> | null = null;
  map = new Map<T, CListNode<T>>();

  insertL(data: T) {
    const node = new CListNode<T>(data);
    if (this.focus) {
      node.right = this.focus.right;
      node.left = this.focus;
      this.focus.right.left = node;
      this.focus.right = node;
    }
    this.focus = node;
    this.size = this.size + 1;
    this.map.set(data, node);
  }

  rotR() {
    if (this.focus) this.focus = this.focus.right;
  }

  removeNL(n: number): T[] {
    if (n > this.size)
      throw new Error("Cannot remove more elements than the has.");
    if (!this.focus) return [];
    const collector: T[] = [];
    let left = this.focus.left;
    let next = this.focus;
    for (let i = 0; i < n; i++) {
      collector.push(next.data);
      next = next.right;
    }
    this.size = this.size - n;
    if (this.size === 0) {
      this.focus = null;
    } else {
      this.focus = left;
      this.focus.right = next;
      next.left = this.focus;
    }
    collector.forEach(d => this.map.delete(d));
    return collector;
  }

  toString() {
    const [first, ...rest] = Array.from(this);
    return `(${first}) ${rest.join(" ")}`;
  }

  *[Symbol.iterator]() {
    const start = this.focus;
    let current = this.focus;
    if (!current) {
      return;
    }
    do {
      yield current?.data;
      current = current?.right;
    } while (current !== start);
  }
}
