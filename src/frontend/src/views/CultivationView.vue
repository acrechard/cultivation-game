<template>
  <div class="cultivation">
    <el-page-header @back="$router.go(-1)" content="修炼系统"></el-page-header>
    
    <el-row :gutter="20" class="cultivation-overview">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>修炼状态</span>
          </template>
          
          <div class="realm-display">
            <h3>{{ cultivation.realm }} · 第{{ cultivation.realmLevel }}层</h3>
            <p>当前境界: {{ getCultivationDescription(cultivation.realm) }}</p>
          </div>
          
          <div class="exp-progress">
            <p>修为进度: {{ cultivation.cultivationExp }} / {{ cultivation.cultivationExpToNext }}</p>
            <el-progress 
              :percentage="getExperiencePercentage()" 
              :color="getProgressColor()"
              :format="() => `${Math.round(getExperiencePercentage())}%`"
            />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>灵根资质</span>
          </template>
          
          <div class="spirit-root-section">
            <el-row :gutter="20">
              <el-col :span="8" v-for="root in spiritRoots" :key="root.element">
                <div class="spirit-root-item">
                  <div class="root-icon">{{ root.icon }}</div>
                  <div class="root-info">
                    <div class="root-name">{{ root.name }}</div>
                    <el-progress 
                      :percentage="Math.min(100, cultivation.spiritualRoot[root.key] * 20)" 
                      :color="getRootColor(root.key)"
                    />
                    <div class="root-value">资质: {{ cultivation.spiritualRoot[root.key] }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="cultivation-actions">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>功法选择</span>
          </template>
          
          <div class="cultivation-methods">
            <el-radio-group v-model="selectedMethod" class="method-group">
              <el-radio 
                v-for="method in cultivationMethods" 
                :key="method.name" 
                :label="method.name"
                class="method-option"
              >
                <div class="method-info">
                  <h4>{{ method.name }}</h4>
                  <p>{{ method.description }}</p>
                  <el-tag :type="getMethodTypeTag(method.type)">
                    {{ method.type }}
                  </el-tag>
                  <el-rate 
                    v-model="method.level" 
                    :max="10" 
                    disabled 
                    show-score 
                    score-template="{value}层"
                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  />
                </div>
              </el-radio>
            </el-radio-group>
          </div>
          
          <el-button 
            type="primary" 
            size="large" 
            @click="changeMethod"
            style="margin-top: 20px; width: 100%;"
          >
            更换功法
          </el-button>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>修炼控制</span>
          </template>
          
          <div class="cultivation-controls">
            <div class="current-method">
              <h4>当前功法: {{ cultivation.cultivationMethod.name }}</h4>
              <p>修炼效率: {{ cultivation.cultivationMethod.efficiency }}倍</p>
            </div>
            
            <el-button 
              type="success" 
              size="large" 
              @click="startCultivation"
              :loading="isCultivating"
              style="margin: 20px 0; width: 100%;"
            >
              <span v-if="!isCultivating">开始修炼</span>
              <span v-else>修炼中...</span>
            </el-button>
            
            <div class="cultivation-result" v-if="cultivationResult">
              <h4>本次修炼获得:</h4>
              <p>修为: +{{ cultivationResult.expGain }}</p>
              <p v-if="cultivationResult.message.includes('突破')">{{ cultivationResult.message }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>修炼排行榜</span>
          </template>
          
          <el-table :data="leaderboard" style="width: 100%">
            <el-table-column prop="rank" label="#" width="80" />
            <el-table-column prop="characterId.name" label="角色名" width="150" />
            <el-table-column prop="realm" label="境界" width="120" />
            <el-table-column prop="level" label="层数" width="80" />
            <el-table-column prop="experience" label="当前修为" width="120" />
            <el-table-column label="总进度">
              <template #default="scope">
                <el-progress 
                  :percentage="Math.min(100, (scope.row.experience / scope.row.nextLevelExp) * 100)" 
                  :format="() => ''"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { useGameStore } from '@/stores/game';

export default {
  name: 'CultivationView',
  computed: {
    gameStore() {
      return useGameStore();
    },
    cultivation() {
      // 从全局store获取修炼数据，确保store已定义
      if (this.gameStore && this.gameStore.cultivation) {
        return this.gameStore.cultivation;
      }
      // 返回默认值以防store尚未初始化
      return {
        realm: '炼气期',
        realmLevel: 1,
        cultivationExp: 0,
        cultivationExpToNext: 100,
        spiritualRoot: {
          wood: 1,
          fire: 1,
          earth: 1,
          metal: 1,
          water: 1
        },
        cultivationMethod: {
          name: '基础吐纳术',
          type: '功法',
          level: 1,
          efficiency: 1.0
        }
      };
    }
  },
  data() {
    return {
      selectedMethod: '基础吐纳术',
      isCultivating: false,
      cultivationResult: null,
      leaderboard: [],
      spiritRoots: [
        { key: 'wood', name: '木灵根', icon: '🌱', element: 'wood' },
        { key: 'fire', name: '火灵根', icon: '🔥', element: 'fire' },
        { key: 'earth', name: '土灵根', icon: '⛰️', element: 'earth' },
        { key: 'metal', name: '金灵根', icon: '💎', element: 'metal' },
        { key: 'water', name: '水灵根', icon: '💧', element: 'water' }
      ],
      cultivationMethods: [
        {
          name: '基础吐纳术',
          type: '功法',
          level: 1,
          description: '最基础的修炼功法，适合初学者，修炼效率一般',
          efficiency: 1.0
        },
        {
          name: '五行诀',
          type: '心法',
          level: 3,
          description: '注重五行平衡的修炼心法，对所有属性都有增益',
          efficiency: 1.2
        },
        {
          name: '烈焰功',
          type: '功法',
          level: 5,
          description: '偏向火属性的修炼功法，火系灵根修炼效率大幅提升',
          efficiency: 1.5
        },
        {
          name: '青莲剑诀',
          type: '武技',
          level: 4,
          description: '攻守兼备的修炼武技，在修炼的同时提升战斗力',
          efficiency: 1.3
        }
      ]
    };
  },
  methods: {
    getCultivationDescription(realm) {
      const descriptions = {
        '炼气期': '修炼之始，吸纳天地灵气，强化自身根基',
        '筑基期': '巩固根基，为后续修炼打下坚实基础',
        '结丹期': '凝聚金丹，体内真气化实',
        '元婴期': '金丹破碎，孕育元婴',
        '化神期': '元婴成长，神识大幅增强',
        '炼虚期': '炼化虚无，体悟天道',
        '合体期': '身心合一，与天地共鸣',
        '大乘期': '大道将成，只差最后一步',
        '渡劫期': '面临天劫考验，成败在此一举',
        '大罗金仙': '超脱轮回，成就金仙之位'
      };
      return descriptions[realm] || '未知境界';
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
    getRootColor(key) {
      const colors = {
        wood: '#52C41A',
        fire: '#F5222D',
        water: '#1890FF',
        metal: '#FAAD14',
        earth: '#D46B08'
      };
      return colors[key] || '#909399';
    },
    getMethodTypeTag(type) {
      const types = {
        功法: 'primary',
        心法: 'success',
        武技: 'warning'
      };
      return types[type] || 'info';
    },
    // 无需单独加载数据，因为数据来自全局store
    // 保留此方法是为了兼容可能的未来需求
    async loadCultivationData() {
      try {
        // 数据已从全局store中获取，无需额外API调用
        console.log('修炼数据已从全局store获取');
      } catch (error) {
        ElMessage.error('获取修炼数据失败');
      }
    },
    async startCultivation() {
      this.isCultivating = true;
      
      try {
        // 模拟API调用 - 减少修炼时间到200毫秒（0.2秒）
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 模拟修炼结果
        const expGain = Math.floor(Math.random() * 20) + 10;
        const newExp = this.gameStore.cultivation.cultivationExp + expGain;
        
        // 检查是否升级
        if (newExp >= this.gameStore.cultivation.cultivationExpToNext && this.gameStore.cultivation.cultivationExpToNext > 0) {
          // 更新全局store中的修炼数据
          this.gameStore.cultivation.realmLevel += 1;
          this.gameStore.cultivation.cultivationExp = newExp - this.gameStore.cultivation.cultivationExpToNext;
          this.gameStore.cultivation.cultivationExpToNext = Math.floor(this.gameStore.cultivation.cultivationExpToNext * 1.5);
          
          // 检查境界突破
          if (this.gameStore.cultivation.realmLevel % 10 === 0) {
            const realms = ['炼气期', '筑基期', '金丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期'];
            const currentRealmIndex = realms.indexOf(this.gameStore.cultivation.realm);
            if (currentRealmIndex < realms.length - 1) {
              this.gameStore.cultivation.realm = realms[currentRealmIndex + 1];
              ElMessage.success(`恭喜突破至${this.gameStore.cultivation.realm}！`);
            }
          }
          
          ElMessage.success(`修炼成功，获得${expGain}点修为！境界提升至第${this.gameStore.cultivation.realmLevel}层`);
        } else {
          this.gameStore.cultivation.cultivationExp = newExp;
          ElMessage.success(`修炼成功，获得${expGain}点修为！`);
        }
        
        // 更新游戏时间（模拟修炼消耗一个月游戏时间）
        this.updateGameTime();
        
        // 保存游戏状态到数据库
        const characterId = localStorage.getItem('characterId') || 'default_user';
        await this.gameStore.saveGameState(characterId);
        
        this.cultivationResult = {
          expGain,
          message: this.gameStore.cultivation.realmLevel % 10 === 0 ? `突破至${this.gameStore.cultivation.realm}！` : ''
        };
      } catch (error) {
        ElMessage.error('修炼失败');
      } finally {
        this.isCultivating = false;
      }
    },
    
    // 更新游戏时间的方法
    updateGameTime() {
      // 从全局store获取当前游戏时间
      let currentTime = new Date(this.gameStore.gameState.currentTime);
      
      // 模拟修炼消耗一个月游戏时间
      currentTime.setMonth(currentTime.getMonth() + 1);
      
      // 更新全局store中的游戏时间
      this.gameStore.gameState.currentTime = currentTime.toISOString();
      
      // 消耗寿命（每修炼一个月，年龄增加，寿命减少）
      this.consumeLife();
      
      // 显示时间流逝提示
      ElMessage.info(`时光飞逝，已过去一个月...`);
    },
    
    // 消耗寿命的方法
    consumeLife() {
      // 年龄增长
      this.gameStore.life.age += 1/12; // 每月增加1/12岁
      
      // 剩余寿命减少
      this.gameStore.life.remainingYears -= 1/12;
      
      // 如果剩余寿命小于等于0，则触发死亡事件
      if (this.gameStore.life.remainingYears <= 0) {
        ElMessage.error('寿元耗尽，修士陨落...');
        // 可以在这里添加死亡处理逻辑，比如重置游戏或进入特殊状态
      }
    },
    async changeMethod() {
      const selected = this.cultivationMethods.find(m => m.name === this.selectedMethod);
      if (selected) {
        this.gameStore.cultivation.cultivationMethod = {
          name: selected.name,
          type: selected.type,
          level: selected.level,
          efficiency: selected.efficiency
        };
        ElMessage.success(`功法更换为${selected.name}`);
      }
    },
    async loadLeaderboard() {
      // 模拟排行榜数据
      this.leaderboard = [
        { rank: 1, characterId: { name: '剑仙' }, realm: '元婴期', level: 25, experience: 80, nextLevelExp: 100 },
        { rank: 2, characterId: { name: '逍遥子' }, realm: '结丹期', level: 45, experience: 60, nextLevelExp: 100 },
        { rank: 3, characterId: { name: '青云道人' }, realm: '筑基期', level: 67, experience: 30, nextLevelExp: 100 },
        { rank: 4, characterId: { name: '无名修士' }, realm: '炼气期', level: 89, experience: 15, nextLevelExp: 100 },
        { rank: 5, characterId: { name: '隐世高人' }, realm: '化神期', level: 12, experience: 90, nextLevelExp: 100 }
      ].map((item, index) => ({ ...item, rank: index + 1 }));
    }
  },
  async mounted() {
    document.title = '文字修仙传 - 修炼系统';
    
    // 确保从全局store获取最新数据
    if (this.gameStore.isInitialized) {
      // 如果store已经初始化，则直接使用
      console.log('修炼系统已从全局状态加载数据');
    } else {
      // 如果store未初始化，等待其初始化完成
      // 这里可以添加等待逻辑，或者使用默认值直到初始化完成
      console.log('等待全局状态初始化...');
    }
    
    this.loadLeaderboard();
  }
};
</script>

<style scoped lang="scss">
.cultivation {
  padding: 20px;
}

.cultivation-overview {
  margin-bottom: 20px;
}

.realm-display {
  text-align: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0 0 10px;
    color: #409EFF;
    font-size: 1.5em;
  }
  
  p {
    margin: 0;
    color: #666;
  }
}

.exp-progress {
  p {
    margin: 0 0 10px;
    font-weight: bold;
  }
}

.spirit-root-section {
  .spirit-root-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    
    .root-icon {
      font-size: 24px;
      margin-right: 10px;
    }
    
    .root-info {
      flex: 1;
      
      .root-name {
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .root-value {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
      }
    }
  }
}

.cultivation-actions {
  margin-bottom: 20px;
}

.cultivation-methods {
  max-height: 400px;
  overflow-y: auto;
  
  .method-group {
    width: 100%;
  }
  
  .method-option {
    display: block;
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    
    &.el-radio.is-bordered {
      padding: 10px 15px;
    }
  }
  
  .method-info {
    h4 {
      margin: 0 0 5px 0;
    }
    
    p {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }
  }
}

.cultivation-controls {
  text-align: center;
  
  .current-method {
    text-align: left;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    
    h4 {
      margin: 0 0 5px 0;
      color: #409EFF;
    }
    
    p {
      margin: 0;
      color: #666;
    }
  }
  
  .cultivation-result {
    margin-top: 20px;
    padding: 15px;
    background-color: #f0f9eb;
    border-radius: 4px;
    
    h4 {
      margin: 0 0 10px 0;
      color: #67C23A;
    }
    
    p {
      margin: 5px 0;
    }
  }
}
</style>