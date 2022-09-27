class ArrayStack {
  private items: Array<number>;
  constructor() {
    this.items = [];
  }

  push(val: number) {
    this.items.push(val);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return !!this.isEmpty.length;
  }
  clear() {
    this.items = [];
  }
  size() {
    return this.items.length;
  }
}

export default ArrayStack;
