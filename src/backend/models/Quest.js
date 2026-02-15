const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['main', 'side', 'daily', 'event'],
    default: 'side'
  },
  levelRequirement: {
    type: Number,
    default: 1
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest'
  }],
  objectives: [{
    type: {
      type: String,
      required: true,
      enum: ['collect', 'defeat', 'visit', 'speak', 'craft']
    },
    target: {
      type: String, // 目标名称或ID
      required: true
    },
    targetCount: {
      type: Number,
      default: 1
    },
    completed: {
      type: Boolean,
      default: false
    },
    currentCount: {
      type: Number,
      default: 0
    }
  }],
  rewards: {
    experience: {
      type: Number,
      default: 0
    },
    gold: {
      type: Number,
      default: 0
    },
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
    attributes: {
      type: Object, // 可以增加属性点或其他永久性奖励
      default: {}
    }
  },
  repeatable: {
    type: Boolean,
    default: false
  },
  timeLimit: {
    type: Number, // 限时任务，单位分钟，0表示无限制
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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

// 更新时间中间件
questSchema.pre('save', function(next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model('Quest', questSchema);