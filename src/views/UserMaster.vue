<template>
    <el-card style="max-width: 100vw" v-loading="loading">
        <template #header>
            <div class="header">
                <p>使用者管理</p>
                <vxe-button class="button" status="primary" icon="vxe-icon-add" @click="addRow">新增</vxe-button>
            </div>
        </template>
        <div>
            <vxe-grid v-bind="gridOptions" v-on="gridEvents" :height="gridHeight">
                <template #actionSlot="{ row }">
                    <vxe-button mode="text" status="primary" icon="vxe-icon-edit" @click="editRow(row)">编辑</vxe-button>
                    <vxe-button mode="text" status="danger" icon="vxe-icon-delete"
                        @click="deleteRow(row)">删除</vxe-button>
                </template>
            </vxe-grid>
        </div>
    </el-card>

    <vxe-modal resize destroy-on-close show-footer show-confirm-button show-cancel-button v-model="showEditPopup"
        :title="modalTitle" width="60vw" height="60vh" @confirm="confirmEvent">
        <vxe-form ref="formRef" v-bind="formOptions"></vxe-form>
    </vxe-modal>
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
import XEUtils from 'xe-utils';
import { VxeUI } from 'vxe-pc-ui';

const { proxy } = getCurrentInstance();
const gridHeight = ref(700);
const loading = ref(false);
const formRef = ref();
const showEditPopup = ref(false);
const selectRow = ref(null);
const allUsers = ref([]);

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

const defaultData = {
    Id: 0,
    Name: '',
    Account: '',
    Pwd: '',
};

const modalTitle = computed(() => (selectRow.value ? '編輯' : '新增'));

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
        { field: 'Name', title: 'Name', showOverflow: true, minWidth: 50, flex: 1 },
        { field: 'Account', title: 'Account', minWidth: 50, flex: 1 },
        // { field: 'Pwd', title: 'Pwd', minWidth: 70, flex: 1 },
        { field: 'CreateDate', title: 'CreateDate', minWidth: 150 },
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

const formOptions = reactive({
    titleWidth: 80,
    titleAlign: 'right',
    titleColon: true,
    data: { ...defaultData },
    items: [
        { field: 'Name', title: 'Name', span: 12, itemRender: { name: 'VxeInput' } },
        { field: 'Account', title: 'Account', span: 12, itemRender: { name: 'VxeInput' } },
        { field: 'Pwd', title: 'Pwd', span: 12, itemRender: { name: 'VxeInput' } },
    ],
});

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
    var result = await proxy.$get('/UserMaster/GetAll');
    allUsers.value = result.Data;
    handlePageData();
};

const confirmEvent = async () => {
    const $form = formRef.value;
    if ($form) {
        const errMap = await $form.validate();
        if (!errMap) {
            showEditPopup.value = false;
            const apiEndpoint = selectRow.value ? '/UserMaster/Update' : '/UserMaster/Add';
            await proxy.$post(apiEndpoint, JSON.stringify(formOptions.data));
            const alertMessage = selectRow.value ? '更新成功' : '新增成功';
            getUserMaster();
            VxeUI.modal.message({
                content: alertMessage,
                status: 'success',
            });
        }
    }
};

const editRow = (row) => {
    selectRow.value = row;
    formOptions.data = { ...XEUtils.clone(defaultData, true), ...row };
    showEditPopup.value = true;
};

const addRow = () => {
    selectRow.value = null;
    formOptions.data = { ...XEUtils.clone(defaultData, true) };
    showEditPopup.value = true;
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

            proxy.$post('/UserMaster/Delete', { ...row })
                .then(() => {
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
</script>
