const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
  battleId: {
    type: String,
    unique: true,
    required: true
  },
  participants: [{
    characterId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['player', 'enemy'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 1
    },
    health: {
      current: { type: Number, default: 100 },
      max: { type: Number, default: 100 }
    },
    mana: {
      current: { type: Number, default: 50 },
      max: { type: Number, default: 50 }
    },
    stamina: {
      current: { type: Number, default: 50 },
      max: { type: Number, default: 50 }
    },
    attributes: {
      attack: { type: Number, default: 10 },
      defense: { type: Number, default: 5 },
      speed: { type: Number, default: 10 },
      critRate: { type: Number, default: 0.05 }, // 暴击率
      dodgeRate: { type: Number, default: 0.03 } // 闪避率
    },
    spiritRoot: {
      // 五行灵根
      wood: { type: Number, default: 1 },
      fire: { type: Number, default: 1 },
      earth: { type: Number, default: 1 },
      metal: { type: Number, default: 1 },
      water: { type: Number, default: 1 }
    },
    skills: [{
      name: String,
      type: String,
      level: Number,
      damage: Number
    }]
  }],
  winner: {
    characterId: String,
    type: String // 'player' or 'enemy'
  },
  log: [{
    turn: Number,
    action: String,
    actor: String,
    target: String,
    result: Object
  }],
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed'],
    default: 'pending'
  },
  turn: {
    type: String, // 'player' or 'enemy'
    default: 'player'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('Battle', battleSchema);