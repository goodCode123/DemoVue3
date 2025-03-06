<template>
    <div class="login-container" v-loading="loading">
        <div class="login-box">
            <h2>登入</h2>
            <el-form @submit.prevent="handleLogin" :model="form" ref="loginForm" label-width="80px" :rules="rules">
                <el-form-item label="用戶名" prop="username">
                    <el-input v-model="form.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密碼" prop="password">
                    <el-input type="password" v-model="form.password" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin" class="glow-button">
                        登入
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { token } from '@/stores/token';
import { sideBar } from '@/stores/sideBar';
const sideBarPinna = sideBar();

const { proxy } = getCurrentInstance(); // 获取当前 Vue 实例的代理对象
const route = useRoute();
const { setToken, setRefreshToken } = token();
const redirectUrl = route.query.redirect || '/';
const loading = ref(false)
const form = reactive({ username: '', password: '' });
const rules = reactive({
    username: [
        { required: true, message: '請輸入用戶名', trigger: 'blur' },
        // { min: 3, max: 5, message: '用戶名長度應在 3 到 5 個字符之間', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { min: 5, message: '密碼長度最小5碼', trigger: 'blur' },
    ],
});

const loginForm = ref(null);
const router = useRouter();

const handleLogin = async () => {
    loading.value = true;
    const isVaild = await loginForm.value.validate((valid) => {
    });

    if (isVaild) {
        console.log('表單驗證成功');
    } else {
        console.error('表單驗證失敗');
        loading.value = false;
        return;
    }

    try {
        var apiResult = await proxy.$post('/Login/Login', { "Account": form.username, "Pwd": form.password })
        if (apiResult.Code === "200") {
            router.push(redirectUrl);
            setToken(apiResult.Data.Token);
            setRefreshToken(apiResult.Data.RefreshToken)
            await sideBarPinna.getSideBar()
            ElMessage.success('登入成功');
            loading.value = false;
        }
        else if (apiResult.Code === "202") {
            ElMessage.error('登入失敗，帳號已停用');
        }
        else {
            ElMessage.error('登入失敗，帳號密碼錯誤');
        }

        loading.value = false;

    } catch (error) {
        console.error(error);
        loading.value = false;
        return;
    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}

.login-box {
    background: #fff;
    padding: 40px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    text-align: center;
}
</style>