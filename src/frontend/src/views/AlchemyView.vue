<template>
  <div class="alchemy">
    <el-page-header @back="$router.go(-1)" content="丹药炼制"></el-page-header>
    
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>炼丹炉</span>
          </template>
          
          <div class="cauldron-area">
            <div class="cauldron">
              <div class="flame"></div>
              <div class="steam"></div>
            </div>
            
            <div class="instructions">
              <p>选择配方和材料，开始炼制丹药</p>
              <p>注意：炼制需要消耗灵力和时间</p>
            </div>
          </div>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <span>可用配方</span>
          </template>
          
          <el-table :data="recipes" style="width: 100%">
            <el-table-column prop="name" label="丹药名称" width="150"></el-table-column>
            <el-table-column prop="type" label="类型" width="120"></el-table-column>
            <el-table-column prop="requiredRealm" label="所需境界" width="120">
              <template #default="{ row }">
                {{ row.requiredRealm }} · 第{{ row.requiredRealmLevel }}层
              </template>
            </el-table-column>
            <el-table-column prop="result.successRate" label="成功率" width="100">
              <template #default="{ row }">
                {{ row.result.successRate }}%
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button size="small" @click="selectRecipe(row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>材料仓库</span>
          </template>
          
          <el-table :data="materials" style="width: 100%" height="200">
            <el-table-column prop="name" label="材料名称"></el-table-column>
            <el-table-column prop="type" label="类型" width="80"></el-table-column>
            <el-table-column prop="quality" label="品质" width="80">
              <template #default="{ row }">
                <el-tag :type="getQualityTagType(row.quality)">{{ row.quality }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <span>炼制控制台</span>
          </template>
          
          <div v-if="selectedRecipe" class="recipe-info">
            <h4>{{ selectedRecipe.name }}</h4>
            <p>类型：{{ selectedRecipe.type }}</p>
            <p>所需境界：{{ selectedRecipe.requiredRealm }} · 第{{ selectedRecipe.requiredRealmLevel }}层</p>
            <p>成功率：{{ selectedRecipe.result.successRate }}%</p>
            <p>产物：{{ selectedRecipe.result.potionName || selectedRecipe.name }}</p>
            
            <el-button type="primary" @click="startBrewing" style="margin-top: 20px; width: 100%;">
              开始炼制
            </el-button>
          </div>
          <div v-else class="no-recipe-selected">
            <p>请选择一个配方开始炼制</p>
          </div>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <span>我的丹药</span>
          </template>
          
          <el-table :data="potions" style="width: 100%" height="200">
            <el-table-column prop="name" label="丹药名称"></el-table-column>
            <el-table-column prop="type" label="类型" width="80"></el-table-column>
            <el-table-column prop="quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="quality" label="品质" width="80">
              <template #default="{ row }">
                <el-tag :type="getQualityTagType(row.quality)">{{ row.quality }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import { API_BASE_URL } from '@/config/api';
import { ElMessage } from 'element-plus';

export default {
  name: 'AlchemyView',
  setup() {
    const gameStore = useGameStore();
    const recipes = ref([]);
    const materials = ref([]);
    const potions = ref([]);
    const selectedRecipe = ref(null);
    
    // 获取品质标签类型
    const getQualityTagType = (quality) => {
      switch(quality) {
        case '传说': return 'warning';
        case '珍稀': return 'danger';
        case '优质': return 'success';
        default: return 'info';
      }
    };
    
    // 获取可用配方
    const fetchRecipes = async () => {
      try {
        const characterId = localStorage.getItem('characterId');
        if (!characterId) {
          ElMessage.error('请先创建角色');
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/alchemy/recipes?characterId=${characterId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          recipes.value = await response.json();
        } else {
          const error = await response.json();
          ElMessage.error(error.error || '获取配方失败');
        }
      } catch (error) {
        console.error('获取配方失败:', error);
        ElMessage.error('网络错误');
      }
    };
    
    // 获取材料
    const fetchMaterials = async () => {
      try {
        const characterId = localStorage.getItem('characterId');
        if (!characterId) {
          ElMessage.error('请先创建角色');
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/alchemy/materials?characterId=${characterId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          materials.value = await response.json();
        } else {
          const error = await response.json();
          ElMessage.error(error.error || '获取材料失败');
        }
      } catch (error) {
        console.error('获取材料失败:', error);
        ElMessage.error('网络错误');
      }
    };
    
    // 获取丹药
    const fetchPotions = async () => {
      try {
        const characterId = localStorage.getItem('characterId');
        if (!characterId) {
          ElMessage.error('请先创建角色');
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/alchemy/potions?characterId=${characterId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          potions.value = await response.json();
        } else {
          const error = await response.json();
          ElMessage.error(error.error || '获取丹药失败');
        }
      } catch (error) {
        console.error('获取丹药失败:', error);
        ElMessage.error('网络错误');
      }
    };
    
    // 选择配方
    const selectRecipe = (recipe) => {
      selectedRecipe.value = recipe;
      ElMessage.info(`已选择配方: ${recipe.name}`);
    };
    
    // 开始炼制
    const startBrewing = async () => {
      if (!selectedRecipe.value) {
        ElMessage.warning('请先选择配方');
        return;
      }
      
      try {
        const characterId = localStorage.getItem('characterId');
        if (!characterId) {
          ElMessage.error('请先创建角色');
          return;
        }
        
        // 模拟炼制过程
        ElMessage.info('开始炼制...');
        
        const response = await fetch(`${API_BASE_URL}/api/alchemy/brew`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            characterId: characterId,
            recipeId: selectedRecipe.value._id,
            materials: [] // 这里应该传递实际的材料信息
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          if (result.success) {
            ElMessage.success(result.message);
            // 更新丹药列表
            await fetchPotions();
          } else {
            ElMessage.error(result.message);
          }
        } else {
          ElMessage.error(result.error || '炼制失败');
        }
      } catch (error) {
        console.error('炼制失败:', error);
        ElMessage.error('网络错误');
      }
    };
    
    onMounted(async () => {
      await fetchRecipes();
      await fetchMaterials();
      await fetchPotions();
    });
    
    return {
      recipes,
      materials,
      potions,
      selectedRecipe,
      getQualityTagType,
      selectRecipe,
      startBrewing
    };
  }
};
</script>

<style scoped>
.alchemy {
  padding: 20px;
}

.cauldron-area {
  text-align: center;
  padding: 20px 0;
}

.cauldron {
  width: 120px;
  height: 100px;
  border: 3px solid #8B4513;
  border-radius: 10px 10px 50px 50px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #654321, #8B4513);
  position: relative;
  overflow: hidden;
}

.flame {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 60px;
  background: linear-gradient(to top, orange, yellow, white);
  border-radius: 50% 50% 0 0;
  animation: flameAnimation 1.5s infinite alternate;
}

.steam {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 40px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: steamAnimation 2s infinite;
}

@keyframes flameAnimation {
  0% { height: 40px; opacity: 0.7; }
  100% { height: 60px; opacity: 1; }
}

@keyframes steamAnimation {
  0% { height: 0; opacity: 0; }
  50% { height: 40px; opacity: 0.5; }
  100% { height: 0; opacity: 0; transform: translateX(-50%) scale(1.5); }
}

.instructions {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.recipe-info {
  padding: 10px 0;
}

.no-recipe-selected {
  text-align: center;
  padding: 20px 0;
  color: #999;
}
</style>