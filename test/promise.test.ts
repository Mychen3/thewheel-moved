import {it, describe,expect} from 'vitest'
import MyPromise from "../src/promise";

describe('hallo Promise', () => {
    it.skip('one', () => {

        let promise:MyPromise = new MyPromise((resolve)=>{
            resolve('牛逼')
        })
        promise.then((res:any)=>{
            console.log(res)
        })
        promise.then((ss:any)=>{
            console.log(ss)
        })

        setTimeout(()=>{
            promise.then((ss:any)=>{
                console.log(ss,'定时器下的')
            })
        },0)
    });

    it.skip('then', function () {
          let promise:MyPromise = new MyPromise((resolve, reject)=>{
                resolve('牛逼')
          })
           promise.then((res:any)=>{
               console.log('第一次调用',res)
               return '第二次调用'
           }).then((res:any)=>{
               console.log(res)
                throw new Error('我报错了')
           },(err:any)=>{
               console.log(err,'err')
           }).then((res:any)=>{
               console.log(res)
           },(err:any)=>{
               console.log(err,'err')
           })

    });
    it.skip('catch', function () {
        let promise:MyPromise = new MyPromise((resolve, reject)=>{
            reject('牛逼')
        })
        promise.then((res:any)=>{
            console.log('第一次调用',res)
            return '第二次调用'
        }).catch((err:any)=>{
            setTimeout(()=>{
                expect(err).toBe('牛逼')
            },0)
        })

    });
    it('finally', function () {
        let promise:MyPromise = new MyPromise((resolve, reject)=>{
            resolve('牛逼')
        })
        promise.then((res:any)=>{
            console.log('第一次调用',res)
            return '第二次调用'
        }).catch((err:any)=>{
            setTimeout(()=>{
                expect(err).toBe('牛逼')
            },0)
        }).finally(()=>{
            console.log('finally执行')
        })

    });


})