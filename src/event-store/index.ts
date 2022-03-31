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
    onState(stateKey:string,stateCallback:Function):void;
    dispatch<T extends any[]>(actionName:string,args:T):void;
    setState(stateKey:string, stateValue:any):void;
    offState(stateKey:string):void
}

class EventStore implements IEventStore{
    private state: State | any;
    private eventBus: EventBus;
    private actions: actions ;
   
     constructor(options:IOptions) {
              // 先判断是否是object类型
            if (!(Object.prototype.toString.call(options.state) === '[object Object]')as boolean) {
                throw new TypeError("the state must be object type")
            }
             if (options.actions && Object.prototype.toString.call(options.actions) === '[object Object]'){
                 this.actions = options.actions
             }
         // 设置proxy代理来发布事件
         this.state = this.observe(options.state)
          // 创建事件总线
            this.eventBus = new EventBus()

     }
    setState(stateKey:string,stateValue:any){
        this.state[stateKey] =  stateValue
    }

    observe(state:State){
        let _this:EventStore = this
        return new Proxy(state,{
               get(target: State, key: string): any {
                    return Reflect.get(target,key)
               },
               set(target: State, key: string, newValue: any): any {
                   // 先判断是否是老值
                   if (Reflect.get(target,key) === newValue) return Reflect.get(target,key)

                   //  判断事件对象里是否有该值，不然取消offState 是不能发布事件了
                   //  每次设置值的时候都会触发set 发布事件 emit
                   if (_this.eventBus.ifEventObject.call(_this.eventBus,key)) _this.eventBus.emit(key,newValue)
                    return  Reflect.set(target,key,newValue)
            }
        })
    }

    onState(stateKey:string,stateCallback:Function){
        // const keys = Object.keys(this.state)

        //  订阅该事件
        this.eventBus.on(stateKey,stateCallback)

        // 下面俩行代码也是为了监听立即返回一次
        const value = this.state[stateKey]
        // 修改this指向,把要获取的值通过回调参数传过去
        stateCallback.call(this.state, value)
    }
    offState(stateKey:string){
        this.eventBus.clear(stateKey)
    }
    dispatch<T extends any[]>(actionName:string, ...args:T){

         const actionFn:Function = this.actions[actionName]
           // 这了的参数就相当于vuex的上下文
           actionFn.apply(this,[ this.state,...args])
    }
}

export default EventStore