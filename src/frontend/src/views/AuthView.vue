<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <template #header>
        <div class="auth-header">
          <h2>{{ isLogin ? '用户登录' : '用户注册' }}</h2>
          <el-button 
            type="text" 
            @click="toggleMode"
            class="toggle-btn"
          >
            {{ isLogin ? '还没有账户？立即注册' : '已有账户？立即登录' }}
          </el-button>
        </div>
      </template>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            :disabled="loading"
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email" v-if="!isLogin">
          <el-input 
            v-model="form.email" 
            type="email" 
            placeholder="请输入邮箱地址"
            :disabled="loading"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            :disabled="loading"
          />
        </el-form-item>
        
        <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            :disabled="loading"
          />
        </el-form-item>
        
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="loading"
          class="submit-btn"
          style="width: 100%;"
        >
          {{ isLogin ? '登录' : '注册' }}
        </el-button>
      </el-form>
      
      <div v-if="error" class="error-message">
        <el-alert :title="error" type="error" show-icon :closable="false" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

export default {
  name: 'AuthView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const formRef = ref(null);
    const isLogin = ref(true);
    const loading = ref(false);
    const error = ref('');
    
    const form = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'));
      } else {
        callback();
      }
    };
    
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== form.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 30, message: '用户名长度应在3-30个字符之间', trigger: 'blur' }
      ],
      email: [
        { required: !isLogin.value, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      password: [
        { validator: validatePassword, trigger: 'blur' }
      ],
      confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' }
      ]
    };
    
    const toggleMode = () => {
      isLogin.value = !isLogin.value;
      error.value = '';
      // 重置表单
      Object.keys(form).forEach(key => {
        form[key] = '';
      });
    };
    
    const handleSubmit = async () => {
      if (!formRef.value) return;
      
      await formRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          error.value = '';
          
          try {
            let result;
            if (isLogin.value) {
              // 登录
              result = await authStore.login({
                username: form.username,
                password: form.password
              });
            } else {
              // 注册
              result = await authStore.register({
                username: form.username,
                email: form.email,
                password: form.password
              });
            }
            
            if (result.success) {
              ElMessage.success(isLogin.value ? '登录成功' : '注册成功');
              
              // 对于新注册用户，让他们设置一个固定的角色ID
              if (!isLogin.value) {
                // 新用户注册，跳转到角色创建页面
                await router.push('/create-character');
              } else {
                // 老用户登录，检查是否有角色ID
                const characterId = localStorage.getItem('characterId');
                if (characterId) {
                  // 如果已有角色ID，直接跳转到首页
                  await router.push('/');
                } else {
                  // 如果没有角色ID，跳转到角色创建页面
                  await router.push('/create-character');
                }
              }
            } else {
              error.value = result.error;
            }
          } catch (err) {
            error.value = err.response?.data?.error || (isLogin.value ? '登录失败' : '注册失败');
          } finally {
            loading.value = false;
          }
        }
      });
    };
    
    return {
      form,
      formRef,
      rules,
      isLogin,
      loading,
      error,
      toggleMode,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-btn {
  font-size: 14px;
}

.submit-btn {
  margin-top: 10px;
}

.error-message {
  margin-top: 20px;
}
</style>