//封装倒计时逻辑函数
import {ref,computed,onUnmounted} from 'vue'
import dayjs from 'dayjs'
export const useCountDown =()=>{
    //1.响应式的数据
    const time=ref(0)
    let timer=null
    //格式化时间
    const formatTime=computed(()=>dayjs.unix(time.value).format('m分ss秒'))
    //2.开启倒计时的函数
    const start = (currentTime)=>{
        //开启倒计时的逻辑
        //核心逻辑的编写：每隔1秒就减1
        time.value= currentTime
        setInterval(()=>{
            time.value--
        },1000)
    }
    //组件销毁时清除定时器
    onUnmounted(()=>{
        timer&&clearInterval(timer)
    })
    return{
        formatTime,
        start

   }

}