const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  _id: {
    type: String,  // 使用用户自定义ID作为文档ID
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  health: {
    type: Number,
    default: 100,
    min: 0
  },
  maxHealth: {
    type: Number,
    default: 100,
    min: 1
  },
  mana: {
    type: Number,
    default: 50,
    min: 0
  },
  maxMana: {
    type: Number,
    default: 50,
    min: 1
  },
  // 修炼相关信息
  cultivation: {
    realm: {
      type: String,
      default: '炼气期',
      enum: ['炼气期', '筑基期', '金丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期']
    },
    realmLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 9
    },
    cultivationExp: {
      type: Number,
      default: 0
    },
    // 灵根信息
    spiritualRoot: {
      type: {
        type: String,
        default: '杂灵根'
      },
      strength: {
        type: Number,
        default: 50,
        min: 1,
        max: 100
      },
      element: {
        type: String,
        default: '五行均衡'
      }
    }
  },
  // 基础属性
  attributes: {
    constitution: {  // 根骨
      type: Number,
      default: 10,
      min: 1
    },
    intelligence: {  // 悟性
      type: Number,
      default: 10,
      min: 1
    },
    physique: {      // 体质
      type: Number,
      default: 10,
      min: 1
    },
    soulForce: {     // 神识
      type: Number,
      default: 10,
      min: 1
    }
  },
  // 游戏状态
  gameState: {
    location: {
      type: String,
      default: '新手村'
    },
    gold: {
      type: Number,
      default: 100
    },
    reputation: {
      sect: { type: Number, default: 0 },    // 门派声望
      good: { type: Number, default: 0 },    // 正道声望
      evil: { type: Number, default: 0 }     // 魔道声望
    }
  },
  // 物品背包
  inventory: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  // 装备
  equipment: {
    weapon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    armor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    accessory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }
  },
  // 任务状态
  quests: [{
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest'
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时间中间件
characterSchema.pre('save', function(next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model('Character', characterSchema);