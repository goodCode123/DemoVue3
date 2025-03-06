<template>
   <el-card style="max-width: 1000vw">
    <template #header>批次更新資料範例</template>
    <el-button @click="">上傳檔案</el-button>
    <el-button @click="">批次匯入</el-button>
  <el-table :data="tableData"  @selection-change="handleSelectionChange" >
    <el-table-column type="selection" width="55" :selectable="tableData.id"   />
    <el-table-column prop="date" label="Date" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  </el-card>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
<script setup>
const tableLayout = ref('fixed');
const selectedItems = ref([]); // 儲存已勾選的資料
const handleSelectionChange = (selection) => {
      selectedItems.value = selection; // 更新選中資料
      console.log(selectedItems.value );
    };


const tableData = [
  {
    id : 1,
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
  },
  {
    id : 2,
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois',
  },
  {
    id : 3,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
  },
  {
    id : 4,
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
  },
]
</script>