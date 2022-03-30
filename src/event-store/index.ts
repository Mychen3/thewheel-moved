import EventBus from "../event-bus";

interface actions {
    [key:string]:Function
}

type State = {[key:string]:any}

interface IOptions{
    actions?:actions
    state:State
}

interface IEventStore {
    observe(state:State):void;
    onState(statekey:string,stateCallback:Function):void
}

class EventStore implements IEventStore{
    private state: State;
    private eventBus: EventBus;

     constructor(options:IOptions) {
              // 先判断是否是object类型
            if (!(Object.prototype.toString.call(options.state) === '[object Object]')as boolean) {
                throw new TypeError("the state must be object type")
            }
            this.state = options.state
          // 创建事件总线
            this.eventBus = new EventBus()
         // 设置proxy代理来发布事件
           this.observe(this.state)

     }
    observe(state:State){
        let _this:EventStore = this
         new Proxy(state,{
               get(target: State, key: string): any {
                    return Reflect.get(target,key)
               },
               set(target: State, key: string, newValue: any): any {
                   // 先判断是否是老值
                   if (Reflect.get(target,key) === newValue) return Reflect.get(target,key)
                   // 每次设置值的时候都会触发set 发布事件 emit
                   _this.eventBus.emit(key,newValue)
            }
        })
    }

    onState(stateKey:string,stateCallback:Function){
        // const keys = Object.keys(this.state)
        this.eventBus.on(stateKey,stateCallback)

        const value = this.state[stateKey]
        // 修改this指向,把要获取的值通过回调参数传过去
        stateCallback.call(this.state, value)
    }
}

export default EventStore