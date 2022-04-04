import {it, describe} from 'vitest'
import MyPromise from "../src/promise";

describe('hallo Promise', () => {
    it('one', () => {
        let promise:Promise<void> = new MyPromise((resolve, reject)=>{
            resolve('牛逼')
        })
        promise.then(res=>{
            console.log(res)
        })
        promise.then(ss=>{
            console.log(ss)
        })

        setTimeout(()=>{
            promise.then(ss=>{
                console.log(ss,'定时器下的')
            })

        },0)

    });


})