<script setup>
import { RouterView } from 'vue-router'

import zhTw from 'element-plus/es/locale/lang/zh-tw'; // 引入繁體中文語言包

const locale = zhTw; // 設置繁體中文


</script>

<template>
   <el-config-provider :locale="locale">
    <RouterView />
   </el-config-provider>

</template>

<style scoped>
</style>
