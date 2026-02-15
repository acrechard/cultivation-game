<template>
  <div class="character">
    <el-page-header @back="$router.go(-1)" content="角色信息"></el-page-header>
    
    <el-row :gutter="20" class="character-overview">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>角色信息</span>
          </template>
          
          <div class="avatar-section">
            <div class="avatar">👤</div>
            <h3 class="character-name">{{ character.name }}</h3>
            <p class="character-title">{{ character.title || '修仙者' }}</p>
          </div>
          
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="ID">
              {{ userId }}
            </el-descriptions-item>
            <el-descriptions-item label="境界">
              <el-tag type="warning">{{ cultivation.realm }} · 第{{ cultivation.realmLevel }}层</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="修为">
              {{ cultivation.cultivationExp }} / {{ cultivation.cultivationExpToNext }}
            </el-descriptions-item>
            <el-descriptions-item label="年龄">
              {{ gameStore.life.age }}岁
            </el-descriptions-item>
            <el-descriptions-item label="寿命">
              {{ gameStore.life.remainingYears }} / {{ gameStore.life.maxAge }} 年
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ createTime }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>属性面板</span>
          </template>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="never" class="stat-card">
                <div class="stat-header">
                  <span>基础属性</span>
                </div>
                
                <div class="stat-item">
                  <span class="stat-label">生命值</span>
                  <el-progress 
                    :percentage="(character.health / character.maxHealth) * 100" 
                    :color="healthColor" 
                    :format="() => `${character.health}/${character.maxHealth}`"
                    :stroke-width="15"
                  />
                </div>
                
                <div class="stat-item">
                  <span class="stat-label">灵力值</span>
                  <el-progress 
                    :percentage="(character.mana / character.maxMana) * 100" 
                    :color="manaColor" 
                    :format="() => `${character.mana}/${character.maxMana}`"
                    :stroke-width="15"
                  />
                </div>
                
                <div class="stat-item">
                  <span class="stat-label">体力值</span>
                  <el-progress 
                    :percentage="90" 
                    :color="staminaColor" 
                    :format="() => `45/50`"
                    :stroke-width="15"
                  />
                </div>
              </el-card>
            </el-col>
            
            <el-col :span="12">
              <el-card shadow="never" class="stat-card">
                <div class="stat-header">
                  <span>战斗属性</span>
                </div>
                
                <div class="combat-stat">
                  <span class="stat-label">攻击力</span>
                  <span class="stat-value">20</span>
                </div>
                
                <div class="combat-stat">
                  <span class="stat-label">防御力</span>
                  <span class="stat-value">10</span>
                </div>
                
                <div class="combat-stat">
                  <span class="stat-label">暴击率</span>
                  <span class="stat-value">5%</span>
                </div>
                
                <div class="combat-stat">
                  <span class="stat-label">闪避率</span>
                  <span class="stat-value">3%</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="character-details">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>修炼信息</span>
          </template>
          
          <el-tabs v-model="activeTab">
            <el-tab-pane label="灵根资质" name="talent">
              <div class="talent-section">
                <h4>灵根类型：杂灵根</h4>
                <p>五行均衡，修炼各系功法无明显优劣</p>
                
                <div class="talent-grid">
                  <div class="talent-item">
                    <div class="talent-icon">🌱</div>
                    <div class="talent-info">
                      <div class="talent-name">木灵根</div>
                      <el-progress :percentage="getSpiritualRootPercentage('wood')" :color="getElementColor('wood')" />
                    </div>
                  </div>
                  <div class="talent-item">
                    <div class="talent-icon">🔥</div>
                    <div class="talent-info">
                      <div class="talent-name">火灵根</div>
                      <el-progress :percentage="getSpiritualRootPercentage('fire')" :color="getElementColor('fire')" />
                    </div>
                  </div>
                  <div class="talent-item">
                    <div class="talent-icon">💧</div>
                    <div class="talent-info">
                      <div class="talent-name">水灵根</div>
                      <el-progress :percentage="getSpiritualRootPercentage('water')" :color="getElementColor('water')" />
                    </div>
                  </div>
                  <div class="talent-item">
                    <div class="talent-icon">💎</div>
                    <div class="talent-info">
                      <div class="talent-name">金灵根</div>
                      <el-progress :percentage="getSpiritualRootPercentage('metal')" :color="getElementColor('metal')" />
                    </div>
                  </div>
                  <div class="talent-item">
                    <div class="talent-icon">⛰️</div>
                    <div class="talent-info">
                      <div class="talent-name">土灵根</div>
                      <el-progress :percentage="getSpiritualRootPercentage('earth')" :color="getElementColor('earth')" />
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="功法技能" name="skills">
              <div class="skills-section">
                <el-table :data="skills" style="width: 100%">
                  <el-table-column prop="name" label="功法名称" width="180" />
                  <el-table-column prop="type" label="类型" width="120">
                    <template #default="scope">
                      <el-tag 
                        :type="getSkillTypeTag(scope.row.type)" 
                        size="small"
                      >
                        {{ scope.row.type }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="level" label="等级" width="100">
                    <template #default="scope">
                      <el-rate 
                        v-model="scope.row.level" 
                        :max="10" 
                        disabled 
                        show-score 
                        score-template="{value}层"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="描述" />
                </el-table>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="修炼历程" name="history">
              <el-timeline>
                <el-timeline-item 
                  v-for="(event, index) in cultivationHistory" 
                  :key="index" 
                  :timestamp="event.timestamp" 
                  :color="getTimelineColor(event.type)"
                >
                  <el-card>
                    <h4>{{ event.title }}</h4>
                    <p>{{ event.description }}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>快捷操作</span>
          </template>
          
          <div class="quick-actions">
            <el-button 
              type="primary" 
              size="large" 
              style="width: 100%; margin-bottom: 15px;"
              @click="goToCultivation"
            >
              🧘 闭关修炼
            </el-button>
            <el-button 
              type="success" 
              size="large" 
              style="width: 100%; margin-bottom: 15px;"
              @click="goToExploration"
            >
              🗺️ 外出历练
            </el-button>
            <el-button 
              type="warning" 
              size="large" 
              style="width: 100%; margin-bottom: 15px;"
              @click="goToInventory"
            >
              🎒 查看背包
            </el-button>
            <el-button 
              type="danger" 
              size="large" 
              style="width: 100%;"
              @click="goToTasks"
            >
              📋 查看任务
            </el-button>
          </div>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <span>状态加成</span>
          </template>
          
          <div class="buff-list">
            <div class="buff-item" v-for="(buff, index) in buffs" :key="index">
              <div class="buff-icon">{{ buff.icon }}</div>
              <div class="buff-info">
                <div class="buff-name">{{ buff.name }}</div>
                <div class="buff-duration">{{ buff.duration }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useGameStore } from '@/stores/game';

export default {
  name: 'CharacterView',
  computed: {
    gameStore() {
      return useGameStore();
    },
    character() {
      return this.gameStore.character;
    },
    cultivation() {
      return this.gameStore.cultivation;
    },
    userId() {
      // 使用存储在localStorage中的固定角色ID
      return localStorage.getItem('characterId') || 'default_user';
    },
    createTime() {
      // 使用store中的创建时间或默认当前时间
      return this.gameStore.character.createdAt ? 
        new Date(this.gameStore.character.createdAt).toLocaleDateString() : 
        new Date().toLocaleDateString();
    },
    healthColor() {
      return '#67C23A'; // 绿色
    },
    manaColor() {
      return '#409EFF'; // 蓝色
    },
    staminaColor() {
      return '#E6A23C'; // 黄色
    }
  },
  data() {
    return {
      activeTab: 'talent',
      skills: [
        {
          name: '基础吐纳术',
          type: '功法',
          level: 3,
          description: '最基础的修炼功法，用于吸收天地灵气'
        },
        {
          name: '引气入体',
          type: '心法',
          level: 2,
          description: '将吸收的灵气引导至经脉中运行'
        },
        {
          name: '基础剑法',
          type: '武技',
          level: 1,
          description: '最基础的剑法招式'
        }
      ],
      cultivationHistory: [
        {
          timestamp: '刚刚',
          type: 'milestone',
          title: '创建角色',
          description: '无名修士开始了修仙之路'
        },
        {
          timestamp: '5分钟前',
          type: 'event',
          title: '首次修炼',
          description: '成功进行了第一次修炼，获得10点修为'
        },
        {
          timestamp: '1小时前',
          type: 'achievement',
          title: '击败野兔',
          description: '在新手村击败第一只野兔'
        }
      ],
      buffs: [
        {
          icon: '🌱',
          name: '灵根亲和',
          duration: '永久'
        },
        {
          icon: '⚡',
          name: '修炼加速',
          duration: '2小时15分钟'
        }
      ]
    };
  },
  methods: {
    getSpiritualRootPercentage(element) {
      // 从全局store获取灵根数据并转换为百分比 (1-10对应0-100%)
      const value = this.cultivation.spiritualRoot[element];
      return Math.min(100, value * 10); // 将数值映射到0-100%
    },
    getElementColor(element) {
      const colors = {
        wood: '#52C41A',
        fire: '#F5222D',
        water: '#1890FF',
        metal: '#FAAD14',
        earth: '#D46B08'
      };
      return colors[element] || '#909399';
    },
    getSkillTypeTag(type) {
      const types = {
        功法: 'primary',
        心法: 'success',
        武技: 'warning'
      };
      return types[type] || 'info';
    },
    getTimelineColor(type) {
      const colors = {
        milestone: '#409EFF',
        event: '#67C23A',
        achievement: '#E6A23C'
      };
      return colors[type] || '#909399';
    },
    goToCultivation() {
      this.$router.push('/cultivation');
    },
    goToExploration() {
      this.$router.push('/exploration');
    },
    goToInventory() {
      this.$router.push('/inventory');
    },
    goToTasks() {
      this.$router.push('/tasks');
    }
  },
  mounted() {
    document.title = '文字修仙传 - 角色信息';
  }
};
</script>

<style scoped lang="scss">
.character-overview {
  margin: 20px 0;
}

.avatar-section {
  text-align: center;
  margin-bottom: 20px;
  
  .avatar {
    font-size: 60px;
    margin: 0 auto 10px;
  }
  
  .character-name {
    margin: 0 0 5px;
    font-size: 1.5em;
  }
  
  .character-title {
    margin: 0;
    color: #999;
  }
}

.stat-card {
  margin-bottom: 20px;
  
  .stat-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .stat-item {
    margin-bottom: 15px;
    
    .stat-label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
  }
  
  .combat-stat {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .stat-label {
      font-weight: bold;
    }
    
    .stat-value {
      font-weight: bold;
      color: #409EFF;
    }
  }
}

.talent-section {
  h4 {
    margin: 0 0 10px;
    color: #409EFF;
  }
  
  p {
    margin: 0 0 20px;
    color: #666;
  }
  
  .talent-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .talent-item {
    display: flex;
    align-items: center;
    
    .talent-icon {
      font-size: 24px;
      margin-right: 10px;
    }
    
    .talent-info {
      flex: 1;
      
      .talent-name {
        font-weight: bold;
        margin-bottom: 5px;
      }
    }
  }
}

.skills-section {
  padding: 10px 0;
}

.quick-actions {
  display: flex;
  flex-direction: column;
}

.buff-list {
  .buff-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .buff-icon {
      font-size: 20px;
      margin-right: 10px;
    }
    
    .buff-info {
      flex: 1;
      
      .buff-name {
        font-weight: bold;
      }
      
      .buff-duration {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.character-details {
  margin-top: 20px;
}
</style>