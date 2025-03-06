<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
            {{ item }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { sideBar } from '@/stores/sideBar';
const sideBarPinna = sideBar();
const { meaulistAPI, getSideBar } = sideBarPinna;
const route = useRoute();
const breadcrumb = ref([]);
onMounted(async () => {
    await getSideBar();
});

onMounted(async () => {
    breadcrumb.value = generateBreadcrumb(route.fullPath);
});

watch(
    () => route.fullPath,
    (newPath) => {
        breadcrumb.value = generateBreadcrumb(newPath);
    }
);

function generateBreadcrumb(fullpath) {
    const menu = meaulistAPI || [];
    const breadcrumb = [];
    function findPath(menuItems, currentPath, currentBreadcrumb) {
        for (const item of menuItems) {
            const newBreadcrumb = [...currentBreadcrumb, item.Title];
            if (item.Url === currentPath) {
                breadcrumb.push(...newBreadcrumb);
                return true;
            }
            if (item.Children && findPath(item.Children, currentPath, newBreadcrumb)) {
                return true;
            }
        }
        return false;
    }
    if (fullpath === "/") {
        return ["首頁"];
    }
    findPath(menu, fullpath, []);
    return breadcrumb;
}
</script>
