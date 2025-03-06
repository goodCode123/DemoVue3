<template>
    <el-card style="max-width: 100vw" v-loading="loading">
        <template #header>
            <div class="header">
                <p>群組管理編輯</p>
                <!-- <vxe-button class="button" status="primary" icon="vxe-icon-add" @click="addRow">新增</vxe-button> -->
            </div>
        </template>
        <div>
            <el-form ref="formRef" :rules="rules" :model="form" label-width="auto" style="max-width: 600px">
                <el-form-item label="群組名稱" prop="groupName">
                    <el-input v-model="form.groupName" />
                </el-form-item>
                <el-form-item label="選單權限" v-if="mode === 'edit'">
                    <el-button type="primary" @click="setMeauForGroup">設定</el-button>
                </el-form-item>
                <el-form-item label="群組人員" v-if="mode === 'edit'">
                    <el-button type="primary" @click="setUserAddForGroup">新增</el-button>
                    <el-button type="primary" @click="setUserDeleteForGroup">移除</el-button>
                </el-form-item>
                <el-form-item label="是否禁用">
                    <el-switch v-model="form.disable" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(formRef)" v-model="form.mode">確定</el-button>
                    <el-button @click="cancelEvent">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
    <!-- 選單權限 -->
    <vxe-modal resize destroy-on-close show-footer show-confirm-button v-model="showGroupEditPopup" :title=showGroupEdit
        width="60vw" height="60vh" @confirm="" @cancel="groupCancelEvent">
        <vxe-table ref="groupTableRef" :row-config="{ keyField: 'Id', isHover: true }"
            :column-config="{ resizable: true }"
            :tree-config="{ transform: true, rowField: 'Id', parentField: 'ParentId' }" :data="meauData"
            @checkbox-change="groupSelectChangeEvent" @checkbox-all="groupSelectAllChangeEvent"
            :checkbox-config="{ labelField: 'Title', highlight: true, checkRowKeys: checkedGroupRowKeys }">
            <vxe-column type="checkbox" title="群組名稱" min-width="280" tree-node></vxe-column>
        </vxe-table>
    </vxe-modal>
    <!-- 群組人員新增 -->
    <vxe-modal resize destroy-on-close show-footer show-confirm-button v-model="showUserAddPopup" :title="modalTitle"
        width="60vw" height="60vh" @confirm="">
        <vxe-table ref="userTableRef" :column-config="{ resizable: true }" :data="userData"
            :tree-config="{ transform: true }" :row-config="{ keyField: 'Id', isHover: true }"
            @checkbox-change="userSelectChangeEvent"
            :checkbox-config="{ labelField: 'Account', checkStrictly: true, checkRowKeys: checkedUserRowKeys }">
            <vxe-column type="checkbox" title="帳號" width="280" tree-node></vxe-column>
            <vxe-column field="Name" title="姓名"></vxe-column>
        </vxe-table>
    </vxe-modal>
    <!-- 群組人員刪除 -->
    <vxe-modal resize destroy-on-close show-footer show-confirm-button v-model="showUserDeletePopup" :title="modalTitle"
        width="60vw" height="60vh" @confirm="">
        <vxe-table ref="userDeleteTableRef" :column-config="{ resizable: true }" :data="userDeleteData"
            :tree-config="{ transform: true }" :row-config="{ keyField: 'Id', isHover: true }"
            @checkbox-change="userDeleteSelectChangeEvent"
            :checkbox-config="{ labelField: 'Account', checkStrictly: true, checkRowKeys: checkedUserDeleteRowKeys }">
            <vxe-column type="checkbox" title="帳號" width="280" tree-node></vxe-column>
            <vxe-column field="Name" title="姓名"></vxe-column>
        </vxe-table>
    </vxe-modal>

</template>

<script setup>
import { reactive, ref } from 'vue'
import { getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VxeUI } from 'vxe-pc-ui';
import { sideBar } from '@/stores/sideBar';
const sideBarPinna = sideBar();
const { getSideBar } = sideBarPinna;
const checkedGroupRowKeys = ref([]); //存儲以勾選項目
const checkedUserRowKeys = ref([]); //存儲以勾選項目
const checkedUserDeleteRowKeys = ref([]); //存儲刪除以勾選項目
const route = useRoute();
const loading = ref(false);
const showGroupEditPopup = ref(false);
const showUserAddPopup = ref(false);
const formRef = ref(null);
const showUserDeletePopup = ref(false);
const groupTableRef = ref();
const userTableRef = ref();
const userDeleteTableRef = ref();
const groupId = route.params.groupId; // 暫時用不到
const mode = ref(route.params.mode); //判斷是新增還是更新
const { proxy } = getCurrentInstance();
const meauData = ref([]);
const userData = ref([]);
const userDeleteData = ref([]);
const showGroupEdit = ref('編輯')
const router = useRouter();

onMounted(() => {
    console.log('mode', form.mode);
    setMeauForGroup(false);
});

const rules = ref({
    groupName: [
        { required: true, message: '群組名稱是必填項目', trigger: 'blur' },
    ],
});

const form = reactive({
    Id: route.params.groupId || 0,
    GroupMasterId: route.params.groupId || 0,
    groupName: route.params.groupName,
    disable: ref(route.params.disable === 'true'),
    mode: ref(route.params.mode)
})

const cancelEvent = () => {
    router.push({
        name: 'GroupMaster', // 確保路由設定有名稱
    });
}

const setMeauForGroup = async (isopen = true) => {
    if (isopen) {
        showGroupEditPopup.value = true;
    }

    var result = await proxy.$post('/LayOut/GetNoDisableMeaus');
    var groupMenuresult = await proxy.$post('/GroupMenuAuth/GetGroupMenuAuthByGroup', JSON.stringify(form));
    meauData.value = result.Data;
    checkedGroupRowKeys.value = groupMenuresult.Data;
}

const setUserAddForGroup = async () => {
    showUserAddPopup.value = true;
    let postData = {
        "GroupMasterId": route.params.groupId
    }
    var result = await proxy.$post('/GroupMember/GetNonGroupMembers', postData);
    userData.value = result.Data;
}

const setUserDeleteForGroup = async () => {
    showUserDeletePopup.value = true;
    let postData = {
        "GroupMasterId": route.params.groupId
    }
    var result = await proxy.$post('/GroupMember/GetGroupMembersById', postData);
    userDeleteData.value = result.Data;
}

const onSubmit = async () => {
    try {
        if (formRef.value) {
            await formRef.value.validate(async (valid) => {
                if (valid) {
                    const apiEndpoint = mode.value === "edit" ? '/GroupMaster/Update' : '/GroupMaster/Add';
                    await proxy.$post(apiEndpoint, form);
                    const alertMessage = mode.value === "edit" ? '更新成功' : '新增成功';
                    if (mode.value === "edit") {
                        await groupConfirmEvent();
                        await userConfirmEvent();
                        if (userDeleteData.value.length > 0) {
                            await deleteGroupMember();
                        }

                        await getSideBar();
                    }
                    VxeUI.modal.message({
                        content: alertMessage,
                        status: 'success',
                    });
                    router.push({
                        name: 'GroupMaster', // 確保路由設定有名稱
                    });
                } else {
                    console.log('提交失敗');
                }
            });
        }
    } catch (error) {
        VxeUI.modal.message({
            content: alertMessage,
            status: 'success',
        });
    }
};

const groupConfirmEvent = async () => {
    var postData = [];
    if (checkedGroupRowKeys.value.length == 0) {
        postData.push({
            GroupMasterId: groupId,
            MenuItemId: null
        });
    }
    else {
        checkedGroupRowKeys.value.forEach(element => {
            var sendobj = {
                id: 0,
                GroupMasterId: groupId,
                MenuItemId: element,
                Disable: form.disable,
            };

            postData.push(sendobj);
        });
    }

    await proxy.$post('/GroupMenuAuth/BatchAdd', JSON.stringify(postData));
}

const groupSelectChangeEvent = () => {
    const $table = groupTableRef.value;
    const records = $table.getCheckboxRecords();
    checkedGroupRowKeys.value = [];
    records.forEach(item => {
        checkedGroupRowKeys.value.push(item.Id);
    });
}

const userConfirmEvent = async () => {
    var postData = [];
    if (checkedUserRowKeys.value.length == 0) {
        return;
    }
    else {
        checkedUserRowKeys.value.forEach(element => {
            var sendobj = {
                Id: 0,
                GroupMasterId: form.GroupMasterId,
                UserMasterId: element,
                CreateUser: 'system'
            };

            postData.push(sendobj);
        });

        await proxy.$post('/GroupMember/BatchAdd', JSON.stringify(postData));
    }
}

const userSelectChangeEvent = () => {
    const $table = userTableRef.value;
    const records = $table.getCheckboxRecords();
    checkedUserRowKeys.value = [];
    records.forEach(item => {
        checkedUserRowKeys.value.push(item.Id);
    });
}

const userDeleteSelectChangeEvent = () => {
    const $table = userDeleteTableRef.value;
    const records = $table.getCheckboxRecords();
    checkedUserDeleteRowKeys.value = [];
    records.forEach(item => {
        checkedUserDeleteRowKeys.value.push(item.Id);
    });
};

const deleteGroupMember = async () => {
    const matchingObjects = userDeleteData.value.filter(item => checkedUserDeleteRowKeys.value.includes(item.Id));
    const Ids = matchingObjects.map(item => item.GroupMemberId);
    console.log(Ids)
    await proxy.$post('/GroupMember/DeteleGroupMembers', Ids);
}

const groupSelectAllChangeEvent = ({ checked, records }) => {
    if (checked) {
        checkedGroupRowKeys.value = [];
        records.forEach(item => {
            checkedGroupRowKeys.value.push(item.Id);
        });
    } else {
        checkedGroupRowKeys.value = [];
    }
}
</script>
