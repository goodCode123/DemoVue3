<template>
  <el-header>
    <!-- 縮放圖示 -->
    <el-icon size="25" @click="isCollapse = !isCollapse">
      <IEpExpand v-if="isCollapse" />
      <IEpFold v-if="!isCollapse" />
    </el-icon>
    <!-- 麵包屑 -->
    <Breadcrumb></Breadcrumb>
    <!-- 下拉選單 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <!-- <el-avatar :size="40" :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" /> -->
        <el-avatar :size="40" :src="circleUrl" />
        <el-icon class="el-icon--right">
          <IEparrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>用戶資訊</el-dropdown-item>
          <el-dropdown-item divided @click="dialogVisible = true">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>

  <el-dialog v-model="dialogVisible" title="登出確認" width="500">
    <span>確定登出嗎</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="() => { logout(); dialogVisible = false; }">
          確定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { isCollapse } from './isCollapse'
import { useRouter  } from 'vue-router';
import { ref } from 'vue';
import { token } from '@/stores/token';
import { sideBar } from '@/stores/sideBar';
import Breadcrumb from '@/layout/Breadcrumb.vue'
import {jwtDecode} from 'jwt-decode';

// const circleUrl = ref(new URL('@/assets/image.jpg', import.meta.url).href);
const circleUrl = ref(new URL('@/assets/image.jpg', import.meta.url).href);
const { proxy } = getCurrentInstance();
const dialogVisible = ref(false)
const router = useRouter();
const usertoken = token();
const usersideBar = sideBar();
const logout =async() => {
  const payload = jwtDecode(localStorage.getItem("usertoken"));
  await proxy.$post('/Login/Logout', JSON.stringify(payload.Id));
  usertoken.setToken('');
  usersideBar.setToken('');
  router.push('/login')
}
</script>
<style scoped>
.el-header {
  display: flex;
  align-items: center;
  background-color: rgb(221.7, 222.6, 224.4);
}

.el-dropdown {
  margin-left: auto;

  .el-dropdown-link {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.el-icon {
  margin-right: 15px;
}
</style>