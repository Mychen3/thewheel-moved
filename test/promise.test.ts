import {it, describe} from 'vitest'
import MyPromise from "../src/promise";

describe('hallo Promise', () => {
    it('one', () => {
        let promise:Promise<void> = new MyPromise((resolve, reject)=>{
            reject('牛逼')
        })
        promise.then(res=>{
            console.log(res)
        },err=>{
            console.log(err)
        })
    });


})