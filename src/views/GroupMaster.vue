<template>
    <el-card style="max-width: 100vw" v-loading="loading">
        <template #header>
            <div class="header">
                <p>群組管理</p>
                <vxe-button class="button" status="primary" icon="vxe-icon-add" @click="addRow">新增</vxe-button>
            </div>
        </template>
        <div>
            <vxe-grid v-bind="gridOptions" v-on="gridEvents" :height="gridHeight">
                <!-- 自訂義插槽 -->
                <template #switchSlot="{ row }">
                    <vxe-switch v-model="row.Disable" :disabled="true"></vxe-switch>
                </template>
                <template #actionSlot="{ row }">
                    <vxe-button mode="text" status="primary" icon="vxe-icon-edit" @click="editRow(row)">编辑</vxe-button>
                    <vxe-button mode="text" status="danger" icon="vxe-icon-delete"
                        @click="deleteRow(row)">删除</vxe-button>
                </template>
            </vxe-grid>
        </div>
    </el-card>
</template>

<style lang="css" scoped>
.header {
    display: flex;
}

.button {
    margin-left: auto;
}

label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}
</style>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { VxeUI } from 'vxe-pc-ui';
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const gridHeight = ref(700);
const loading = ref(false);
// const formRef = ref();
// const showEditPopup = ref(false);
const selectRow = ref(null);
const allUsers = ref([]);
const router = useRouter();

const defaultData = {
    Id: 0,
    GroupName: '',
    CreateDate: null,
};

const modalTitle = computed(() => (selectRow.value ? '编辑' : '新增'));

const gridOptions = reactive({
    showOverflow: true,
    border: true,
    autoresize: true,
    height: gridHeight,
    pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 15,
    },
    highlightHoverRow: true,
    columns: [
        { field: 'Id', minWidth: 40, fixed: 'left', flex: 1, visible: false },
        { field: 'GroupName', title: '群祖名稱', showOverflow: true, minWidth: 50, flex: 1 },
        { field: 'CreateDate', title: '建立日期', minWidth: 50, flex: 1 },
        {
      field: 'Disable',
      title: '是否禁用',
      width: 200,
      align: 'center',
      Disable : true,
      slots: { default: 'switchSlot' } // 使用插槽 switchSlot 來渲染開關
    },
        {
            title: '操作',
            width: 150,
            slots: {
                default: 'actionSlot',
            },
        },
    ],
    data: [],
});

// const formOptions = reactive({
//     titleWidth: 80,
//     titleAlign: 'right',
//     titleColon: true,
//     data: { ...defaultData },
//     items: [
//         // { field: 'GroupId', title: 'GroupId', span: 12, itemRender: { name: 'VxeInput' } },
//         { field: 'GroupName', title: 'GroupName', span: 12, itemRender: { name: 'VxeInput' } },
//     ],
// });

const handlePageData = () => {
    loading.value = true;
    const { pageSize, currentPage } = gridOptions.pagerConfig;
    gridOptions.pagerConfig.total = allUsers.value.length;
    gridOptions.data = allUsers.value.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    loading.value = false;
};

const updateGridHeight = () => {
    const viewportHeight = window.innerHeight;
    const headerHeight = 120;
    const footerHeight = 220;
    gridHeight.value = viewportHeight - headerHeight - footerHeight;
};

const getUserMaster = async () => {
    var result  = await proxy.$get('/GroupMaster/GetAll');
    allUsers.value = result.Data;
    handlePageData();
};


const editRow = (row) => {
    router.push({ 
    name: 'GroupMasterDetail', // 確保路由設定有名稱
    params: { groupId: row.Id , groupName : row.GroupName,disable:row.Disable, mode : 'edit'}
  });
    // selectRow.value = row;
    // formOptions.data = { ...XEUtils.clone(defaultData, true), ...row };
    // showEditPopup.value = true;
};

const addRow = () => {
    // selectRow.value = null;
    // formOptions.data = { ...XEUtils.clone(defaultData, true) };
    // showEditPopup.value = true;    
    router.push({ 
    name: 'GroupMasterDetail', // 確保路由設定有名稱
    params: { groupId: '' , groupName : '' ,disable:false, mode : 'add'}
  });

};

const deleteRow = (row) => {
    ElMessageBox.confirm(
        '此操作將永久删除該文件, 是否繼續?',
        '提示',
        {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            console.log(row);
            proxy.$post('/GroupMaster/Delete', { ...row }).then(() => {
                getUserMaster();
                ElMessage({
                    type: 'success',
                    message: '删除成功!',
                });
            });
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            });
        });
};

const gridEvents = {
    pageChange({ pageSize, currentPage }) {
        gridOptions.pagerConfig.currentPage = currentPage;
        gridOptions.pagerConfig.pageSize = pageSize;
        handlePageData();
    },
};

onMounted(() => {
    loading.value = true;
    getUserMaster();
    updateGridHeight();
    window.addEventListener('resize', updateGridHeight, { passive: true });
    loading.value = false;
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateGridHeight);
});
</script>
