const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
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
  requiredRealm: {
    // 解锁所需境界
    type: String,
    default: '炼气期'
  },
  requiredRealmLevel: {
    // 解锁所需境界等级
    type: Number,
    default: 1
  },
  ingredients: [{
    // 所需材料
    materialId: {
      type: String,  // 改为String类型以支持自定义ID
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  result: {
    // 炼制结果
    potionName: String,
    baseQuantity: {
      // 基础产出数量
      type: Number,
      default: 1
    },
    successRate: {
      // 成功率
      type: Number,
      default: 70 // 百分比
    }
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);