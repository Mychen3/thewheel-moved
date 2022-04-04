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
          let promise:MyPromise = new MyPromise((resolve, _reject)=>{
                resolve('实现then')
          })
           promise.then((res:any)=>{
               console.log('第一次调用',res)
               return '第二次调用'
           }).then((res:any)=>{
               console.log(res)
               return '第三次调用'
           }).then((res:any)=>{
               console.log(res)
           })

    });
    it.skip('catch', function () {
        let promise:MyPromise = new MyPromise((_resolve, reject)=>{
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
    it.skip('finally', function () {
        let promise:MyPromise = new MyPromise((resolve, _reject)=>{
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
    it.skip('all', function () {
        let promise:MyPromise = new MyPromise((_resolve, _reject)=>{
           throw new TypeError('出问题了')
        })
        let promise2:MyPromise = new MyPromise((resolve, _reject)=>{
            resolve('牛逼2')
        })
        let promise3:MyPromise = new MyPromise((resolve, _reject)=>{
            resolve('牛逼3')
        })

       let a= MyPromise.all([promise,promise2,promise3])
        a.then((res:any)=>{
            console.log(res)
        }).catch((err:TypeError)=>{
            console.log(err)
        })
    });

    it.skip('allSettled', function () {
        let promise:MyPromise = new MyPromise((_resolve, _reject)=>{
            throw new TypeError('出问题了')
        })
        let promise2:MyPromise = new MyPromise((resolve, _reject)=>{
            resolve('牛逼2')
        })
        let promise3:MyPromise = new MyPromise((resolve, _reject)=>{
            resolve('牛逼3')
        })

        let a= MyPromise.allSettled([promise,promise2,promise3])
        a.then((res:any)=>{
            console.log(res)
        }).catch((err:TypeError)=>{
            console.log(err)
        })
    });

    it.skip('race', function () {
        let promise:MyPromise = new MyPromise((_resolve, _reject)=>{
            throw new TypeError('出问题了')
        })
        let promise2:MyPromise = new MyPromise((resolve, _reject)=>{
            resolve('牛逼2')
        })
        let promise3:MyPromise = new MyPromise((resolve, _reject)=>{
            resolve('牛逼3')
        })
        let a= MyPromise.race([promise,promise2,promise3])
        a.then((res:any)=>{
            console.log(res)
        }).catch((err:TypeError)=>{
            console.log(err)
        })
    });

    it('any', function () {
        let promise:MyPromise = new MyPromise((_resolve, _reject)=>{
            throw new TypeError('出问题了')
        })
        let promise2:MyPromise = new MyPromise((_resolve, _reject)=>{
            throw new TypeError('出问题了')
        })
        let promise3:MyPromise = new MyPromise((_resolve, _reject)=>{
            throw new TypeError('出问题了')
        })
        let a= MyPromise.any([promise,promise2,promise3])
        a.then((res:any)=>{
            console.log(res)
        }).catch((err:TypeError)=>{
            console.log(err)
        })
    });



})