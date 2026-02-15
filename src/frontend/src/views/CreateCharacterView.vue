<template>
  <div class="create-character">
    <el-card class="create-character-card">
      <template #header>
        <div class="card-header">
          <span>创建角色</span>
        </div>
      </template>
      
      <div class="character-form">
        <el-form 
          :model="characterForm" 
          :rules="rules" 
          ref="characterFormRef"
          label-position="top"
        >
          <el-form-item label="角色ID" prop="id">
            <el-input 
              v-model="characterForm.id" 
              placeholder="请输入唯一角色ID（字母、数字、下划线）"
              maxlength="30"
              show-word-limit
              :disabled="loading"
            />
          </el-form-item>
          
          <el-form-item label="角色名称" prop="name">
            <el-input 
              v-model="characterForm.name" 
              placeholder="请输入角色名称"
              maxlength="20"
              show-word-limit
              :disabled="loading"
            />
          </el-form-item>
          
          <el-form-item label="角色称号" prop="title">
            <el-select 
              v-model="characterForm.title" 
              placeholder="请选择角色称号"
              style="width: 100%;"
              :disabled="loading"
            >
              <el-option label="无名修士" value="无名修士"></el-option>
              <el-option label="练气弟子" value="练气弟子"></el-option>
              <el-option label="筑基真人" value="筑基真人"></el-option>
              <el-option label="金丹长老" value="金丹长老"></el-option>
              <el-option label="元婴尊者" value="元婴尊者"></el-option>
              <el-option label="化神真君" value="化神真君"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="角色描述">
            <el-input
              v-model="characterForm.description"
              type="textarea"
              placeholder="请输入角色描述（可选）"
              maxlength="100"
              show-word-limit
              :rows="3"
              :disabled="loading"
            />
          </el-form-item>
        </el-form>
        
        <el-button 
          type="primary" 
          @click="createCharacter"
          :loading="loading"
          style="width: 100%; margin-top: 20px;"
          size="large"
        >
          创建角色并开始修仙
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import { API_BASE_URL } from '@/config/api';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'CreateCharacterView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const gameStore = useGameStore();
    const characterFormRef = ref(null);
    const loading = ref(false);
    
    const characterForm = reactive({
      id: '',
      name: '',
      title: '无名修士',
      description: ''
    });
    
    const validateId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色ID'));
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error('角色ID只能包含字母、数字和下划线'));
      } else if (value.trim().length < 3) {
        callback(new Error('角色ID至少需要3个字符'));
      } else if (value.trim().length > 30) {
        callback(new Error('角色ID不能超过30个字符'));
      } else {
        callback();
      }
    };
    
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色名称'));
      } else if (value.trim().length < 2) {
        callback(new Error('角色名称至少需要2个字符'));
      } else if (value.trim().length > 20) {
        callback(new Error('角色名称不能超过20个字符'));
      } else {
        callback();
      }
    };
    
    const rules = {
      id: [
        { validator: validateId, trigger: 'blur' }
      ],
      name: [
        { validator: validateName, trigger: 'blur' }
      ]
    };
    
    const createCharacter = async () => {
      if (!characterFormRef.value) return;
      
      await characterFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          
          try {
            // 创建角色的API调用
            const response = await fetch(`${API_BASE_URL}/api/characters`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.token}`
              },
              body: JSON.stringify({
                name: characterForm.name.trim(),
                title: characterForm.title,
                description: characterForm.description,
                userId: authStore.user.id
              })
            });
            
            if (response.ok) {
              const result = await response.json();
              // 使用用户指定的角色ID，而不是MongoDB自动生成的ID
              const characterId = characterForm.id.trim();
              
              // 将角色ID存储到本地存储
              localStorage.setItem('characterId', characterId);
              
              // 初始化游戏状态
              await gameStore.loadGameState(characterId);
              
              // 立即保存初始状态到数据库
              await gameStore.saveGameState(characterId);
              
              ElMessage.success('角色创建成功！');
              
              // 跳转到首页
              router.push('/');
            } else {
              const error = await response.json();
              ElMessage.error(error.error || '角色创建失败');
            }
          } catch (error) {
            console.error('创建角色时出错:', error);
            ElMessage.error('网络错误，请稍后重试');
          } finally {
            loading.value = false;
          }
        }
      });
    };
    
    return {
      characterForm,
      characterFormRef,
      rules,
      loading,
      createCharacter
    };
  }
};
</script>

<style scoped>
.create-character {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

.create-character-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
}

.character-form {
  padding: 20px 0;
}
</style>