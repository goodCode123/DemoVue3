import { createRouter, createWebHistory } from 'vue-router';
import layoutView from '@/layout/layout.vue';
import IndexView from '@/views/IndexView.vue';
import ErrorView from '@/components/ErrorView.vue';
import LoginView from '@/views/login/LoginView.vue';
import Error403View from '@/components/Error403View.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layoutView,
      meta: { requiresAuth: true }, // 此路由需要身份驗證
      children: [
        {
          name: 'Home',
          path: '',
          meta: { title: '首頁', breadcrumb: ['首頁'] },
          component: IndexView,
        },
        {
          path: '/BatchUploadExample',
          name: 'BatchUploadExample',
          component: () => import('../views/example/BatchUploadExample.vue'),
          meta: { title: '批次更新資料範例' },
        },
        {
          path: '/CrudExample',
          name: 'CrudExample',
          component: () => import('../views/example/CrudExample.vue'),
          meta: { title: '新增刪除修改範例' },
        },
        {
          path: '/PaginationExample',
          name: 'PaginationExample',
          component: () => import('../views/example/PaginationExample.vue'),
          meta: { title: '分頁範例' },
        },
        {
          path: '/MeauList',
          name: 'MeauList',
          component: () => import('../views/MeauList.vue'),
          meta: { title: '菜單列表' },
        },
        {
          path: '/UserMaster',
          name: 'UserMaster',
          component: () => import('../views/UserMaster.vue'),
          meta: { title: '使用者管理' },
        },
        {
          path: '/GroupMaster',
          name: 'GroupMaster',
          component: () => import('../views/GroupMaster.vue'),
          meta: { title: '群組管理' },
        },
        {
          path: '/GroupMasterDetail/:groupId?/:groupName?/:disable?/:mode',
          name: 'GroupMasterDetail',
          component: () => import('../views/GroupMasterDetail.vue'),
          meta: { title: '使用者修改', requiresAuth: false },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: ErrorView, meta: { requiresAuth: false } },
    { path: '/login', name: 'login', component: LoginView, meta: { requiresAuth: false } },
    { path: '/notFound', name: 'NotFound', component: ErrorView, meta: { requiresAuth: false } },
    { path: '/Error403View', name: 'Error403View', component: Error403View, meta: { requiresAuth: false } },
  ],
});

// 路由守衛
router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem('usertoken') || ''; // 獲取 token
  const menu = localStorage.getItem('menu');
  const menuJson = parseMenu(menu);

  
  // 如果路由不需要身份驗證，直接放行
  if (to.matched.some((record)  => record.meta.requiresAuth === false)) {
    return next();
  }

  // 檢查是否需要身份驗證
  if (!userToken) {
    return redirectToLogin(next, to.fullPath);
  }

  // 檢查是否有權限訪問目標路由
  if (menuJson && !hasPermission(menuJson, to.path)) {
    return redirectToLogin(next, to.fullPath);
  }

  // 放行
  next();
});

// 檢查是否需要身份驗證
function requiresAuth(to) {
  return to.matched.some((record) => record.meta.requiresAuth);
}

// 解析 menu JSON
function parseMenu(menu) {
  try {
    return menu ? JSON.parse(menu) : null;
  } catch (error) {
    console.error('無法解析 menu:', error);
    return null;
  }
}

// 檢查是否有訪問權限
function hasPermission(menuJson, targetUrl) {
  return findUrlInJson(menuJson, targetUrl);
}

// 遞迴查找 URL
function findUrlInJson(jsonArray, targetUrl) {
  for (const item of jsonArray) {
    if (item.Url === targetUrl) {
      return true; // 找到目標 URL
    }
    if (item.Children && item.Children.length > 0) {
      if (findUrlInJson(item.Children, targetUrl)) {
        return true; // 在子節點中找到目標 URL
      }
    }
  }
  return false; // 沒有找到
}

// 重定向到登錄頁面
function redirectToLogin(next, redirectPath) {
  return next({ path: '/login', query: { redirect: redirectPath } });
}

// 重定向到 403 錯誤頁面
function redirectToError403(next, redirectPath) {
  return next({ path: '/Error403View', query: { redirect: redirectPath } });
}

export default router;
