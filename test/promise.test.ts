import {it, describe,expect} from 'vitest'
import MyPromise from "../src/promise";

describe('hallo Promise', () => {
    it.skip('one', () => {

        let promise:MyPromise = new MyPromise((resolve)=>{
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

    it.skip('then', function () {
          let promise:MyPromise = new MyPromise((resolve, reject)=>{
                resolve('牛逼')
          })
           promise.then((res)=>{
               console.log('第一次调用',res)
               return '第二次调用'
           }).then(res=>{
               console.log(res)
                throw new Error('我报错了')
           },err=>{
               console.log(err,'err')
           }).then((res)=>{
               console.log(res)
           },err=>{
               console.log(err,'err')
           })

    });
    it('catch', function () {
        let promise:MyPromise = new MyPromise((resolve, reject)=>{
            reject('牛逼')
        })
        promise.then((res:any)=>{
            console.log('第一次调用',res)
            return '第二次调用'
        }).catch(err=>{
            setTimeout(()=>{
                expect(err).toBe('牛逼')
            },0)
        })

    });


})