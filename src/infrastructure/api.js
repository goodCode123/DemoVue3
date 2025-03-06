// api.js
import axios from 'axios';
import { VxeUI } from 'vxe-pc-ui'
import { ElLoading } from 'element-plus';
import {jwtDecode} from 'jwt-decode';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 儲存路由實例
let router = null;

let loadingInstance = null;

export const setRouter = (routerInstance) => {
  router = routerInstance;
};

// 創建一個 axios 實例
const apiClient = axios.create({
  baseURL: apiBaseUrl, // 基礎 URL
  timeout: 10000, // 超時時間
  headers: {
    'Content-Type': 'application/json', // 默認為 JSON
  },
});

// 請求攔截器：可以添加 token 或其他通用請求配置
apiClient.interceptors.request.use(
  (config) => {
    loadingInstance = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)', // 半透明背景
    });
    const token = localStorage.getItem('usertoken'); // 從 localStorage 獲取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 如果有 token，添加到請求頭
    }
    return config;
  },
  (error) => {
    if (loadingInstance) loadingInstance.close(); // 發生錯誤時關閉 loading
    return Promise.reject(error);
  }
);

// 響應攔截器：統一處理響應錯誤
apiClient.interceptors.response.use(
  (response) => {
    if (loadingInstance) loadingInstance.close(); // 成功響應後關閉 loading
    return response.data; // 返回 Data 層   
  },
  async (error) => {
    if (loadingInstance) loadingInstance.close(); // 發生錯誤時關閉 loading
    if (error.response?.status == "403") {
      VxeUI.modal.message({
        content: '沒有網頁權限',
        status: 'error'
      });

      router.push('/login');
    }
    if (error.response?.status == "401") {
      const originalRequest = error.config; // 保存原始請求
      const payload = jwtDecode(localStorage.getItem("usertoken"));
      var result =  await post('RefreshToken/SetRefreshToken',JSON.stringify(payload.Id));
      if(result.Code == "200")
      {
        localStorage.setItem('usertoken', result.Data)
        originalRequest.headers.Authorization = `Bearer ${result.Data}`;
        return apiClient.request(error.config)
      }
      VxeUI.modal.message({
        content: '沒有網頁權限',
        status: 'error'
      });

      router.push('/login');
    }
    else {
      VxeUI.modal.message({
        content: '系統異常、請聯繫管理員',
        status: 'error'
      });
    }
    
    return Promise.reject(error);
  }
);

// 具名匯出 API 請求方法
export const get = (path, params = {}) => {
  return apiClient.get(path, { params });
};

export const post = (path, data) => {
  return apiClient.post(path, data);
};

export const put = (path, data) => {
  return apiClient.put(path, data);
};

export const del = (path) => {
  return apiClient.delete(path);
};
