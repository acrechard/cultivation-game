<template>
  <div class="breakthrough">
    <el-page-header @back="$router.go(-1)" content="境界突破"></el-page-header>
    
    <el-row :gutter="20" class="breakthrough-container">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>突破准备</span>
          </template>
          
          <div class="current-status">
            <h3>当前状态</h3>
            <p>境界: <el-tag type="warning">{{ cultivation.realm }}</el-tag></p>
            <p>层级: 第 {{ cultivation.realmLevel }} 层</p>
            <p>修为: {{ cultivation.cultivationExp }} / {{ cultivation.cultivationExpToNext }}</p>
            
            <div class="progress-container" v-if="cultivation.realmLevel === 9">
              <h4>即将进入 {{ getNextRealm(cultivation.realm) }}!</h4>
              <el-alert type="warning" :closable="false">
                您已达到当前境界巅峰，可以尝试突破至更高境界！
              </el-alert>
            </div>
            <div class="progress-container" v-else-if="cultivation.realmLevel % 10 === 0">
              <h4>恭喜晋升!</h4>
              <el-alert type="success" :closable="false">
                您已晋升至 {{ cultivation.realmLevel }} 层！
              </el-alert>
            </div>
            <div class="progress-container" v-else>
              <el-progress 
                :percentage="getExperiencePercentage()" 
                :color="getProgressColor()"
                :format="() => `${Math.round(getExperiencePercentage())}%`"
              />
            </div>
          </div>
          
          <div class="breakthrough-conditions" v-if="breakthroughConditions">
            <h3>突破条件</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="所需修为">
                {{ breakthroughConditions.requiredExp }}
              </el-descriptions-item>
              <el-descriptions-item label="成功率">
                {{ Math.round(breakthroughConditions.successRate * 100) }}%
              </el-descriptions-item>
              <el-descriptions-item label="所需物品">
                <div v-for="item in breakthroughConditions.requiredItems" :key="item.name" class="required-item">
                  <el-tag type="info">{{ item.name }} ×{{ item.quantity }}</el-tag>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="描述">
                {{ breakthroughConditions.description }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>突破操作</span>
          </template>
          
          <div class="breakthrough-actions">
            <el-button 
              type="primary" 
              size="large" 
              :disabled="!canAttemptBreakthrough" 
              :loading="isAttempting"
              @click="attemptBreakthrough"
              style="width: 100%; margin-bottom: 20px;"
            >
              <span v-if="!isAttempting">开始突破</span>
              <span v-else>突破中...</span>
            </el-button>
            
            <el-divider>突破历史</el-divider>
            
            <div class="breakthrough-history" v-if="breakthroughHistory.length > 0">
              <div 
                v-for="record in breakthroughHistory" 
                :key="record._id" 
                class="history-item"
                :class="{ 'success': record.success, 'failure': !record.success }"
              >
                <div class="history-header">
                  <span class="realm">{{ record.currentRealm }} → {{ record.targetRealm }}</span>
                  <span class="date">{{ formatDate(record.breakthroughDate) }}</span>
                </div>
                <div class="result">
                  <el-tag :type="record.success ? 'success' : 'danger'">
                    {{ record.success ? '突破成功' : '突破失败' }}
                  </el-tag>
                </div>
              </div>
            </div>
            <p v-else class="no-history">暂无突破记录</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { API_BASE_URL } from '@/config/api';

export default {
  name: 'BreakthroughView',
  computed: {
    gameStore() {
      return useGameStore();
    },
    cultivation() {
      // 从全局store获取修炼数据
      if (this.gameStore && this.gameStore.cultivation) {
        return this.gameStore.cultivation;
      }
      // 返回默认值以防store尚未初始化
      return {
        realm: '炼气期',
        realmLevel: 1,
        cultivationExp: 0,
        cultivationExpToNext: 100
      };
    }
  },
  data() {
    return {
      breakthroughConditions: null,
      isAttempting: false,
      breakthroughHistory: [],
      canAttemptBreakthrough: false
    };
  },
  methods: {
    async loadBreakthroughConditions() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/breakthrough/conditions/${this.cultivation.realm}/${this.cultivation.realmLevel}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 在实际应用中，这里需要添加认证token
            // 'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.breakthroughConditions = data;
        } else {
          // 如果API失败，使用默认条件
          this.breakthroughConditions = {
            requiredExp: 100,
            requiredItems: [],
            successRate: 0.9,
            description: '常规升级'
          };
        }
        
        // 检查是否可以突破
        this.checkBreakthroughEligibility();
      } catch (error) {
        console.error('加载突破条件失败:', error);
        // 错误时也使用默认条件
        this.breakthroughConditions = {
          requiredExp: 100,
          requiredItems: [],
          successRate: 0.9,
          description: '常规升级'
        };
        ElMessage.error('加载突破条件失败');
      }
    },
    
    async loadBreakthroughHistory() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/breakthrough/history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 在实际应用中，这里需要添加认证token
            // 'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.breakthroughHistory = data;
        } else {
          console.error('获取突破历史失败:', response.statusText);
          // 如果API调用失败，仍然显示一些示例数据
          this.breakthroughHistory = [];
        }
      } catch (error) {
        console.error('加载突破历史失败:', error);
        // 出错时也显示空数组，不显示模拟数据以避免混淆
        this.breakthroughHistory = [];
      }
    },
    
    async attemptBreakthrough() {
      this.isAttempting = true;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/breakthrough/attempt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 在实际应用中，这里需要添加认证token
            // 'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            currentRealm: this.cultivation.realm,
            realmLevel: this.cultivation.realmLevel
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          if (data.success) {
            // 更新全局store中的修炼数据
            this.gameStore.cultivation = { ...this.gameStore.cultivation, ...data.newState };
            ElMessage.success(data.message || `恭喜突破至${this.cultivation.realm}第${this.cultivation.realmLevel}层！`);
          } else {
            // 突破失败
            this.gameStore.cultivation = { ...this.gameStore.cultivation, ...data.newState };
            ElMessage.warning(data.message || '突破失败，修为有所损耗');
          }
          
          // 重新加载突破历史
          await this.loadBreakthroughHistory();
        } else {
          ElMessage.error(data.message || '突破尝试失败');
        }
        
        // 重新加载条件
        this.loadBreakthroughConditions();
      } catch (error) {
        console.error('突破尝试失败:', error);
        ElMessage.error('突破尝试失败');
      } finally {
        this.isAttempting = false;
      }
    },
    
    checkBreakthroughEligibility() {
      if (!this.breakthroughConditions) return;
      
      // 检查修为是否足够
      const hasEnoughExp = this.cultivation.cultivationExp >= this.breakthroughConditions.requiredExp;
      
      // 在真实应用中，还需要检查物品是否足够
      // 这里简化处理
      this.canAttemptBreakthrough = hasEnoughExp;
    },
    
    getExperiencePercentage() {
      if (this.cultivation.cultivationExpToNext <= 0) {
        return 0;
      }
      return (this.cultivation.cultivationExp / this.cultivation.cultivationExpToNext) * 100;
    },
    
    getProgressColor() {
      const percentage = this.getExperiencePercentage();
      if (percentage < 30) return '#909399'; // 灰色
      if (percentage < 70) return '#67C23A'; // 绿色
      if (percentage < 90) return '#E6A23C'; // 黄色
      return '#F56C6C'; // 红色
    },
    
    getNextRealm(currentRealm) {
      const realms = ['炼气期', '筑基期', '金丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期'];
      const currentIndex = realms.indexOf(currentRealm);
      
      if (currentIndex !== -1 && currentIndex < realms.length - 1) {
        return realms[currentIndex + 1];
      }
      
      return currentRealm; // 如果已经是最高境界，则返回当前境界
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    }
  },
  async mounted() {
    document.title = '文字修仙传 - 境界突破';
    
    // 加载突破条件和历史
    await this.loadBreakthroughConditions();
    await this.loadBreakthroughHistory();
  },
  watch: {
    cultivation: {
      handler() {
        this.loadBreakthroughConditions();
        this.checkBreakthroughEligibility();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.breakthrough {
  padding: 20px;
}

.current-status {
  margin-bottom: 20px;
}

.current-status h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.progress-container {
  margin: 20px 0;
}

.required-item {
  margin: 5px 0;
}

.breakthrough-history {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.history-item.success {
  background-color: #f0f9ff;
  border-left: 4px solid #409eff;
}

.history-item.failure {
  background-color: #fef0f0;
  border-left: 4px solid #f56c6c;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.realm {
  font-weight: bold;
}

.date {
  font-size: 12px;
  color: #999;
}

.no-history {
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>