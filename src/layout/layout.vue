<script setup>
import appAside from "./appAside.vue"
import appHeader from "./appHeader.vue";
import { RouterView } from 'vue-router'

</script>

<template>
  <div class="common-layout">
    <el-container>
      <appAside />
      <el-container class="header-and-min">
        <appHeader ></appHeader>
        <el-main>
          <el-scrollbar>
            <RouterView />
          </el-scrollbar>        
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.header-and-min {
  flex-direction: column;
  height: 100vh;
}

.el-main{
  background-color: rgb(243.9, 244.2, 244.8);
  padding-right: 0;
}

</style>