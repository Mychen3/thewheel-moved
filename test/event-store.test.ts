import {it, describe} from 'vitest'
import EventStore from "../src/event-store/index";


describe('hallo event-store',()=>{



    it("初次调用", ()=> {
              const eventStore:EventStore= new EventStore({
                  state:{
                       test:1
                  },
              })
             eventStore.onState('test',(res:any)=>{
                 console.log(res)
             })
      });

})


