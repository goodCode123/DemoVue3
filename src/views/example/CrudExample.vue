<template>
  <el-card style="max-width: 100vw;max-height: 70%;">
    <template #header>
      CRUD範例
    </template>
    <div>
      <p>
        <vxe-button status="primary" icon="vxe-icon-add" style="margin-bottom: 10px;" @click="addEvent">新增</vxe-button>
      </p>

      <vxe-table border :row-config="{ isCurrent: true, isHover: true }" show-overflow :data="tableData">
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="name" title="Name"></vxe-column>
        <vxe-column field="sex" title="Sex"></vxe-column>
        <vxe-column field="age" title="Age"></vxe-column>
        <vxe-column title="操作" width="100">
          <template #default="{ row }">
            <vxe-button mode="text" status="primary" icon="vxe-icon-edit" @click="editRow(row)">编辑</vxe-button>
          </template>
        </vxe-column>
      </vxe-table>

      <vxe-modal resize destroy-on-close show-footer show-confirm-button show-cancel-button v-model="showEditPopup"
        :title="selectRow ? '编辑' : '新增'" width="60vw" height="60vh" :loading="loading" @confirm="confirmEvent">
        <vxe-form ref="formRef" v-bind="formOptions"></vxe-form>
      </vxe-modal>
    </div>
  </el-card>
</template>


<script setup>
import { reactive, ref } from 'vue'
import { VxeUI } from 'vxe-pc-ui'
import XEUtils from 'xe-utils'
const formRef = ref()
const showEditPopup = ref(false)
const loading = ref(false)
const selectRow = ref()
const defaultData = {
  id: null,
  name: '',
  nickname: '',
  role: '',
  sex: '',
  age: null,
  address: ''
}
const sexItemRender = reactive({
  name: 'VxeSelect',
  options: [
    { label: '女', value: 'Women' },
    { label: '男', value: 'Man' }
  ],
  props: {
    placeholder: '請選擇' // 設置占位符
  }
})
const formOptions = reactive({
  titleWidth: 80,
  titleAlign: 'right',
  titleColon: true,
  data: XEUtils.clone(defaultData, true),
  rules: {
    name: [
      { required: true, message: '請輸入名稱' },
      { min: 3, max: 5, message: '長度在 3 到 5 個字符' }
    ],
    sex: [
      { required: true, message: '請選擇性別' }
    ],
    age: [
      { required: true, message: '請輸入年齡' }
    ]
  },
  items: [
    { field: 'name', title: '名稱', span: 12, itemRender: { name: 'VxeInput' } },
    { field: 'nickname', title: '暱稱', span: 12, itemRender: { name: 'VxeInput' } },
    { field: 'sex', title: '性别', span: 12, itemRender: sexItemRender },
    { field: 'age', title: '年齡', span: 12, itemRender: { name: 'VxeNumberInput' } },
    { field: 'address', title: '地址', span: 24, itemRender: { name: 'VxeTextarea', props: { autosize: { minRows: 2, maxRows: 4 } } } }
  ]
})
const tableData = ref([
  { id: 10001, name: 'Test1', nickname: '', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
  { id: 10002, name: 'Test2', nickname: 'Test 2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
  { id: 10003, name: 'Test3', nickname: '', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10004, name: 'Test4', nickname: 'Test 4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },


])
const addEvent = () => {
  selectRow.value = undefined
  formOptions.data = XEUtils.clone(defaultData, true)
  showEditPopup.value = true
}
const editRow = (row) => {
  selectRow.value = row
  formOptions.data = Object.assign(XEUtils.clone(defaultData, true), row)
  showEditPopup.value = true
}
const confirmEvent = async () => {
  const $form = formRef.value
  if ($form) {
    const errMap = await $form.validate()
    if (!errMap) {
      showEditPopup.value = false
      VxeUI.modal.message({ content: '保存成功', status: 'success' })
    }
  }
}
</script>

<style scoped>
.mb-3 {
  margin-bottom: 15px;
}
</style>
