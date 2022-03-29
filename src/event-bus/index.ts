 type ICallbackList = Array<Function>

  interface IEventObject {
    [eventName:string]:ICallbackList
  }

  interface IEventBus {
    publish<T extends any[]>(eventName: string, args: T): void;
    subscribe(eventName:string,callback:Function):void;
  }

  class EventBus implements IEventBus {
       private _eventObject:IEventObject;

      constructor() {
          this._eventObject = {}
      }

     // 订阅事件
    subscribe(eventName:string,callback:Function){

        // 先初始化事件，先判断是否有该事件
      if (!this._eventObject[eventName]) {
        // 使用对象存储，注销回调函数的时候提高删除的效率
        this._eventObject[eventName] = []
      }
      this._eventObject[eventName].push(callback)
    }

    // 发布事件
    publish<T extends any[]>(eventName:string,...args:T){
      // 取出当前事件所有的回调函数list
          const callBackList:Array<Function> = this._eventObject[eventName]

           // 边缘case 如果没有当前列表
           if (!callBackList) {
             throw new TypeError("no current callback")
           }

           // 然后去执行每一个回调函数
         for (let callBack of callBackList){
               callBack(args)
         }
    }
  }

  export default EventBus