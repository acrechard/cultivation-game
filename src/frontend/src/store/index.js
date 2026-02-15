import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  // 状态
  state: () => ({
    // 角色基本信息
    character: {
      name: '无名修士',
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
    },
    
    // 修炼相关信息
    cultivation: {
      realm: '炼气期', // 当前境界
      realmLevel: 1,   // 境界层级
      cultivationExp: 0, // 修炼经验
      cultivationExpToNext: 100, // 升级所需经验
      spiritualRoot: {
        type: '杂灵根',
        strength: 50,
        element: '五行均衡'
      },
      baseAttributes: {
        constitution: 10,  // 根骨
        intelligence: 10,  // 悟性
        physique: 10,      // 体质
        soulForce: 10      // 神识
      }
    },
    
    // 游戏状态
    gameState: {
      inBattle: false,
      currentLocation: '新手村',
      currentTime: new Date().toISOString(),
      gold: 100,  // 灵石
      reputation: {
        sect: 0,    // 门派声望
        good: 0,    // 正道声望
        evil: 0     // 魔道声望
      }
    },
    
    // 物品背包
    inventory: {
      items: [],
      equipment: {
        weapon: null,
        armor: null,
        accessory: null
      },
      maxSize: 50
    },
    
    // 任务系统
    quests: {
      activeQuests: [],
      completedQuests: []
    }
  }),
  
  // getters
  getters: {
    // 获取角色等级描述
    getLevelDescription: (state) => {
      return `${state.cultivation.realm} ${state.cultivation.realmLevel}层`;
    },
    
    // 获取总战斗力
    getTotalCombatPower: (state) => {
      return Math.floor(
        state.character.level * 10 +
        state.cultivation.baseAttributes.constitution * 2 +
        state.cultivation.baseAttributes.intelligence * 2 +
        state.cultivation.baseAttributes.physique * 2 +
        state.cultivation.baseAttributes.soulForce * 2
      );
    },
    
    // 获取当前境界最大层数
    getMaxRealmLevel: (state) => {
      const realms = ['炼气期', '筑基期', '金丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期'];
      const currentRealmIndex = realms.indexOf(state.cultivation.realm);
      
      if (currentRealmIndex !== -1) {
        return 9; // 每个大境界都有9个小层次
      }
      return 1;
    }
  },
  
  // actions
  actions: {
    // 更新角色信息
    updateCharacter(data) {
      Object.assign(this.character, data);
    },
    
    // 增加经验值
    gainExperience(exp) {
      this.character.experience += exp;
      
      // 检查是否升级
      if (this.character.experience >= this.character.experienceToNextLevel) {
        this.levelUp();
      }
    },
    
    // 升级
    levelUp() {
      this.character.level++;
      this.character.experience -= this.character.experienceToNextLevel;
      this.character.experienceToNextLevel = Math.floor(this.character.experienceToNextLevel * 1.5);
      
      // 提升基础属性
      this.character.maxHealth += 10;
      this.character.health = this.character.maxHealth;
      this.character.maxMana += 5;
      this.character.mana = this.character.maxMana;
    },
    
    // 提升修炼境界
    advanceCultivation() {
      const realms = ['炼气期', '筑基期', '金丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期'];
      const currentRealmIndex = realms.indexOf(this.cultivation.realm);
      
      if (currentRealmIndex !== -1) {
        if (this.cultivation.realmLevel < 9) {
          // 提升境界小层次
          this.cultivation.realmLevel++;
        } else if (currentRealmIndex < realms.length - 1) {
          // 提升大境界
          this.cultivation.realm = realms[currentRealmIndex + 1];
          this.cultivation.realmLevel = 1;
        }
        
        // 增加基础属性
        this.increaseBaseAttributes();
      }
    },
    
    // 增加基础属性
    increaseBaseAttributes() {
      this.cultivation.baseAttributes.constitution += 2;
      this.cultivation.baseAttributes.intelligence += 2;
      this.cultivation.baseAttributes.physique += 2;
      this.cultivation.baseAttributes.soulForce += 2;
    },
    
    // 添加物品到背包
    addItem(item) {
      if (this.inventory.items.length < this.inventory.maxSize) {
        this.inventory.items.push({ ...item, id: Date.now() });
        return true;
      }
      return false;
    },
    
    // 使用物品
    useItem(itemId) {
      const itemIndex = this.inventory.items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const item = this.inventory.items[itemIndex];
        
        // 根据物品类型执行相应效果
        switch(item.type) {
          case 'consumable':
            if (item.effect) {
              // 应用物品效果
              if (item.effect.type === 'health') {
                this.character.health = Math.min(
                  this.character.maxHealth,
                  this.character.health + item.effect.value
                );
              } else if (item.effect.type === 'mana') {
                this.character.mana = Math.min(
                  this.character.maxMana,
                  this.character.mana + item.effect.value
                );
              } else if (item.effect.type === 'exp') {
                this.gainExperience(item.effect.value);
              }
            }
            // 移除已使用的物品
            this.inventory.items.splice(itemIndex, 1);
            break;
        }
        return true;
      }
      return false;
    },
    
    // 接受任务
    acceptQuest(quest) {
      if (!this.quests.activeQuests.some(q => q.id === quest.id)) {
        this.quests.activeQuests.push(quest);
      }
    },
    
    // 完成任务
    completeQuest(questId) {
      const questIndex = this.quests.activeQuests.findIndex(q => q.id === questId);
      if (questIndex !== -1) {
        const completedQuest = this.quests.activeQuests.splice(questIndex, 1)[0];
        this.quests.completedQuests.push(completedQuest);
        
        // 发放任务奖励
        if (completedQuest.reward) {
          if (completedQuest.reward.exp) {
            this.gainExperience(completedQuest.reward.exp);
          }
          if (completedQuest.reward.gold) {
            this.gameState.gold += completedQuest.reward.gold;
          }
        }
        
        return true;
      }
      return false;
    }
  }
});