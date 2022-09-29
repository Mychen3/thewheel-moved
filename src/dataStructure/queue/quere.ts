class Queue {
  private count: number;
  private lowestCount: number;
  private items: { [key: number]: string | number };
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  enqueue(val: number) {
    this.items[this.count] = val;
    this.count++;
  }

  dequeue() {
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return result;
  }

  peek() {
    return this.items[this.lowestCount];
  }

  usEmpty() {
    return this.count === 0;
  }

  size() {
    return this.count - this.lowestCount;
  }

  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }
}
