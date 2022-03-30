 interface ICallbackObject {
    [id:string]:Function
 }

  interface IEventObject {
    [eventName:string]:ICallbackObject
  }

  interface IEventBus {
    publish<T extends any[]>(eventName: string, args: T): void;
    subscribe(eventName:string,callback:Function):{unSubscribe:Function};
  }

  class EventBus implements IEventBus {
       private _eventObject:IEventObject;
       private _callbackId:number

      constructor() {
          this._eventObject = {}
          this._callbackId = 0
      }

     // 订阅事件
    subscribe(eventName:string,callback:Function):{unSubscribe:Function} {

        // 先初始化事件，先判断是否有该事件
        if (!this._eventObject[eventName]) {
            // 使用对象存储，注销回调函数的时候提高删除的效率
            this._eventObject[eventName] = {}
        }

        // 设置回调函数唯一id
        let id: number = this._callbackId++

        // 存储订阅者的回调函数
        // callbackId使用后需要自增，供下一个回调函数使用
        this._eventObject[eventName][id] = callback

        // 每一次订阅事件 也会生成取消订阅的函数
        const unSubscribe = () => {

         delete this._eventObject[eventName][id];

           // 如果这个事件没有订阅者了，也把整个事件对象清除
             if (Object.keys(this._eventObject[eventName]).length === 0){
                   delete this._eventObject[eventName]
             }
        };
        return {unSubscribe}
    }


    // 发布事件
    publish<T extends any[]>(eventName:string,...args:T){
      // 取出当前事件所有的回调函数obj
          const callBackObject = this._eventObject[eventName]

           // 边缘case 如果没有当前列表
           if (!callBackObject) {
             throw new TypeError("no current callback")
           }

           // 然后去执行每一个回调函数
         for (let id in callBackObject){
               callBackObject[id](...args)
         }
    }
  }

  export default EventBus