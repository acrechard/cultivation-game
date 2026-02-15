<template>
  <div class="exploration">
    <el-page-header @back="$router.go(-1)" content="探索世界"></el-page-header>
    
    <el-row :gutter="20" class="exploration-map">
      <el-col :span="16">
        <el-card>
          <template #header>
            <strong>世界地图</strong>
          </template>
          
          <div class="map-container">
            <el-tabs v-model="activeMap" type="card">
              <el-tab-pane label="新手村" name="village">
                <div class="location-info">
                  <h3>新手村</h3>
                  <p>安全区域，适合初学者修炼</p>
                  <p>可遇怪物：野兔、野狼</p>
                  <p>可采集：普通草药</p>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="changeLocation('village')"
                    style="margin-top: 10px;"
                  >
                    切换至此
                  </el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="青云山脉" name="mountain">
                <div class="location-info">
                  <h3>青云山脉</h3>
                  <p>初级修炼者聚集地</p>
                  <p>可遇怪物：山猪、毒蛇</p>
                  <p>可采集：灵芝、何首乌</p>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="changeLocation('mountain')"
                    style="margin-top: 10px;"
                  >
                    切换至此
                  </el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="幽暗森林" name="forest">
                <div class="location-info">
                  <h3>幽暗森林</h3>
                  <p>中级修炼区域</p>
                  <p>可遇怪物：树妖、毒虫</p>
                  <p>可采集：千年灵芝、龙须草</p>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="changeLocation('forest')"
                    style="margin-top: 10px;"
                  >
                    切换至此
                  </el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="修仙城" name="city">
                <div class="location-info">
                  <h3>修仙城</h3>
                  <p>修仙者聚集的繁华城市</p>
                  <p>可进行：交易、任务、交流</p>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="changeLocation('city')"
                    style="margin-top: 10px;"
                  >
                    切换至此
                  </el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <strong>探索控制</strong>
          </template>
          
          <div class="exploration-controls">
            <el-button 
              type="primary" 
              size="large" 
              style="width: 100%; margin-bottom: 15px;"
              @click="exploreCurrentArea"
            >
              🧭 探索当前区域
            </el-button>
            
            <el-button 
              type="success" 
              size="large" 
              style="width: 100%; margin-bottom: 15px;"
              @click="searchTreasure"
            >
              🔍 寻找机缘
            </el-button>
            
            <el-button 
              type="warning" 
              size="large" 
              style="width: 100%; margin-bottom: 15px;"
              @click="huntMonsters"
            >
              ⚔️ 猎杀怪物
            </el-button>
            
            <el-button 
              type="info" 
              size="large" 
              style="width: 100%;"
              @click="collectHerbs"
            >
              🌿 采集草药
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="exploration-log">
      <el-col :span="24">
        <el-card>
          <template #header>
            <strong>探索日志</strong>
          </template>
          
          <el-timeline>
            <el-timeline-item 
              v-for="(log, index) in explorationLogs" 
              :key="index" 
              :timestamp="log.timestamp" 
              placement="top"
            >
              <el-card>
                <h4>{{ log.action }}</h4>
                <p>{{ log.description }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { API_BASE_URL } from '@/config/api';
import { ElMessage } from 'element-plus';

export default {
  name: 'ExplorationView',
  computed: {
    explorationInfo() {
      // 从全局store获取探索数据
      return this.gameStore.exploration;
    },
    gameStore() {
      return useGameStore();
    }
  },
  data() {
    return {
      activeMap: 'village',
      explorationLogs: [
        {
          timestamp: '刚刚',
          action: '进入新手村',
          description: '无名修士进入了新手村'
        }
      ]
    };
  },
  async mounted() {
    document.title = '文字修仙传 - 探索世界';
    await this.loadExplorationInfo();
    
    // 从全局store加载探索日志
    if (this.gameStore.exploration.explorationLogs && this.gameStore.exploration.explorationLogs.length > 0) {
      this.explorationLogs = [...this.gameStore.exploration.explorationLogs];
    }
  },
  methods: {
    async loadExplorationInfo() {
      try {
        // 在测试环境中，如果localStorage中没有token，我们直接使用模拟数据
        const token = localStorage.getItem('token');
        if (!token) {
          // 如果全局store已初始化，直接使用其数据
          if (this.gameStore.isInitialized) {
            this.activeMap = this.gameStore.exploration.currentLocation;
          } else {
            // 否则使用默认值
            this.gameStore.exploration.currentLocation = 'village';
            this.gameStore.exploration.visitedLocations = ['village'];
            this.gameStore.exploration.explorationPoints = 0;
            this.activeMap = 'village';
          }
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/exploration`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // 更新全局store中的探索数据
          this.gameStore.exploration.currentLocation = data.currentLocation || 'village';
          this.gameStore.exploration.visitedLocations = data.visitedLocations || ['village'];
          this.gameStore.exploration.explorationPoints = data.explorationPoints || 0;
          this.activeMap = this.gameStore.exploration.currentLocation;
        } else {
          // 如果API调用失败，使用全局store中的数据
          this.activeMap = this.gameStore.exploration.currentLocation;
        }
      } catch (error) {
        console.error('加载探索信息失败:', error);
        // 发生错误时使用全局store中的数据
        this.activeMap = this.gameStore.exploration.currentLocation;
      }
    },
    async changeLocation(location) {
      // 检查是否有token，如果没有则使用模拟数据
      const token = localStorage.getItem('token');
      if (!token) {
        // 使用模拟响应
        this.activeMap = location;
        // 更新全局store中的当前位置
        this.gameStore.exploration.currentLocation = location;
        // 如果位置不在访问过的地点列表中，添加它
        if (!this.gameStore.exploration.visitedLocations.includes(location)) {
          this.gameStore.exploration.visitedLocations.push(location);
        }
        this.addLog('位置变更', `已移动到${getLocationName(location)}`);
        ElMessage.success(`已移动到${getLocationName(location)}`);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/exploration/location`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ location })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.activeMap = location;
          // 更新全局store中的当前位置
          this.gameStore.exploration.currentLocation = location;
          // 如果位置不在访问过的地点列表中，添加它
          if (!this.gameStore.exploration.visitedLocations.includes(location)) {
            this.gameStore.exploration.visitedLocations.push(location);
          }
          this.addLog('位置变更', result.message);
          ElMessage.success(result.message);
        } else {
          const error = await response.json();
          ElMessage.error(error.error || '位置变更失败');
        }
      } catch (error) {
        console.error('位置变更失败:', error);
        ElMessage.error('网络错误，位置变更失败');
      }
    },
    async exploreCurrentArea() {
      // 检查是否有token，如果没有则使用模拟数据
      const token = localStorage.getItem('token');
      if (!token) {
        // 使用模拟响应
        const locations = {
          village: '新手村',
          mountain: '青云山脉',
          forest: '幽暗森林',
          city: '修仙城'
        };
        
        const currentLocation = locations[this.activeMap];
        const events = [
          '发现了一株普通草药',
          '遇到了一只野兔',
          '找到了一个小洞穴',
          '遇到了一位老修士',
          '发现了一块灵石碎片'
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.addLog('探索', `在${currentLocation}${randomEvent}`);
        ElMessage.success(`探索成功，获得1探索点`);
        // 更新全局store中的探索点数
        this.gameStore.exploration.explorationPoints += 1;
        // 消耗游戏时间（探索一次消耗一天游戏时间）
        this.consumeGameTime(1/30); // 1天 = 1/30个月
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/exploration/explore`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ characterId: localStorage.getItem('characterId') })
        });
        
        if (response.ok) {
          const result = await response.json();
          // 更新全局store中的探索点数
          this.gameStore.exploration.explorationPoints = result.explorationPoints;
          
          let description = '';
          if (result.results.type === 'resource') {
            description = `发现了${result.results.resource.name}×${result.results.resource.quantity}`;
          } else if (result.results.type === 'monster') {
            description = `遇到了${result.results.monster}`;
          } else {
            description = result.results.message;
          }
          
          this.addLog(result.message, description);
          ElMessage.success(`探索成功，获得1探索点`);
          // 消耗游戏时间（探索一次消耗一天游戏时间）
          this.consumeGameTime(1/30); // 1天 = 1/30个月
        } else if (response.status === 429) {
          const error = await response.json();
          ElMessage.warning(error.error);
        } else {
          const error = await response.json();
          ElMessage.error(error.error || '探索失败');
        }
      } catch (error) {
        console.error('探索失败:', error);
        ElMessage.error('网络错误，探索失败');
      }
    },
    
    // 消耗游戏时间的方法
    consumeGameTime(months) {
      // 从全局store获取当前游戏时间
      let currentTime = new Date(this.gameStore.gameState.currentTime);
      
      // 根据参数增加游戏时间
      currentTime.setMonth(currentTime.getMonth() + months);
      
      // 更新全局store中的游戏时间
      this.gameStore.gameState.currentTime = currentTime.toISOString();
      
      // 消耗寿命（按比例消耗）
      this.consumeLife(months);
      
      // 显示时间流逝提示
      if (months >= 1) {
        const wholeMonths = Math.floor(months);
        const days = Math.round((months - wholeMonths) * 30);
        let timeString = '';
        if (wholeMonths > 0) timeString += `${wholeMonths}个月`;
        if (days > 0) timeString += `${days}天`;
        ElMessage.info(`时光飞逝，已过去${timeString}...`);
      } else {
        const days = Math.round(months * 30);
        if (days > 0) {
          ElMessage.info(`时光飞逝，已过去${days}天...`);
        }
      }
    },
    
    // 消耗寿命的方法
    consumeLife(months) {
      // 年龄增长
      this.gameStore.life.age += months/12; // 按月数增加年龄
      
      // 剩余寿命减少
      this.gameStore.life.remainingYears -= months/12;
      
      // 如果剩余寿命小于等于0，则触发死亡事件
      if (this.gameStore.life.remainingYears <= 0) {
        ElMessage.error('寿元耗尽，修士陨落...');
        // 可以在这里添加死亡处理逻辑，比如重置游戏或进入特殊状态
      }
    },
    async searchTreasure() {
      // 检查是否有token，如果没有则使用模拟数据
      const token = localStorage.getItem('token');
      if (!token) {
        // 使用模拟响应
        const success = Math.random() > 0.7;
        if (success) {
          const treasures = [
            '获得了聚气丹×1',
            '获得了铁剑×1',
            '获得了10枚灵石',
            '学会了基础吐纳术'
          ];
          
          const treasure = treasures[Math.floor(Math.random() * treasures.length)];
          this.addLog('机缘发现', treasure);
          ElMessage.success(treasure);
        } else {
          this.addLog('机缘发现', '暂时没有发现特殊机缘，继续努力探索吧！');
          ElMessage.info('暂时没有发现特殊机缘，继续努力探索吧！');
        }
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/exploration/treasure`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.treasure.success) {
            this.addLog(result.message, result.treasure.message);
            ElMessage.success(result.treasure.message);
          } else {
            this.addLog(result.message, result.treasure.message);
            ElMessage.info(result.treasure.message);
          }
        } else if (response.status === 429) {
          const error = await response.json();
          ElMessage.warning(error.error);
        } else {
          const error = await response.json();
          ElMessage.error(error.error || '寻宝失败');
        }
      } catch (error) {
        console.error('寻宝失败:', error);
        ElMessage.error('网络错误，寻宝失败');
      }
    },
    async huntMonsters() {
      // 检查是否有token，如果没有则使用模拟数据
      const token = localStorage.getItem('token');
      if (!token) {
        // 使用模拟响应
        const monsters = [
          '击败了野兔，获得了10经验',
          '击败了野狼，获得了20经验',
          '击败了山猪，获得了30经验',
          '击败了毒蛇，获得了25经验'
        ];
        
        const monsterResult = monsters[Math.floor(Math.random() * monsters.length)];
        this.addLog('猎杀怪物', monsterResult);
        ElMessage.success(monsterResult);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/exploration/hunt`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          
          this.addLog(result.message, result.result.message);
          
          if (result.result.success) {
            ElMessage.success(result.result.message);
          } else {
            ElMessage.warning(result.result.message);
          }
        } else if (response.status === 429) {
          const error = await response.json();
          ElMessage.warning(error.error);
        } else {
          const error = await response.json();
          ElMessage.error(error.error || '狩猎失败');
        }
      } catch (error) {
        console.error('狩猎失败:', error);
        ElMessage.error('网络错误，狩猎失败');
      }
    },
    async collectHerbs() {
      // 检查是否有token，如果没有则使用模拟数据
      const token = localStorage.getItem('token');
      if (!token) {
        // 使用模拟响应
        const herbs = [
          '采集到了普通草药×2',
          '采集到了灵芝×1',
          '采集到了何首乌×1',
          '采集到了龙须草×1'
        ];
        
        const herbResult = herbs[Math.floor(Math.random() * herbs.length)];
        this.addLog('采集草药', herbResult);
        ElMessage.success(herbResult);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/exploration/collect`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          
          this.addLog(result.message, result.result.message);
          ElMessage.success(result.result.message);
        } else if (response.status === 429) {
          const error = await response.json();
          ElMessage.warning(error.error);
        } else {
          const error = await response.json();
          ElMessage.error(error.error || '采集失败');
        }
      } catch (error) {
        console.error('采集失败:', error);
        ElMessage.error('网络错误，采集失败');
      }
    },
    addLog(action, description) {
      const newLogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        action,
        description
      };
      
      // 添加到全局store中的探索日志
      this.gameStore.exploration.explorationLogs.unshift(newLogEntry);
      
      // 限制日志数量
      if (this.gameStore.exploration.explorationLogs.length > 10) {
        this.gameStore.exploration.explorationLogs.pop();
      }
      
      // 同时添加到本地日志（保持向后兼容）
      this.explorationLogs.unshift(newLogEntry);
      if (this.explorationLogs.length > 10) {
        this.explorationLogs.pop();
      }
    },
    
    getLocationName(locationKey) {
      const locationNames = {
        village: '新手村',
        mountain: '青云山脉',
        forest: '幽暗森林',
        city: '修仙城'
      };
      
      return locationNames[locationKey] || locationKey;
    }
  }
};
</script>

<style scoped lang="scss">
.exploration-map {
  margin: 20px 0;
}

.map-container {
  min-height: 400px;
}

.location-info {
  text-align: center;
  padding: 20px;
  
  h3 {
    color: #409EFF;
    margin-bottom: 10px;
  }
  
  p {
    margin: 5px 0;
    color: #666;
  }
}

.exploration-controls {
  display: flex;
  flex-direction: column;
}

.exploration-log {
  margin: 20px 0;
}
</style>