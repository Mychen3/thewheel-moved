import Deque from "../src/dataStructure/queue/deque";
import { describe, expect, test } from "vitest";

describe("deque", () => {
  test("hello deque", () => {
    const deque = new Deque();

    deque.addBack("试试看");
    deque.addBack("js");
    deque.addBack("json");
    deque.addfront("我是第一个");
     console.log( deque.toString());
     
    
    expect(deque.getItem()[-1]).toBe("我是第一个");
  });
});
