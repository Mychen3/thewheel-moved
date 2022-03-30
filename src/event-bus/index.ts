interface ICallbackObject {
    [id: string]: Function
}

interface IEventObject {
    [eventName: string]: ICallbackObject
}

interface IEventBus {
    emit<T extends any[]>(eventName: string, args: T): void;

    on(eventName: string, callback: Function): { unOn: Function };

    Once(eventName: string, callback: Function): { unOn: Function };

    clear(eventName?: string): void
}

class EventBus implements IEventBus {
    private _eventObject: IEventObject;
    private _callbackId: number
    private static instance: EventBus;
    private _flagOnce: boolean

    constructor() {
        this._eventObject = {}
        this._callbackId = 0
        this._flagOnce = false
    }

    // 实现单例模式
    static getEventBus() {
        // 判断是否已经new过1个实例
        if (!EventBus.instance) {
            EventBus.instance = new EventBus()
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return EventBus.instance
    }

    // 订阅事件 on
    on(eventName: string, callback: Function): { unOn: Function } {

        // 先初始化事件，先判断是否有该事件
        if (!this._eventObject[eventName]) {
            // 使用对象存储，注销回调函数的时候提高删除的效率
            this._eventObject[eventName] = {}
        }
        // 设置回调函数唯一id
        // callbackId使用后需要自增，供下一个回调函数使用
        let id: string | number

        if (this._flagOnce) {
            // callbackId使用后需要自增，供下一个回调函数使用
            id = "d" + this._callbackId++
        } else {
            id = this._callbackId++
        }


        // 存储订阅者的回调函数
        this._eventObject[eventName][id] = callback

        // 每一次订阅事件 也会生成取消订阅的函数
        const unOn = () => {

            delete this._eventObject[eventName][id];

            // 如果这个事件没有订阅者了，也把整个事件对象清除
            if (Object.keys(this._eventObject[eventName]).length === 0) {
                delete this._eventObject[eventName]
            }
        };
        return {unOn}
    }

    // 只订阅一次
    Once(eventName: string, callback: Function): { unOn: Function } {
        // 修改只订阅一次的标记
        this._flagOnce = true
        const {unOn} = this.on(eventName, callback)
        this._flagOnce = false
        return {unOn}
    }

    // 发布事件 emit
    emit<T extends any[]>(eventName: string, ...args: T) {
        // 取出当前事件所有的回调函数obj
        const callBackObject = this._eventObject[eventName]

        // 边缘case 如果没有当前列表
        if (!callBackObject) {
            throw new TypeError("no current callback")
        }

        // 然后去执行每一个回调函数
        for (let id in callBackObject) {
            callBackObject[id](...args)

            // 只订阅一次的回调函数需要删除
            if (id[0] === "d") {
                delete callBackObject[id]
            }
        }
    }

    // 清除某个事件或者所有事件
    clear(eventName?: string) {
        // 如果没有传eventName默认全部清除
        if (!eventName) {
            this._eventObject = {};
            return
        }
        delete this._eventObject[eventName]

    }
}

export default EventBus