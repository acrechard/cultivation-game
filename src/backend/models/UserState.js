const mongoose = require('mongoose');

const userStateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  characterId: {
    type: String,  // 改为String类型以支持用户自定义ID
    required: true,
    index: true
  },
  // 角色基本信息
  character: {
    name: String,
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    experienceToNextLevel: { type: Number, default: 100 },
    health: { type: Number, default: 100 },
    maxHealth: { type: Number, default: 100 },
    mana: { type: Number, default: 50 },
    maxMana: { type: Number, default: 50 },
  },
  
  // 修炼相关信息
  cultivation: {
    realm: { type: String, default: '炼气期' },
    realmLevel: { type: Number, default: 1 },
    cultivationExp: { type: Number, default: 0 },
    cultivationExpToNext: { type: Number, default: 100 },
    spiritualRoot: {
      type: { type: String, default: '杂灵根' },
      strength: { type: Number, default: 50 },
      element: { type: String, default: '五行均衡' }
    },
    baseAttributes: {
      constitution: { type: Number, default: 10 },
      intelligence: { type: Number, default: 10 },
      physique: { type: Number, default: 10 },
      soulForce: { type: Number, default: 10 }
    }
  },
  
  // 游戏状态
  gameState: {
    inBattle: { type: Boolean, default: false },
    currentLocation: { type: String, default: '新手村' },
    currentTime: { type: String, default: () => new Date().toISOString() },
    gold: { type: Number, default: 100 },
    reputation: {
      sect: { type: Number, default: 0 },
      good: { type: Number, default: 0 },
      evil: { type: Number, default: 0 }
    }
  },
  
  // 物品背包
  inventory: {
    items: [{
      id: String,
      name: String,
      type: String,
      subtype: String,
      description: String,
      quantity: { type: Number, default: 1 },
      effect: {
        type: { type: String },
        value: { type: Number }
      },
      rarity: { type: String, default: 'common' }
    }],
    equipment: {
      weapon: Object,
      armor: Object,
      accessory: Object
    },
    maxSize: { type: Number, default: 50 }
  },
  
  // 任务系统
  quests: {
    activeQuests: [{
      id: String,
      title: String,
      description: String,
      objective: String,
      reward: Object,
      progress: { type: Number, default: 0 },
      maxProgress: { type: Number, default: 1 }
    }],
    completedQuests: [{
      id: String,
      title: String,
      description: String,
      reward: Object,
      completedAt: { type: String, default: () => new Date().toISOString() }
    }]
  },
  
  // 探索系统状态
  exploration: {
    currentLocation: { type: String, default: 'village' },
    visitedLocations: [{ type: String, default: 'village' }],
    explorationPoints: { type: Number, default: 0 },
    lastExplorationTime: String,
    lastTreasureTime: String,
    lastHuntTime: String,
    lastCollectTime: String
  },
  
  // 其他游戏状态
  battle: {
    currentEnemy: Object,
    battleLog: [String]
  },
  
  // 时间戳
  lastSavedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 索引优化
userStateSchema.index({ userId: 1, characterId: 1 });

// 更新时间中间件
userStateSchema.pre('save', function(next) {
  this.lastSavedAt = new Date();
  next();
});

module.exports = mongoose.model('UserState', userStateSchema);