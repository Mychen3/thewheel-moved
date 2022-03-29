import {it, describe} from 'vitest'
import EventBus from '../src/event-bus/index'

describe('hallo eventBus',()=>{

    it('simple eventBus ',  ()=> {
            const eventBus = new EventBus()
            // 订阅事件
           eventBus.subscribe('eventTest1',(param)=>{
               console.log('打印出来了1',param)
           })
           eventBus.subscribe('eventTest1',(param )=>{
               console.log('打印出来了2',param)
           })
              eventBus.publish("eventTest1",66)

    });
})


