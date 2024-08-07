import { DoublyLinkedListNode } from './DoublyLinkedListNode';

function createList<T>(
  values: T[],
): [first: DoublyLinkedListNode<T>, last: DoublyLinkedListNode<T>] | [] {
  if (values.length < 1) return [];

  const lastNode = new DoublyLinkedListNode(values[values.length - 1] as T);
  const firstNode = values.slice(0, -1).reduceRight((next, value) => {
    const node = new DoublyLinkedListNode(value, next);
    next.setPrev(node);
    return node;
  }, lastNode);

  return [firstNode, lastNode];
}

export class DoublyLinkedList<T> implements Iterable<T> {
  static createNode<T>(
    value: T,
    next?: DoublyLinkedListNode<T>,
    prev?: DoublyLinkedListNode<T>,
  ): DoublyLinkedListNode<T> {
    return new DoublyLinkedListNode(value, next, prev);
  }

  #head: DoublyLinkedListNode<T> | null;

  #last: DoublyLinkedListNode<T> | null;

  constructor(list: T[] | DoublyLinkedListNode<T> = []) {
    if (list instanceof DoublyLinkedListNode) {
      this.#head = list;
      this.#last = (function iterate(node): DoublyLinkedListNode<T> {
        return node.next ? iterate(node.next) : node;
      })(list);
      return;
    }

    const [head, last] = createList(list);
    this.#head = head ?? null;
    this.#last = last ?? null;
  }

  get head(): DoublyLinkedListNode<T> | undefined {
    return this.#head ?? undefined;
  }

  get last(): DoublyLinkedListNode<T> | undefined {
    return this.#last ?? undefined;
  }

  clear(): [
    DoublyLinkedListNode<T> | undefined,
    DoublyLinkedListNode<T> | undefined,
  ] {
    const head = this.#head;
    const last = this.#last;
    this.#head = null;
    this.#last = null;
    return [head ?? undefined, last ?? undefined];
  }

  isEmpty(): this is { head: undefined; last: undefined } {
    return this.head === undefined || this.last === undefined;
  }

  prepend(...values: T[]): this {
    if (values.length < 1) return this;

    const [newHead, lastNodeToPrepend] = createList(values) as [
      DoublyLinkedListNode<T>,
      DoublyLinkedListNode<T>,
    ];

    if (this.isEmpty()) this.#last = lastNodeToPrepend;
    lastNodeToPrepend.setNext(this.head ?? null);
    this.head?.setPrev(lastNodeToPrepend);
    this.#head = newHead;

    return this;
  }

  append(...values: T[]): this {
    if (values.length < 1) return this;

    const [firstNodeToAppend, newLast] = createList(values) as [
      DoublyLinkedListNode<T>,
      DoublyLinkedListNode<T>,
    ];

    if (!this.last) this.#head = firstNodeToAppend;
    else {
      this.last.setNext(firstNodeToAppend);
      firstNodeToAppend.setPrev(this.last);
    }
    this.#last = newLast;

    return this;
  }

  private equals(arg: T | ((value: T) => boolean), value: T): boolean {
    return arg instanceof Function ? arg(value) : value === arg;
  }

  find(
    valueOrCb: T | ((value: T) => boolean),
  ): DoublyLinkedListNode<T> | undefined {
    const iterate = (
      node?: DoublyLinkedListNode<T>,
    ): DoublyLinkedListNode<T> | undefined => {
      if (!node) return undefined;
      return this.equals(valueOrCb, node.value) ? node : iterate(node.next);
    };
    return iterate(this.head);
  }

  deleteHead(): DoublyLinkedListNode<T> | undefined {
    if (!this.head?.next) return this.clear()[0];

    const { head } = this;
    this.#head = head.setNext(null) ?? null;
    head.setPrev(null);
    this.head.setPrev(null);
    return head;
  }

  deleteLast(): DoublyLinkedListNode<T> | undefined {
    if (!this.last?.prev) return this.clear()[1];

    const { last } = this;
    this.#last = last.setPrev(null) ?? null;
    last.setNext(null);
    this.last.setNext(null);
    return last;
  }

  delete(value: T): DoublyLinkedList<T> {
    const variant = (() => {
      if (this.isEmpty()) return 'empty';
      if (this.head === this.last)
        return this.head?.value === value ? 'single' : 'noMatch';
      if (this.head?.value === value) return 'head';
      if (this.last?.value === value) return 'last';
      return 'between';
    })();

    const iterate = (n: DoublyLinkedListNode<T>): void => {
      const node = n as {
        next: DoublyLinkedListNode<T>;
        prev: DoublyLinkedListNode<T>;
        value: T;
      };
      if (node === this.last) return;
      if (node.value === value) {
        node.prev.setNext(node.next);
        node.next.setPrev(node.prev);
      }
      iterate(node.next);
    };

    switch (variant) {
      case 'single':
        this.clear();
        return this;
      case 'head':
        this.deleteHead();
        return this.delete(value);
      case 'last':
        this.deleteLast();
        return this.delete(value);
      case 'between':
        iterate(this.head!.next!);
        return this;
      default:
        return this;
    }
  }

  [Symbol.toPrimitive](): string {
    const iterate = (node?: DoublyLinkedListNode<T>, acc: T[] = []): T[] =>
      node ? iterate(node.next, [...acc, node.value]) : acc;
    return iterate(this.head).join(',');
  }

  *[Symbol.iterator](): Generator<T> {
    function* iterate(node: DoublyLinkedListNode<T> | undefined): Generator<T> {
      if (!node) return;
      yield node.value;
      yield* iterate(node.next);
    }
    yield* iterate(this.head);
  }
}
