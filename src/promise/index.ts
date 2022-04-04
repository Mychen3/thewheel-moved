interface IManFn {
    resolve<T extends any>(value?: T): void;

    reject<T extends any>(reason?: T): void;
}


interface IMyPromise extends IManFn {
    then(onFulfilled: Function, onRejected?: Function): MyPromise

    catch(onRejected: Function): MyPromise

    finally(onFinally:Function): MyPromise


}

const STATE_PENDING: string = 'pending'
const STATE_FULFILLED: string = 'fulfilled'
const STATE_REJECTED: string = 'rejected'


const exceptionHandling = (resolve: Function, reject: Function, handFn: Function, value: any): void => {
    try {
        const returnValue: any = handFn(value)
       resolve(returnValue)
    } catch (e) {
        reject(e)
    }
}

export default class MyPromise implements IMyPromise {
    private _state: string;
    private _value: undefined | any;
    private _reason: undefined | any;
    private _onFulfilleds: Array<Function>;
    private _onRejecteds: Array<Function>;


    constructor(executor: (resolve: IManFn["resolve"], reject: IManFn["reject"]) => void) {
        // 默认是等待状态
        this._state = STATE_PENDING
        // 传进来的值
        this._value = undefined
        //传进来的错误值
        this._reason = undefined
        // 所有的成功的回调数组
        this._onFulfilleds = []
        // 所有的失败的回调数组
        this._onRejecteds = []

        try {
            // 进来就直接掉用
            executor(this.resolve.bind(this), this.reject.bind(this))
        } catch (e) {
            this.reject(e)
        }
    }

    resolve<T extends any>(value?: T) {

        if (this._state === STATE_PENDING) {
            // 微任务，如果不加微任务的话，.then传进来的函数是还没赋值的，导致this._onFulfilled是个undefined
            queueMicrotask(() => {
                if (this._state !== STATE_PENDING) return
                this._state = STATE_FULFILLED
                // 只有当状态是在等待状态的时候
                this._value = value
                for (let onFulfilled of this._onFulfilleds) {
                    onFulfilled(this._value)
                }
            })
        }

    }

    reject<T extends any>(reason?: T) {
        if (this._state === STATE_PENDING) {
            queueMicrotask(() => {
                if (this._state !== STATE_PENDING) return
                this._state = STATE_REJECTED
                // 只有当状态是在等待状态的时候
                this._reason = reason
                for (let onRejected of this._onRejecteds) {
                    onRejected(this._reason)
                }

            })
        }
    }

    then(onFulfilled: Function, onRejected?: Function) {
        // err这个参数是在执行这个函数的时候传进来的
        // 当没有在.then方法处理异常 就创建个函数当作是在点.then里面处理的异常给catch
        onRejected = onRejected || ((err:any) => {
            throw err
        })
            // 其实这个就是实现finally
        onFulfilled = onFulfilled || ((value:any)=>value)

        // .then的链式调用
        let newPromise:MyPromise = new MyPromise((resolve, reject) => {
            // 判断如果状态已经发生改变了就立即去执行，为了避免在宏任务下.then的回调函数还没添加
            if (this._state === STATE_FULFILLED && onFulfilled) {
                exceptionHandling(resolve, reject, onFulfilled, this._value)
            } else if (this._state === STATE_REJECTED && onRejected) {
                exceptionHandling(resolve, reject, onRejected, this._reason)
            }

            if (this._state === STATE_PENDING) {
                // 成功的回调和失败的加入数组,
                // 拿到上一个.then的返回值 继续resolve
                if (onFulfilled) this._onFulfilleds.push(() => {
                    if (newPromise._state === STATE_PENDING) exceptionHandling(resolve, reject, onFulfilled, this._value)

                })
                if (onRejected) this._onRejecteds.push(() => {
                    if (newPromise._state === STATE_PENDING)  exceptionHandling(resolve, reject, (onRejected as  Function), this._reason)
                })
            }
        })
        return newPromise

    }

    catch(onRejected: Function) {
        return this.then((undefined as any), onRejected)
    }

    finally(onFinally:Function){
        return this.then(()=>{
            onFinally()
        },()=>{
            onFinally()
        })
    }
     static resolve(value:any){
        return new MyPromise((resolve => resolve(value)))
    }

    static reject(reason:any){
        return new MyPromise((_resolve, reject)=>reject(reason))
    }

    static all(promiseArr:Array<MyPromise>){
       return new MyPromise((resolve, reject)=>{
               const values:Array<MyPromise> =[]
                   // 依次执行里面的promise
                promiseArr.forEach((promise)=>{
                     promise.then((res:any)=>{
                         values.push(res)
                         // 判断执行完的promise长度的值是否跟传进来的数组相同 如果相同那就是执行完了
                         if (values.length === promiseArr.length){
                             resolve(values)
                         }
                     },(err:any)=>{
                         // 如果出现一个错误，这里就会捕获到直接让这个reject拒绝出去
                          reject(err)
                     })
                })
        })
    }

    static allSettled(promiseArr:Array<MyPromise>){
        return new MyPromise((resolve, _reject)=>{
            const values:Array<any> =[]
              promiseArr.forEach((promise)=>{
                     promise.then((res:any)=>{
                          values.push({state:STATE_FULFILLED,value:res})
                         if (values.length === promiseArr.length){
                             resolve(values)
                         }
                     },(err:any)=>{
                         // 这个方法不管promise会不会出现拒绝都会添加进去，所以只会出去resolve
                         values.push({state:STATE_REJECTED,value:err})
                         if (values.length === promiseArr.length){
                             resolve(values)
                         }
                     })
              })

        })
    }

    static race(promiseArr:Array<MyPromise>){
       return new MyPromise((resolve, reject)=>{
           promiseArr.forEach((promise)=>{
               // 有结果立马返回
                   promise.then((res:any)=>{
                       resolve(res)
                   },(err:any)=>{
                       reject(err)
                   })
           })
       })
    }

    static any(promiseArr:Array<MyPromise>){
        return new MyPromise((resolve, reject)=>{
            const values:Array<any> =[]
            promiseArr.forEach((promise)=>{
                // 有结果立马返回
                promise.then((res:any)=>{
                   resolve(res)
                },(err:any)=>{
                    // 如果全部错就把所有错误问题返回
                    values.push(err)
                    if (values.length === promiseArr.length){
                        reject(new Error(values.toString()))
                    }
                })
            })
        })

    }

}
