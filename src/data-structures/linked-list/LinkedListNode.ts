export default class LinkedListNode<T> {
  private _next: LinkedListNode<T> | null;

  constructor(public readonly value: T, next?: LinkedListNode<T>) {
    this._next = next ?? null;
  }

  get next(): LinkedListNode<T> | undefined {
    return this._next ?? undefined;
  }

  setNext(node: LinkedListNode<T>): LinkedListNode<T> | undefined {
    const ref = this.next;
    this._next = node;
    return ref;
  }

  unlink(): LinkedListNode<T> | undefined {
    const ref = this.next;
    this._next = null;
    return ref;
  }

  [Symbol.toPrimitive](hint: Hint): string | number {
    return (hint === 'string' ? String : Number)(this.value);
  }
}