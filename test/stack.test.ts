import ObjectStack from "../src/dataStructure/stack/objectStack";
import { describe, expect, test } from "vitest";

describe("Stack", () => {

    //  10进制转2进制
  const decimalTobinary = (val: number) => {
    const objectStack = new ObjectStack();
    let binaryString = ""; //结果
    while (val > 0) {
      // 余数取整
      objectStack.push(Math.floor(val % 2));
      val = Math.floor(val / 2);
    }
     
    while(!objectStack.isEmpty()){
        binaryString += objectStack.pop()?.toString()
    }
    return binaryString
  };


  test('decimalTobinary',()=>{
    expect(decimalTobinary(10)).toBe('1010')
 fun
  })



});
