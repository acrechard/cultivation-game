<template>
  <div class="battle">
    <el-page-header @back="$router.go(-1)" content="战斗系统"></el-page-header>
    
    <el-row :gutter="20" class="battle-area">
      <el-col :span="12">
        <el-card class="player-section">
          <template #header>
            <span>我方</span>
          </template>
          
          <div class="character-info">
            <div class="avatar">
              <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="角色头像" />
            </div>
            <div class="stats">
              <h3>{{ player.name }}</h3>
              <div class="health-bar">
                <p>生命值: {{ player.health.current }} / {{ player.health.max }}</p>
                <el-progress 
                  :percentage="getPlayerHealthPercentage()" 
                  :color="getHealthBarColor(getPlayerHealthPercentage())"
                  :format="() => ''"
                />
              </div>
              <div class="mana-bar">
                <p>灵力: {{ player.mana.current }} / {{ player.mana.max }}</p>
                <el-progress 
                  :percentage="getPlayerManaPercentage()" 
                  :color="getManaBarColor()"
                  :format="() => ''"
                />
              </div>
              <div class="stamina-bar">
                <p>体力: {{ player.stamina.current }} / {{ player.stamina.max }}</p>
                <el-progress 
                  :percentage="getPlayerStaminaPercentage()" 
                  :color="getStaminaBarColor()"
                  :format="() => ''"
                />
              </div>
              
              <div class="attributes">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <div class="attribute">
                      <i class="el-icon-magic-stick"></i>
                      攻击: {{ player.attributes.attack }}
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="attribute">
                      <i class="el-icon-lock"></i>
                      防御: {{ player.attributes.defense }}
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="attribute">
                      <i class="el-icon-lightning"></i>
                      速度: {{ player.attributes.speed }}
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="enemy-section">
          <template #header>
            <span>敌人</span>
          </template>
          
          <div class="character-info">
            <div class="avatar">
              <img src="https://cube.elemecdn.com/e/5d/c0e358f3aecb2c7c7c5a3aa9b6530c.png" alt="敌人头像" />
            </div>
            <div class="stats">
              <h3>{{ enemy.name }}</h3>
              <div class="health-bar">
                <p>生命值: {{ enemy.health.current }} / {{ enemy.health.max }}</p>
                <el-progress 
                  :percentage="getEnemyHealthPercentage()" 
                  :color="getHealthBarColor(getEnemyHealthPercentage())"
                  :format="() => ''"
                />
              </div>
              <div class="mana-bar">
                <p>灵力: {{ enemy.mana.current }} / {{ enemy.mana.max }}</p>
                <el-progress 
                  :percentage="getEnemyManaPercentage()" 
                  :color="getManaBarColor()"
                  :format="() => ''"
                />
              </div>
              <div class="stamina-bar">
                <p>体力: {{ enemy.stamina.current }} / {{ enemy.stamina.max }}</p>
                <el-progress 
                  :percentage="getEnemyStaminaPercentage()" 
                  :color="getStaminaBarColor()"
                  :format="() => ''"
                />
              </div>
              
              <div class="attributes">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <div class="attribute">
                      <i class="el-icon-magic-stick"></i>
                      攻击: {{ enemy.attributes.attack }}
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="attribute">
                      <i class="el-icon-lock"></i>
                      防御: {{ enemy.attributes.defense }}
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="attribute">
                      <i class="el-icon-lightning"></i>
                      速度: {{ enemy.attributes.speed }}
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>技能选择</span>
          </template>
          
          <div class="skills-section">
            <el-button 
              v-for="skill in player.skills" 
              :key="skill.name"
              type="primary"
              plain
              @click="useSkill(skill)"
              :disabled="!canUseSkill(skill)"
              style="margin: 5px;"
            >
              {{ skill.name }} (消耗: {{ skill.cost }} MP)
            </el-button>
            
            <el-button 
              type="danger" 
              @click="attack"
              style="margin: 5px;"
            >
              普通攻击
            </el-button>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>战斗日志</span>
          </template>
          
          <div class="battle-log">
            <div 
              v-for="(log, index) in battleLog" 
              :key="index" 
              class="log-entry"
              :class="log.type"
            >
              {{ log.text }}
            </div>
            <div v-if="battleLog.length === 0" class="empty-log">
              战斗尚未开始...
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>战斗控制</span>
          </template>
          
          <div class="battle-controls">
            <el-button 
              type="success" 
              @click="startBattle"
              :disabled="battleStatus !== 'idle'"
            >
              开始战斗
            </el-button>
            <el-button 
              type="warning" 
              @click="pauseBattle"
              :disabled="battleStatus !== 'active'"
            >
              暂停战斗
            </el-button>
            <el-button 
              type="info" 
              @click="resetBattle"
            >
              重新开始
            </el-button>
            <el-button 
              type="danger" 
              @click="retreat"
              :disabled="battleStatus === 'idle'"
            >
              逃跑
            </el-button>
            
            <div class="battle-status" v-if="battleStatus !== 'idle'">
              <el-tag 
                :type="getStatusTagType(battleStatus)"
                style="margin-left: 20px;"
              >
                {{ getBattleStatusText() }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: 'BattleView',
  data() {
    return {
      player: {
        name: '无名修士',
        level: 10,
        health: { current: 100, max: 100 },
        mana: { current: 80, max: 80 },
        stamina: { current: 70, max: 70 },
        attributes: {
          attack: 25,
          defense: 15,
          speed: 20,
          critRate: 0.15, // 暴击率
          dodgeRate: 0.05 // 闪避率
        },
        spiritRoot: {
          wood: 2,
          fire: 3,
          earth: 2,
          metal: 1,
          water: 2
        },
        skills: [
          { name: '五行拳', cost: 10, damage: 20, type: 'physical' },
          { name: '烈焰咒', cost: 15, damage: 30, type: 'magic' },
          { name: '金钟罩', cost: 20, damage: 0, type: 'defense' },
          { name: '疾风步', cost: 12, damage: 0, type: 'speed' }
        ]
      },
      enemy: {
        name: '山中野怪',
        level: 8,
        health: { current: 80, max: 80 },
        mana: { current: 50, max: 50 },
        stamina: { current: 60, max: 60 },
        attributes: {
          attack: 20,
          defense: 10,
          speed: 15,
          critRate: 0.10,
          dodgeRate: 0.03
        },
        spiritRoot: {
          wood: 1,
          fire: 2,
          earth: 3,
          metal: 1,
          water: 1
        },
        skills: [
          { name: '爪击', cost: 5, damage: 15, type: 'physical' },
          { name: '咆哮', cost: 8, damage: 10, type: 'magic' }
        ]
      },
      battleLog: [],
      battleStatus: 'idle', // idle, active, paused, won, lost
      isPlayerTurn: true
    };
  },
  methods: {
    getPlayerHealthPercentage() {
      return (this.player.health.current / this.player.health.max) * 100;
    },
    getPlayerManaPercentage() {
      return (this.player.mana.current / this.player.mana.max) * 100;
    },
    getPlayerStaminaPercentage() {
      return (this.player.stamina.current / this.player.stamina.max) * 100;
    },
    getEnemyHealthPercentage() {
      return (this.enemy.health.current / this.enemy.health.max) * 100;
    },
    getEnemyManaPercentage() {
      return (this.enemy.mana.current / this.enemy.mana.max) * 100;
    },
    getEnemyStaminaPercentage() {
      return (this.enemy.stamina.current / this.enemy.stamina.max) * 100;
    },
    getHealthBarColor(percentage) {
      if (percentage > 70) return '#67C23A'; // 绿色
      if (percentage > 30) return '#E6A23C'; // 黄色
      return '#F56C6C'; // 红色
    },
    getManaBarColor() {
      return '#409EFF'; // 蓝色
    },
    getStaminaBarColor() {
      return '#E46F0F'; // 橙色
    },
    canUseSkill(skill) {
      return this.player.mana.current >= skill.cost && this.isPlayerTurn && this.battleStatus === 'active';
    },
    startBattle() {
      this.battleStatus = 'active';
      this.addBattleLog('战斗开始！', 'system');
      this.isPlayerTurn = true;
      
      // 消耗游戏时间（开始战斗消耗少量时间）
      this.consumeGameTime(1/120); // 0.25天 = 1/120个月
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
    pauseBattle() {
      this.battleStatus = 'paused';
      this.addBattleLog('战斗已暂停', 'system');
    },
    resetBattle() {
      this.player.health.current = this.player.health.max;
      this.player.mana.current = this.player.mana.max;
      this.player.stamina.current = this.player.stamina.max;
      
      this.enemy.health.current = this.enemy.health.max;
      this.enemy.mana.current = this.enemy.mana.max;
      this.enemy.stamina.current = this.enemy.stamina.max;
      
      this.battleLog = [];
      this.battleStatus = 'idle';
      this.addBattleLog('战斗已重置', 'system');
    },
    retreat() {
      this.addBattleLog('成功逃离战斗！', 'system');
      this.battleStatus = 'idle';
    },
    getStatusTagType(status) {
      const types = {
        active: 'success',
        paused: 'warning',
        won: 'primary',
        lost: 'danger'
      };
      return types[status] || 'info';
    },
    getBattleStatusText() {
      const texts = {
        active: '战斗进行中',
        paused: '战斗已暂停',
        won: '战斗胜利',
        lost: '战斗失败'
      };
      return texts[this.battleStatus] || '待开始';
    },
    addBattleLog(text, type = 'normal') {
      this.battleLog.push({ text, type, timestamp: new Date() });
      
      // 只保留最近20条记录
      if (this.battleLog.length > 20) {
        this.battleLog.shift();
      }
    },
    attack() {
      if (!this.isPlayerTurn || this.battleStatus !== 'active') return;
      
      // 普通攻击
      const damage = this.calculateDamage(this.player.attributes.attack, this.enemy.attributes.defense);
      this.enemy.health.current = Math.max(0, this.enemy.health.current - damage);
      
      // 判断暴击
      const isCrit = Math.random() < this.player.attributes.critRate;
      if (isCrit) {
        const critDamage = Math.floor(damage * 1.5);
        this.enemy.health.current = Math.max(0, this.enemy.health.current - critDamage);
        this.addBattleLog(`你对${this.enemy.name}造成${damage + critDamage}点伤害（暴击！）`, 'player');
      } else {
        this.addBattleLog(`你对${this.enemy.name}造成${damage}点伤害`, 'player');
      }
      
      this.checkBattleEnd();
      
      if (this.battleStatus === 'active') {
        // 消耗时间进行战斗回合
        this.consumeGameTime(1/120); // 0.25天 = 1/120个月
        setTimeout(() => {
          this.enemyTurn();
        }, 1000);
      }
    },
    
    useSkill(skill) {
      if (!this.canUseSkill(skill)) return;
      
      // 消耗灵力
      this.player.mana.current -= skill.cost;
      
      if (skill.damage > 0) {
        // 技能攻击
        const damage = this.calculateDamage(
          this.player.attributes.attack + skill.damage, 
          this.enemy.attributes.defense
        );
        this.enemy.health.current = Math.max(0, this.enemy.health.current - damage);
        
        this.addBattleLog(`你使用${skill.name}对${this.enemy.name}造成${damage}点伤害`, 'player');
      } else {
        // 辅助技能
        if (skill.type === 'defense') {
          // 提升防御
          this.addBattleLog(`你使用${skill.name}提升了自己的防御力`, 'player');
        } else if (skill.type === 'speed') {
          // 提升速度
          this.addBattleLog(`你使用${skill.name}提升了自己速度`, 'player');
        }
      }
      
      this.checkBattleEnd();
      
      if (this.battleStatus === 'active') {
        setTimeout(() => {
          this.enemyTurn();
        }, 1000);
      }
    },
    enemyTurn() {
      if (this.battleStatus !== 'active') return;
      
      this.isPlayerTurn = false;
      
      // 简单AI：50%概率普通攻击，50%概率使用技能
      if (this.enemy.skills.length > 0 && Math.random() > 0.5) {
        const randomSkill = this.enemy.skills[Math.floor(Math.random() * this.enemy.skills.length)];
        
        if (this.enemy.mana.current >= randomSkill.cost) {
          // 使用技能
          this.enemy.mana.current -= randomSkill.cost;
          
          if (randomSkill.damage > 0) {
            const damage = this.calculateDamage(
              this.enemy.attributes.attack + randomSkill.damage, 
              this.player.attributes.defense
            );
            
            // 检查玩家是否闪避
            const isDodge = Math.random() < this.player.attributes.dodgeRate;
            if (isDodge) {
              this.addBattleLog(`${this.player.name}闪避了${this.enemy.name}的${randomSkill.name}！`, 'enemy');
            } else {
              this.player.health.current = Math.max(0, this.player.health.current - damage);
              this.addBattleLog(`${this.enemy.name}使用${randomSkill.name}对你造成${damage}点伤害`, 'enemy');
            }
          } else {
            this.addBattleLog(`${this.enemy.name}使用了${randomSkill.name}`, 'enemy');
          }
        } else {
          // 普通攻击
          this.enemyAttack();
        }
      } else {
        // 普通攻击
        this.enemyAttack();
      }
      
      this.checkBattleEnd();
      
      if (this.battleStatus === 'active') {
        // 消耗时间进行战斗回合
        this.consumeGameTime(1/120); // 0.25天 = 1/120个月
        
        setTimeout(() => {
          this.isPlayerTurn = true;
        }, 1000);
      }
    },
    enemyAttack() {
      const damage = this.calculateDamage(this.enemy.attributes.attack, this.player.attributes.defense);
      
      // 检查玩家是否闪避
      const isDodge = Math.random() < this.player.attributes.dodgeRate;
      if (isDodge) {
        this.addBattleLog(`${this.player.name}闪避了${this.enemy.name}的攻击！`, 'enemy');
      } else {
        this.player.health.current = Math.max(0, this.player.health.current - damage);
        this.addBattleLog(`${this.enemy.name}对你造成${damage}点伤害`, 'enemy');
      }
    },
    calculateDamage(attack, defense) {
      // 计算伤害：攻击力 - 防御力，最小为1
      let damage = Math.max(1, attack - defense + Math.floor(Math.random() * 5) - 2);
      
      // 添加随机因素
      damage = Math.floor(damage * (0.9 + Math.random() * 0.2)); // ±10% 的浮动
      
      return Math.max(1, damage);
    },
    checkBattleEnd() {
      if (this.player.health.current <= 0) {
        this.battleStatus = 'lost';
        this.addBattleLog('战斗失败！', 'system');
        ElMessage.error('战斗失败！');
      } else if (this.enemy.health.current <= 0) {
        this.battleStatus = 'won';
        this.addBattleLog('战斗胜利！', 'system');
        ElMessage.success('战斗胜利！');
      }
    }
  },
  mounted() {
    document.title = '文字修仙传 - 战斗系统';
  }
};
</script>

<style scoped lang="scss">
.battle {
  padding: 20px;
}

.battle-area {
  margin-bottom: 20px;
}

.character-info {
  display: flex;
  align-items: center;
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .stats {
    flex: 1;
    
    h3 {
      margin: 0 0 10px;
      color: #303133;
    }
    
    .health-bar, .mana-bar, .stamina-bar {
      margin-bottom: 10px;
      
      p {
        margin: 0 0 5px;
        font-size: 14px;
        color: #606266;
      }
    }
    
    .attributes {
      margin-top: 15px;
      
      .attribute {
        padding: 8px;
        background-color: #f5f7fa;
        border-radius: 4px;
        text-align: center;
        font-size: 12px;
        
        i {
          margin-right: 5px;
        }
      }
    }
  }
}

.skills-section {
  text-align: center;
}

.battle-log {
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  
  .log-entry {
    padding: 5px 0;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    
    &.player {
      color: #409EFF;
    }
    
    &.enemy {
      color: #F56C6C;
    }
    
    &.system {
      color: #909399;
      font-style: italic;
    }
  }
  
  .empty-log {
    text-align: center;
    color: #909399;
    padding: 50px 0;
  }
}

.battle-controls {
  text-align: center;
  
  .battle-status {
    display: inline-block;
  }
}
</style>