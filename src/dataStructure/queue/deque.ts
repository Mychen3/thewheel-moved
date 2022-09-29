// 双端队列

export default class Deque {
  // 当前key的位置
  private count: number;
  // 队列最前面的一位key，永远保持第一个元素的key
  private lowestCount: number;

  private items: { [key: number]: string | number };
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
  // 在双端队列前端添加新的元素
  addfront(val: string) {
    // 先判断是否为空
    if (this.isEmpty()) {
      //为空直接添加
      this.addBack(val);
      // 判断最前端是否大于0，这样可以直接去减lowestCount
    } else if (this.lowestCount > 0) {
      this.lowestCount--;
      this.items[this.lowestCount] = val;
    } else {
      // 第三种情况是lowestCount为0,使最前端lowestCount标记变成的变成负数
      this.lowestCount--;
      this.count++;
      this.items[this.lowestCount] = val;
    }
  }

  getItem() {
    return this.items;
  }

  // 在双端队列后端添加新的元素
  addBack(val: string) {
    this.items[this.count] = val;
    this.count++;
  }
  // 在双端队列前端移除最前一个元素
  removeFront() {
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return result;
  }
  // 在双端队列后端移除最后一个元素
  removeBack() {
    const result = this.items[this.count];
    delete this.items[this.count - 1];
    this.count--;
    return result;
  }

  peekFront() {
    return this.items[this.lowestCount];
  }

  size() {
    return this.count - this.lowestCount;
  }

  isEmpty() {
    return this.size() === 0;
  }

  toString() {
    const sortArr = Object.keys(this.items)
      .map((item) => parseInt(item))
      .sort((a: number, b: number) => a - b);
    let str: string = "";
    sortArr.forEach((item) => {
      str = `${str},${this.items[item]}`;
    });
    return str;
  }

  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }
}
