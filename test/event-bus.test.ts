import {it, describe} from 'vitest'
import EventBus from '../src/event-bus/index'

describe('hallo eventBus',()=>{

    it.skip('simple eventBus ',  ()=> {
            const eventBus = new EventBus()
            // 订阅事件
           eventBus.subscribe('eventTest1',(param:number)=>{
               console.log('打印出来了1',param)
           })
           eventBus.subscribe('eventTest1',(param:number)=>{
               console.log('打印出来了2',param)
           })
              eventBus.publish("eventTest1",66)
    });


    it('clear 取消订阅',  ()=> {
        const eventBus = new EventBus()
        // 订阅事件
        eventBus.subscribe('eventTest1',(param:number)=>{
            console.log('我订阅1',param)
        })
        let  subscriber2 = eventBus.subscribe('eventTest1',(param:number)=>{
            console.log('我订阅2',param)
        })
        eventBus.subscribe('eventTest1',(param:number)=>{
            console.log('我订阅3',param)
        })

        // 我这边就取消订阅了
        subscriber2.unSubscribe()

        eventBus.publish("eventTest1",66)
    });

})


