const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['草药', '矿物', '妖兽材料', '其他'],
    required: true
  },
  quality: {
    type: String,
    enum: ['普通', '优质', '珍稀', '传说'],
    default: '普通'
  },
  description: {
    type: String,
    default: ''
  },
  value: {
    // 价值评分，影响炼制效果
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Material', materialSchema);