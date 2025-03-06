<template>

  <el-card style="max-width: 100vw;max-height: 70%;">
    <template #header>
      <div style="display: flex;">
        <p>菜單列表</p>
        <vxe-button class="button" status="primary" icon="vxe-icon-add" @click="addRow()">新增</vxe-button>
      </div>
    </template>
    <div>
      <div>
        <vxe-grid ref="gridRef" v-bind="gridOptions">
          <!-- 自訂義插槽 -->
          <template #switchSlot="{ row }">
            <vxe-switch v-model="row.Disable" :disabled="true"></vxe-switch>
          </template>
          <!-- 自訂義插槽 -->
          <template #actionSlot="{ row }">
            <vxe-button mode="text" status="primary" icon="vxe-icon-edit" @click="editRow(row)">编辑</vxe-button>
          </template>
        </vxe-grid>
      </div>

      <vxe-modal resize destroy-on-close show-footer show-confirm-button show-cancel-button v-model="showEditPopup"
        :title="selectRow ? '编辑' : '新增'" width="60vw" height="60vh" @confirm="confirmEvent">
        <vxe-form ref="formRef" v-bind="formOptions"></vxe-form>
      </vxe-modal>
    </div>
  </el-card>

</template>

<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue';
import XEUtils from 'xe-utils'
import { VxeUI } from 'vxe-pc-ui'
import { sideBar } from '@/stores/sideBar';
const sideBarPinna = sideBar();
const showEditPopup = ref(false)
const selectRow = ref()
const formRef = ref()
const options = ref()
const { proxy } = getCurrentInstance();
const { getSideBar } = sideBarPinna;

onMounted(async () => {
  getmeau();
});


const defaultData = {
  Title: '',
  nickname: '',
  Icon: '',
}

const gridOptions = reactive({
  border: true,
  rowConfig: { isCurrent: true, isHover: true },
  treeConfig: {
    transform: true,
    rowField: 'Id',
    parentField: 'ParentId',
    expandAll: true
  },
  columns: [
    { field: 'Title', title: '名稱', minWidth: 350, treeNode: true },
    { field: 'Url', title: '路徑' },
    { field: 'Icon', title: '圖示' },
    {
      field: 'Disable',
      title: '是否禁用',
      width: 200,
      align: 'center',
      Disable: true,
      slots: { default: 'switchSlot' } // 使用插槽 switchSlot 來渲染開關
    },
    //  添加操作列
    {
      title: '操作',
      width: 150,
      slots: { default: 'actionSlot' } // 使用插槽 actionSlot
    },
  ],
  data: []
});

const formOptions = reactive({
  titleWidth: 80,
  titleAlign: 'right',
  titleColon: true,
  data: XEUtils.clone(defaultData, true),
  rules: {
    // 這裡可以添加規則，如需要
  },
  items: [
    { field: 'Title', title: '名稱', span: 12, itemRender: { name: 'VxeInput' } },
    { field: 'Url', title: '路徑', span: 12, itemRender: { name: 'VxeInput' } },
    { field: 'Icon', title: '圖示', span: 12, itemRender: { name: 'VxeInput' } },
    {
      field: 'ParentId',
      title: '父選單',
      span: 12,
      itemRender: {
        name: 'VxeSelect',
        props: {
          options: options
        }
      }
    },
    {
      field: 'Disable',
      title: '是否禁用',
      span: 12,
      itemRender: {
        name: 'VxeSwitch',
        props: {
          checkedValue: true,   // 開關打開的值
          uncheckedValue: false // 開關關閉的值
        }
      }
    }

  ]
})

// 取得菜單數據
const getmeau = async () => {
  var result = await proxy.$get('/LayOut/GeMeauList', {});
  console.log('result', result);
  options.value = generateOptions(result.Data)
  gridOptions.data = result.Data;
};

//轉換成下拉選單
const generateOptions = (array) => {
  return array
    .filter(item => item.ParentId === null) // 篩選 parentId 為 null 的元素
    .map(item => ({
      value: item.Id,
      label: item.Title
    }));
};

//編輯事件
const editRow = (row) => {
  selectRow.value = row
  formOptions.data = Object.assign(XEUtils.clone(defaultData, true), row)
  showEditPopup.value = true
};

//編輯之後，確認事件
const confirmEvent = async () => {
  var alertMessage = '';
  const $form = formRef.value
  if ($form) {
    const errMap = await $form.validate()
    if (!errMap) {
      showEditPopup.value = false
      const updatedRow = formOptions.data;
      const plainRow = JSON.parse(JSON.stringify(updatedRow));
      if (selectRow.value) {
        //有值就更新
        await proxy.$post('/LayOut/UpdateMeauList', plainRow);
        alertMessage = '更新成功';

      } else {
        //沒值就新增
        await proxy.$post('/LayOut/AddMeauList', plainRow);
        alertMessage = '新增成功';
      }

      await getSideBar();
      await getmeau();
      const gridRef = proxy.$refs.gridRef;
      gridRef.setAllTreeExpand(true);
      VxeUI.modal.message({
        content: alertMessage,
        status: 'success'
      });
    }
  }
}

const addRow = () => {
  selectRow.value = null;
  formOptions.data = Object.assign(XEUtils.clone(defaultData, true), {})
  showEditPopup.value = true
}
</script>

<style lang="css" scoped>
.button {
  margin-left: auto;
}
</style>