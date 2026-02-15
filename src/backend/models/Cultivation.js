const mongoose = require('mongoose');

const cultivationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  characterId: {
    type: String,
    required: true,
    ref: 'Character'
  },
  realm: {
    type: String,
    enum: ['炼气期', '筑基期', '结丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期', '大罗金仙'],
    default: '炼气期'
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  nextLevelExp: {
    type: Number,
    default: 100
  },
  spiritRoot: {
    // 五行灵根
    wood: { type: Number, default: 1 }, // 木
    fire: { type: Number, default: 1 }, // 火
    earth: { type: Number, default: 1 }, // 土
    metal: { type: Number, default: 1 }, // 金
    water: { type: Number, default: 1 }  // 水
  },
  cultivationMethod: {
    // 修炼功法
    name: { type: String, default: '基础吐纳术' },
    type: { type: String, enum: ['功法', '心法', '武技'], default: '功法' },
    level: { type: Number, default: 1 },
    efficiency: { type: Number, default: 1.0 } // 修炼效率倍数
  },
  cultivationSpeed: {
    // 修炼速度
    base: { type: Number, default: 1 },
    bonus: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cultivationSchema.pre('save', function(next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model('Cultivation', cultivationSchema);