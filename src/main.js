import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import VxeUI from 'vxe-pc-ui';
import 'vxe-pc-ui/lib/style.css';
import VxeUITable from 'vxe-table';
import 'vxe-table/lib/style.css';
import zhTWVue from 'vxe-table/es/locale/lang/zh-TW'; // 引入vxe-table官方簡體中文語言包
import { createI18n } from 'vue-i18n';

// import 'default-passive-events'


import App from './App.vue';
import router from './router';
import "@/styles/index.css";
import { get, post, put, del } from '@/infrastructure/api';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { setRouter } from './infrastructure/api';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}



app.config.globalProperties.$get = get;
app.config.globalProperties.$post = post;
app.config.globalProperties.$put = put;
app.config.globalProperties.$del = del;
app.config.globalProperties.$router = router;
// 修改語言包，將簡體中文轉為繁體中文
const zhTW = {
    ...zhTWVue,
    vxe: {
        ...zhTWVue.vxe,
        select: {
          ...zhTWVue.vxe.select,
        },
        table: {
            ...zhTWVue.vxe.table,
        },
        button: {
            ...zhTWVue.vxe.button,
        },
        base: {
            ...zhTWVue.vxe.base,
            pleaseInput: '請輸入',
        },
    },
};

// 初始化 vue-i18n
const i18n = createI18n({
    legacy: false, // 使用 Composition API
    locale: 'zh-TW', // 當前語言設為繁體中文
    messages: {
        'zh-TW': zhTW
    }
});

// 設置 VxeUI 的國際化配置
VxeUI.setConfig({
    i18n: (key, args) => i18n.global.t(key, args)
});


app.use(i18n); // 使用 vue-i18n
app.use(VxeUI);
app.use(VxeUITable);

app.use(createPinia());
app.use(router);

app.mount('#app');

setRouter(router);