import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { get } from "@/infrastructure/api";
import { jwtDecode } from 'jwt-decode';

export const sideBar = defineStore('sideBar', () => {
    const meaulistAPI = reactive([]); // 側邊欄數據

    async function getSideBar() {
        try {
            const payload = jwtDecode(localStorage.getItem("usertoken"));
            const result = await get('/LayOut/GetSideBarMeauList', { Id: payload.Id });
            if (result && result.Data) {
                meaulistAPI.splice(0, meaulistAPI.length, ...result.Data);             
                localStorage.setItem('menu', JSON.stringify(meaulistAPI)); // 更新本地存儲
            } else {
                console.error('側邊欄數據無效', result);
            }
        } catch (error) {
            console.error('側邊欄讀取失敗', error);
        }
    }

    function setToken(value) {
        localStorage.setItem('menu', value); // 設置 menu
    }

    return { meaulistAPI, getSideBar, setToken };
});
