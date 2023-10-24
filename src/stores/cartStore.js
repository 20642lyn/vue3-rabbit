import { defineStore } from 'pinia'
import { ref, computed, useSSRContext } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, findNewCartListAPI, delCartAPI } from '@/apis/cart'
export const useCartStore = defineStore('cart', () => {
    //1.定义state-cartList
    const cartList = ref([])
    const updateNewList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token)
    //2.添加购物车操作
    const addCart = async (goods) => {
        const { skuId, count } = goods
        if (isLogin.value) {
            //登录之后加入购物车逻辑
            await insertCartAPI({ skuId, count })
            updateNewList()
        } else {
            //添加购物车操作
            //已添加 count+1
            //未添加 直接push
            //思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到就是已添加
            const item = cartList.value.find((item) => goods.skuId === item.skuId)
            if (item) {
                //找到了
                item.count++
            } else {
                cartList.value.push(goods)
            }
        }

    }

    //3.删除商品
    const delCart = async (skuId) => {
        if (isLogin.value) {
            //调用接口实现购物车删除功能
            await delCartAPI([skuId])
            updateNewList()
        } else {
            const idx = cartList.value.findIndex((item) => skuId === item.skuId)
            cartList.value.splice(idx, 1)
        }

    }
    //退出登录清空购物车
    const clearCart=()=>{
        cartList.value=[]
    }
    //单选功能
    const singleCheck = (skuId, selected) => {
        const item = cartList.value.find((item) => skuId === item.skuId)
        item.selected = selected
    }
    //计算属性
    //1.总的数量
    const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    //2.总价
    const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))

    //3.单选决定全选
    const isAll = computed(() => cartList.value.every((item) => item.selected))
    //4.一键全选
    const allCheck = (selected) => {
        cartList.value.forEach(item => item.selected = selected)
    }

    //5.已选的数量
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
    //6.已选的商品总价
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))
    return {
        cartList,
        allCount,
        allPrice,
        isAll,
        selectedCount,
        selectedPrice,
        addCart,
        delCart,
        singleCheck,
        allCheck,
        clearCart,
        updateNewList

    }
}, {
    persist: true,
})