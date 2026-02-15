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
        wood: 1,
        fire: 1,
        earth: 1,
        metal: 1,
        water: 1
      },
      baseAttributes: {
        constitution: 10,  // 根骨
        intelligence: 10,  // 悟性
        physique: 10,      // 体质
        soulForce: 10      // 神识
      },
      cultivationMethod: {
        name: '基础吐纳术',
        type: '功法',
        level: 1,
        efficiency: 1.0
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
    
    // 角色寿命信息
    life: {
      age: 18,      // 当前年龄
      maxAge: 100,  // 最大寿命（凡人期）
      remainingYears: 82 // 剩余寿命
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
    },
    
    // 探索系统状态
    exploration: {
      currentLocation: 'village',
      visitedLocations: ['village'],
      explorationPoints: 0,
      explorationLogs: []
    },
    
    // 战斗系统状态
    battle: {
      currentEnemy: null,
      battleLog: []
    },
    
    // 用户认证信息
    userInfo: {
      userId: null,
      username: null
    },
    
    // 状态管理
    isInitialized: false, // 是否已初始化
    isLoading: false, // 是否正在从服务器加载数据
    autoSaveInterval: null, // 自动保存定时器
    lastSaveTime: null // 最后保存时间
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
    },
    
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
    },
    
    // 保存游戏状态
    async saveGameState(characterId) {
      try {
        // 首先验证用户是否已登录
        const authStore = useAuthStore();
        if (!authStore.token) {
          console.warn('用户未登录，无法保存游戏状态');
          return false;
        }

        // 保存到服务器
        const response = await fetch(`/api/user-state/save`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            characterId: characterId || localStorage.getItem('characterId'),
            gameState: {
              character: this.character,
              cultivation: this.cultivation,
              gameState: this.gameState,
              life: this.life,
              inventory: this.inventory,
              tasks: this.tasks,
              exploration: this.exploration,
              breakthrough: this.breakthrough
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('游戏状态保存成功:', result.message);
          this.lastSaveTime = new Date(); // 更新最后保存时间
          return true;
        } else {
          const error = await response.json();
          console.error('游戏状态保存失败:', error);
          return false;
        }
      } catch (error) {
        console.error('保存游戏状态时发生错误:', error);
        return false;
      }
    },


    // 从服务器加载游戏状态
    async loadGameState(characterId) {
      this.isLoading = true; // 开始加载数据
      
      try {
        // 首先验证用户是否已登录
        const authStore = useAuthStore();
        if (!authStore.token) {
          console.log('用户未登录，使用默认状态');
          this.isInitialized = true;
          this.isLoading = false;
          return true;
        }

        // 尝试从服务器加载用户专属的游戏状态
        try {
          const response = await fetch(`/api/user-state/load/${characterId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const gameState = data.gameState || data;

            // 更新各个模块的数据
            if (gameState.character) {
              this.character = { ...this.character, ...gameState.character };
            }
            if (gameState.cultivation) {
              this.cultivation = { ...this.cultivation, ...gameState.cultivation };
            }
            if (gameState.gameState) {
              this.gameState = { ...this.gameState, ...gameState.gameState };
            }
            if (gameState.life) {
              this.life = { ...this.life, ...gameState.life };
            }
            if (gameState.inventory) {
              this.inventory = { ...this.inventory, ...gameState.inventory };
            }
            if (gameState.tasks) {
              this.tasks = { ...this.tasks, ...gameState.tasks };
            }
            if (gameState.exploration) {
              this.exploration = { ...this.exploration, ...gameState.exploration };
            }
            if (gameState.breakthrough) {
              this.breakthrough = { ...this.breakthrough, ...gameState.breakthrough };
            }

            this.isInitialized = true;
            console.log('游戏状态加载成功');
          } else {
            console.log('服务器上没有该游戏状态，将使用默认状态并稍后保存');
            // 即使没有从服务器加载到数据，也要确保isInitialized为true
            // 这样组件就不会一直等待数据加载
          }
        } catch (error) {
          console.error('从服务器加载游戏状态失败:', error);
          console.log('使用默认状态');
        }
        
        this.isInitialized = true;
        return true;
      } catch (error) {
        console.error('加载游戏状态失败:', error);
        this.isInitialized = true;
        return false;
      } finally {
        this.isLoading = false; // 确保无论成功或失败都设置为false
      }
    },

    // 开始自动保存
    startAutoSave(intervalMinutes = 5) {
      // 如果已有自动保存定时器，则先清除
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
      }

      // 设置新的自动保存定时器
      this.autoSaveInterval = setInterval(async () => {
        const characterId = localStorage.getItem('characterId');
        if (characterId) {
          await this.saveGameState(characterId);
        }
      }, intervalMinutes * 60 * 1000); // 转换为毫秒

      console.log(`自动保存已启动，每${intervalMinutes}分钟保存一次`);
    },

    // 停止自动保存
    stopAutoSave() {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
        console.log('自动保存已停止');
      }
    },

    // 页面卸载前手动保存
    async manualSaveBeforeUnload() {
      if (this.lastSaveTime) {
        const timeSinceLastSave = new Date() - this.lastSaveTime;
        // 如果距离上次保存不足1分钟，则跳过此次保存
        if (timeSinceLastSave < 60000) {
          return;
        }
      }

      const characterId = localStorage.getItem('characterId');
      if (characterId) {
        await this.saveGameState(characterId);
      }
    }
  }
});