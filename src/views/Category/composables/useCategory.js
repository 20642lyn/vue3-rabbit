// 封装分类数据业务相关代码
import { ref, onMounted} from "vue"
import { getCategoryAPI} from "@/apis/category"
import {onBeforeRouteUpdate, useRoute} from 'vue-router'

export function useCategory(){
const categoryData = ref({})
const route =  useRoute()
//该写法表示一开始如果不传数据则默认等于右边
const getCategory = async (id=route.params.id) =>{
  const res = await getCategoryAPI(id)
  categoryData.value=res.result 
}
onMounted(()=> getCategory())

//目标：路由参数变化的时候，可以把分类数据接口重新发送
onBeforeRouteUpdate((to)=>{
  //存在问题：使用最新的路由参数请求最新的分类数据
  getCategory(to.params.id)
})

return{
    categoryData
}
}