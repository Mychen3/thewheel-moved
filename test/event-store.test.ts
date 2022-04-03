import {it, describe} from 'vitest'
import EventStore from "../src/event-store/index";


describe('hallo event-store',()=>{

    it.skip("初次调用", ()=> {
              const eventStore:EventStore= new EventStore({
                  state:{
                       test:1
                  },
              })
             eventStore.onState('test',(res:any)=>{
                 console.log(res)
             })
      });

    it("dispatch 调用", ()=> {
        const eventStore:EventStore= new EventStore({
            state:{
                test:"来咯",
                name: "chen",
            },
            actions:{
                getStateTest(ctx:any){
                      ctx.test = "修改了"
                }
            }
        })
        eventStore.onState('test',(res:any)=>{
            console.log('监听test',res)
        })
        // eventStore.dispatch('getStateTest')

        eventStore.onState('name',(res:any)=>{
            console.log('监听name',res)
        })

        eventStore.offState("name")
        eventStore.setState("name", ["kobe", "james"])
        eventStore.setState("test", '我又改了')
        eventStore.setState("name", '改不成功嘛')

    });





})


