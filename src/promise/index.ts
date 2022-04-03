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
    private _onFulfilled: Function | any;
    private _onRejected: Function | any;


    constructor(executor: (resolve: IManFn["resolve"], reject: IManFn["reject"]) => void) {
        // 默认是等待状态
        this._state = STATE_PENDING
        // 传进来的值
        this._value = undefined
        //传进来的错误值
        this._reason = undefined
        // .then传进来的函数
        this._onFulfilled = undefined
        // .catch传进来的函数
        this._onRejected = undefined

        // 进来就直接掉用
        executor(this.resolve.bind(this), this.reject.bind(this))
    }


    resolve<T extends any>(value?: T) {

        if (this._state === STATE_PENDING) {
            this._state = STATE_FULFILLED
            // 微任务，如果不加微任务的话，.then传进来的函数是还没赋值的，导致this._onFulfilled是个undefined
            queueMicrotask(() => {
                // 只有当状态是在等待状态的时候
                this._value = value
                this._onFulfilled(this._value)
            })
        }

    }

    reject<T extends any>(reason?: T) {
        if (this._state === STATE_PENDING) {
            this._state = STATE_REJECTED
            queueMicrotask(() => {
                // 只有当状态是在等待状态的时候
                this._reason = reason
                this._onRejected(this._reason)

            })
        }
    }

    then(onFulfilled: Function, onRejected: Function) {
        this._onFulfilled = onFulfilled
        this._onRejected = onRejected
    }



}
