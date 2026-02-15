const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['主线任务', '支线任务', '日常任务', '修炼任务', '探索任务', '战斗任务'],
    default: '日常任务'
  },
  difficulty: {
    type: String,
    enum: ['简单', '普通', '困难', '极难'],
    default: '普通'
  },
  rewards: {
    exp: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
    items: [{
      itemId: String,
      name: String,
      quantity: Number
    }],
    cultivationExp: { type: Number, default: 0 } // 修炼经验
  },
  requirements: {
    level: { type: Number, default: 1 },
    realm: { type: String, default: '炼气期' },
    questIds: [String] // 前置任务ID
  },
  conditions: [{
    type: {
      type: String,
      enum: ['击杀怪物', '收集物品', '到达地点', '修炼等级', '对话NPC', '完成副本']
    },
    target: String, // 目标名称
    targetId: String, // 目标ID
    requiredCount: { type: Number, default: 1 },
    currentCount: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['未接取', '进行中', '已完成', '已领取奖励'],
    default: '未接取'
  },
  userId: {
    type: String,
    ref: 'User'
  },
  characterId: {
    type: String,
    ref: 'Character'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deadline: Date, // 任务截止时间
  completedAt: Date // 完成时间
});

module.exports = mongoose.model('Task', taskSchema);