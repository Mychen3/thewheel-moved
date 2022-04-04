interface IManFn {
    resolve<T extends any>(value?: T): void;

    reject<T extends any>(reason?: T): void;
}


interface IMyPromise extends IManFn {
    then(onFulfilled: any, onRejected: any): void
}

const STATE_PENDING: string = 'pending'
const STATE_FULFILLED: string = 'fulfilled'
const STATE_REJECTED: string = 'rejected'


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
        }catch (e) {
            this.reject(e)
        }
    }

    resolve<T extends any>(value?: T) {

        if (this._state === STATE_PENDING) {
            // 微任务，如果不加微任务的话，.then传进来的函数是还没赋值的，导致this._onFulfilled是个undefined
            queueMicrotask(() => {
                this._state = STATE_FULFILLED
                // 只有当状态是在等待状态的时候
                this._value = value
                for(let onFulfilled of this._onFulfilleds){
                    onFulfilled(this._value)
                }
            })
        }

    }

    reject<T extends any>(reason?: T) {
        if (this._state === STATE_PENDING) {
            queueMicrotask(() => {
                this._state = STATE_REJECTED
                // 只有当状态是在等待状态的时候
                this._reason = reason
                for(let onRejected of this._onRejecteds){
                    onRejected(this._reason)
                }

            })
        }
    }

    then(onFulfilled: Function, onRejected: Function) {
        // 判断如果状态已经发生改变了就立即去执行，为了避免在宏任务下.then的回调函数还没添加
         if (this._state === STATE_FULFILLED && onFulfilled){
             onFulfilled(this._value)
         }else if (this._state === STATE_REJECTED && onRejected){
             onRejected(this._reason)
         }


         if (this._state === STATE_PENDING){
             // 成功的回调和失败的加入数组
             this._onFulfilleds.push(onFulfilled)
             this._onRejecteds.push(onRejected)
         }
    }
}
