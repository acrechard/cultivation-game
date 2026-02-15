const mongoose = require('mongoose');

const breakthroughSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  currentRealm: {
    type: String, // 当前境界，如'炼气期'
    required: true
  },
  targetRealm: {
    type: String, // 目标境界
    required: true
  },
  realmLevel: {
    type: Number, // 当前境界层数
    default: 1
  },
  success: {
    type: Boolean, // 是否突破成功
    required: true
  },
  breakthroughDate: {
    type: Date,
    default: Date.now
  },
  requiredItems: [{ // 突破所需物品
    itemId: String,
    name: String,
    quantity: Number
  }],
  bonusRewards: [{ // 突破奖励
    type: String,
    name: String,
    value: Number
  }]
});

module.exports = mongoose.model('Breakthrough', breakthroughSchema);