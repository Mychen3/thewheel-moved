import {it, describe,expect} from 'vitest'
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


    it.skip('clear 取消订阅',  ()=> {
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

    it.skip('只订阅一次',  ()=> {

        const eventBus = new EventBus()
        // 订阅事件
        eventBus.subscribe('eventTest1',(param:number)=>{
            console.log('我订阅1',param)
        })
        eventBus.subscribeOnce('eventTest1',(param:number)=>{
            console.log('我只订阅一次',param)
        })
        eventBus.subscribe('eventTest1',(param:number)=>{
            console.log('我订阅3',param)
        })

        eventBus.publish("eventTest1",66)

        eventBus.publish("eventTest1",66)
    });


    it.skip('清除某个事件或者所有事件',  ()=> {

        const eventBus = new EventBus()
        // 订阅事件
        eventBus.subscribe('eventTest1',(param:number)=>{
            console.log('我订阅1',param)
        })
        eventBus.subscribe('eventTest1',(param:number)=>{
            console.log('我订阅2',param)
        })
        eventBus.subscribe('eventTest1',(param:number)=>{
            console.log('我订阅3',param)
        })

        eventBus.publish("eventTest1",66)
        eventBus.clear()

        eventBus.publish("eventTest1",66)
    });

    it('实现单例模式', ()=> {

        const eventBus = EventBus.getEventBus()
        const eventBus1 = EventBus.getEventBus()

        expect(Object.is(eventBus, eventBus1)).toBe(true)


    });

})


