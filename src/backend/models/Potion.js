const mongoose = require('mongoose');

const potionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['增益丹药', '修炼丹药', '疗伤丹药', '突破丹药', '其他'],
    required: true
  },
  quality: {
    type: String,
    enum: ['普通', '精制', '完美', '传说'],
    default: '普通'
  },
  effect: {
    // 丹药效果描述
    description: String,
    // 效果持续时间（小时）, -1表示永久
    duration: {
      type: Number,
      default: 1
    },
    // 属性加成
    attributes: {
      constitution: { type: Number, default: 0 },
      intelligence: { type: Number, default: 0 },
      physique: { type: Number, default: 0 },
      soulForce: { type: Number, default: 0 }
    },
    // 修炼加成
    cultivationBonus: {
      speed: { type: Number, default: 0 }, // 修炼速度加成百分比
      successRate: { type: Number, default: 0 } // 突破成功率加成百分比
    },
    // 生命值加成
    healthBonus: { type: Number, default: 0 }
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  characterId: {
    type: String,  // 使用用户自定义ID
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    // 过期时间
    type: Date
  }
});

module.exports = mongoose.model('Potion', potionSchema);