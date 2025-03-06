<template>
    <el-card style="max-width: 100vw" v-loading="loading">
        <template #header>
            <div style="display: flex;">
                <p>分頁範例</p>
                <vxe-button class="button" status="primary" icon="vxe-icon-add" @click="">新增</vxe-button>
                <vxe-button class="button" status="danger" icon="vxe-icon-delete" @click="">刪除</vxe-button>
                <vxe-button class="button" status="primary" icon="vxe-icon-download" @click="">匯出</vxe-button>
            </div>
        </template>
        <div>
            <div style="margin-bottom: 10px; display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 80px;">序號 :</label>
                    <el-input  style="width: 220px" placeholder="Please input" clearable />
                </div>
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 80px;">Date :</label>
                    <el-date-picker
        v-model="value2"
        type="daterange"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        @focus="handleFocus"
       
      />
              
                </div>
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 80px;">Name :</label>
                    <el-select v-model="selectedOption" placeholder="請選擇">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                </div>
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 100px;">是否同意條款</label>
                    <el-checkbox v-model="checked"></el-checkbox>
                </div>
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 80px;">Name :</label>
                    <el-input style="width: 220px" placeholder="Please input" clearable />
                </div>
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 80px;">Name :</label>
                    <el-input  style="width: 220px" placeholder="Please input" clearable />
                </div>
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 80px;">Name :</label>
                    <el-input  style="width: 220px" placeholder="Please input" clearable />
                </div>
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 80px;">Name :</label>
                    <el-input  style="width: 220px" placeholder="Please input" clearable />
                </div>
                <div style="width: 300px; display: flex; align-items: center;">
                    <label style="width: 80px;">Name :</label>
                    <el-input  style="width: 220px" placeholder="Please input" clearable />
                </div>

                <!-- 重複相同模式 -->
            </div>

            <!-- 表格配置 -->
            <vxe-grid v-bind="gridOptions" v-on="gridEvents" :height="gridHeight">
                <!-- 自定義操作列插槽 -->
                <template #actionSlot="{ row }">
                    <vxe-button mode="text" status="primary" icon="vxe-icon-edit" @click="editRow(row)">编辑</vxe-button>
                    <vxe-button mode="text" status="danger" icon="vxe-icon-delete">删除</vxe-button>
                </template>
            </vxe-grid>
        </div>
    </el-card>

    <vxe-modal resize destroy-on-close show-footer show-confirm-button show-cancel-button v-model="showEditPopup"
        :title="selectRow ? '编辑' : '新增'" width="60vw" height="60vh"    @confirm="confirmEvent">
        <vxe-form ref="formRef" v-bind="formOptions"></vxe-form>
    </vxe-modal>
</template>
<style lang="css" scoped>
.button {
    margin-left: auto;
}

label {
    font-size: 14px;
    font-weight: 600;
    /* 加粗 */
    color: #333;
    /* 深色字體 */
}


</style>

<script setup>
import { reactive, ref } from 'vue'
import XEUtils from 'xe-utils'
import { VxeUI } from 'vxe-pc-ui'
const value2 = ref(null);
const selectedOption = ref('');
// 創建選項數據
const options = [
  { value: 'option1', label: '選項一' },
  { value: 'option2', label: '選項二' },
  { value: 'option3', label: '選項三' },
];
const gridHeight = ref(700); // 默認高度
const loading = ref(false);
const formRef = ref()
const showEditPopup = ref(false)
const selectRow = ref()
const checked = ref(false);

const defaultData = {
    id: null,
    name: '',
    nickname: '',
    role: '',
    sex: '',
    age: null,
    address: ''
}

const AllList = [
    { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },
    { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
    { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
    { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'test abc' },
    { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' },
    { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
    { id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
    { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: 'test abc' },
    { id: 10009, name: 'Test9', nickname: 'T9', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' },
    { id: 100010, name: 'Test10', nickname: 'T10', role: 'Develop', sex: 'Man', age: 35, address: 'Guangzhou' },
    { id: 100011, name: 'Test11', nickname: 'T11', role: 'Develop', sex: 'Man', age: 49, address: 'Guangzhou' },
    { id: 100012, name: 'Test12', nickname: 'T12', role: 'Develop', sex: 'Women', age: 45, address: 'Shanghai' },
    { id: 100013, name: 'Test13', nickname: 'T13', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
    { id: 100014, name: 'Test14', nickname: 'T14', role: 'Test', sex: 'Man', age: 29, address: 'Shanghai' },
    { id: 100015, name: 'Test15', nickname: 'T15', role: 'Develop', sex: 'Man', age: 39, address: 'Guangzhou' },
    { id: 100016, name: 'Test16', nickname: 'T16', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
    { id: 100017, name: 'Test17', nickname: 'T17', role: 'Test', sex: 'Man', age: 39, address: 'Shanghai' },
    { id: 100018, name: 'Test18', nickname: 'T18', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
    { id: 100019, name: 'Test19', nickname: 'T19', role: 'Develop', sex: 'Man', age: 39, address: 'Guangzhou' },
    { id: 100020, name: 'Test20', nickname: 'T20', role: 'Test', sex: 'Women', age: 35, address: 'Guangzhou' },
    { id: 100021, name: 'Test21', nickname: 'T21', role: 'Test', sex: 'Man', age: 39, address: 'Shanghai' },
    { id: 100022, name: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
    { id: 100022, name: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
    { id: 100022, name: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
    { id: 100022, name: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
    { id: 100022, name: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
    { id: 100022, name: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
    { id: 100022, name: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' },
    { id: 100022, name: 'Test22', nickname: 'T22', role: 'Develop', sex: 'Man', age: 44, address: 'Guangzhou' }
]
// 前端分页
const handlePageData = () => {
    loading.value = true;
    const { pageSize, currentPage } = gridOptions.pagerConfig
    gridOptions.pagerConfig.total = AllList.length
    gridOptions.data = AllList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    loading.value = false;
}

const gridOptions = reactive({
    showOverflow: true,
    border: true,
    // loading: false,
    autoresize: true, // 啟用自適應
    height: gridHeight,
    pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 15
    },
    highlightHoverRow : true,
    columns: [
        { type: 'seq', minWidth: 40, fixed: 'left', flex: 1 },
        { field: 'name', title: 'Name', showOverflow: true, minWidth: 50, flex: 1 },
        { field: 'nickname', title: 'Nickname', minWidth: 50, flex: 1 },
        { field: 'age', title: 'Age', minWidth: 100, flex: 1 },
        { field: 'role', title: 'Role', width: 100 },
        { field: 'updateDate', title: 'Update Date', visible: false },
        { field: 'createDate', title: 'Create Date', visible: false },
        {
            title: '操作',
            width: 150,
            slots: {
                default: 'actionSlot', // 插槽名稱
            },
        },
    ],
    data: []
})

const gridEvents = {
    pageChange({ pageSize, currentPage }) {
        gridOptions.pagerConfig.currentPage = currentPage
        gridOptions.pagerConfig.pageSize = pageSize
        handlePageData()
    }
}

handlePageData()

// 動態計算表格高度
const updateGridHeight = () => {
    const viewportHeight = window.innerHeight;
    const headerHeight = 120; // 預留的 header 區域高度（可根據實際情況調整）
    const footerHeight = 220;  // 預留的 footer 區域高度
    gridHeight.value = viewportHeight - headerHeight - footerHeight;
};

let touchElement = null;

const touchHandler = (event) => {
  // 觸摸事件的處理邏輯（可以根據需求自定義）
};

const handleFocus = (event) => {
  // 如果需要 preventDefault，确保这里的 passive 选项是 false
  event.preventDefault()
}

onMounted(() => {
  loading.value = true;
  updateGridHeight(); // 初始高度
  window.addEventListener('resize', updateGridHeight, { passive: true }); // 確保被動
  loading.value = false;
  document.addEventListener(
    'touchstart',
    (event) => {
      event.preventDefault()
    },
    { passive: false }
  )
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateGridHeight); // 正確清除事件監聽
});


const confirmEvent = async () => {
    const $form = formRef.value
    if ($form) {
        const errMap = await $form.validate()
        if (!errMap) {
            showEditPopup.value = false
            VxeUI.modal.message({
    content: '保存成功',
    status: 'success'
});
        }
    }
}

const editRow = (row) => {
    selectRow.value = row
    formOptions.data = Object.assign(XEUtils.clone(defaultData, true), row)
    showEditPopup.value = true
}

const formOptions = reactive({
    titleWidth: 80,
    titleAlign: 'right',
    titleColon: true,
    data: XEUtils.clone(defaultData, true),
    // rules: {
    //     name: [
    //         { required: true, message: '請輸入名稱' },
    //         { min: 3, max: 5, message: '長度在 3 到 5 個字符' }
    //     ],
    //     sex: [
    //         { required: true, message: '請選擇性別' }
    //     ],
    //     age: [
    //         { required: true, message: '請輸入年齡' }
    //     ]
    // },
    items: [
        { field: 'name', title: 'Name', span: 12, itemRender: { name: 'VxeInput' } },
        { field: 'nickname', title: 'Nickname', span: 12, itemRender: { name: 'VxeInput' } },
        { field: 'age', title: 'Age', span: 12, itemRender: { name: 'VxeInput' } },
        { field: 'role', title: 'Role', span: 12, itemRender: { name: 'VxeInput' } },
        // { field: 'address', title: '地址', span: 24, itemRender: { name: 'VxeTextarea', props: { autosize: { minRows: 2, maxRows: 4 } } } }
    ]
})




</script>