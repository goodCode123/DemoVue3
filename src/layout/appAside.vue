<template>
    <el-aside width="auto">
        <el-scrollbar>
            <el-menu router active-text-color="rgb(115.2, 117.6, 122.4)" :collapse="isCollapse"
                background-color="rgb(232.8, 233.4, 234.6)" unique-opened>
                <div class="logo-container">
                    <img src="/src/assets/logo.svg" class="logo-image" />
                    <h1 v-show="!isCollapse">Jim_測試專案</h1>
                </div>
                <template v-for="menu, index in meaulistAPI" :key="index">
                    <el-sub-menu v-if="menu.Children" :index="menu.Url">
                        <template #title>
                            <el-icon>
                                <component :is="menu.Icon" /> <!-- 动态生成图标 -->
                            </el-icon>
                            <span>{{ menu.Title }}</span>
                        </template>
                        <el-menu-item v-for="child in menu.Children" :key="child.index" :index="child.Url">
                            <el-icon>
                                <component :is="child.Icon" />
                            </el-icon>
                            {{ child.Title }}
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item v-else :index="menu.Url">
                        <el-icon>
                            <component :is="menu.Icon" />
                        </el-icon>
                        <span>{{ menu.Title }}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-scrollbar>
    </el-aside>
</template>

<script setup>
import { isCollapse } from './isCollapse';
import { sideBar } from '@/stores/sideBar';
import { storeToRefs } from 'pinia';
const sideBarPinna = sideBar();
const { meaulistAPI  } = storeToRefs(sideBarPinna);
</script>

<style scoped>
.el-menu {
    height: 100vh;
    width: 200px;
    border-right: none;
    &.el-menu--collapse {
        width: 60px;
    }
}

.logo-container {
    display: flex;
    flex-direction: column;
    /* 子元素上下排列 */
    justify-content: center;
    align-items: center;
    height: 60px;
}

.logo-image {
    width: 30px;
    height: 30px;
}

.el-sub-menu.is-opened,
.el-sub-menu.is-opened .el-sub-menu__title {
    width: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
</style>
