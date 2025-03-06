import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


// ref() 就是 state 属性，computed() 就是 getters，function() 就是 actions
// 參考網址 https://pinia.vuejs.org/zh/core-concepts/
export const token = defineStore('token', () => {
  const usertoken = ref('')
  const refreshToken =ref('')
  function setToken(value) {
    usertoken.value = value; // 正確：修改 ref 的值
    localStorage.setItem('usertoken', value); // 將 token 存入 localStorage
  }

  function setRefreshToken(value) {
    refreshToken.value = value; // 正確：修改 ref 的值
    localStorage.setItem('refreshToken', value); // 將 token 存入 localStorage
  }

   return { usertoken, setToken ,refreshToken ,setRefreshToken }
})
