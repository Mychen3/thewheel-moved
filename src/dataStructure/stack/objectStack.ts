class ObjectStack {
  private count: number;
  private items: { [key: number]: number };

  constructor() {
    this.count = 0;
    this.items = {};
  }

  push(val: number) {
    this.items[this.count] = val;
    this.count++;
  }

  size() {
    return this.count;
  }

  isEmpty() {
    return this.count === 0
  }

  pop() {
    if (this.isEmpty()) return undefined;
    this.count--;
    const newV = this.items[this.count];
    delete this.items[this.count];
    return newV;
  }
  peek() {
    if (this.isEmpty()) return undefined;
    return this.items[this.count - 1];
  }
  clear() {
    this.count = 0;
    this.items = {};
  }
}

export default ObjectStack;
