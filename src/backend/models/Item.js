const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['丹药', '装备', '材料', '功法秘籍', '任务物品', '其他'],
    required: true
  },
  subtype: {
    // 子类型，根据主类型变化
    type: String,
    enum: [
      // 丹药子类型
      '恢复类', '增益类', '修炼类', '解毒类',
      // 装备子类型
      '武器', '防具', '饰品',
      // 装备详细分类
      '剑', '刀', '枪', '弓', '法杖', '头盔', '护甲', '靴子', '戒指', '项链',
      // 材料子类型
      '炼丹材料', '炼器材料', '符箓材料',
      // 功法秘籍子类型
      '功法', '心法', '武技', '阵法', '炼丹术', '炼器术'
    ]
  },
  rarity: {
    type: String,
    enum: ['普通', '精良', '稀有', '史诗', '传说'],
    default: '普通'
  },
  level: {
    type: Number,
    default: 1
  },
  realmRequirement: {
    type: String,
    default: '炼气期'
  },
  attributes: {
    // 属性加成
    hp: { type: Number, default: 0 },
    mp: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    critRate: { type: Number, default: 0 }, // 暴击率
    dodgeRate: { type: Number, default: 0 }, // 闪避率
    // 五行属性
    woodAffinity: { type: Number, default: 0 }, // 木亲和
    fireAffinity: { type: Number, default: 0 }, // 火亲和
    earthAffinity: { type: Number, default: 0 }, // 土亲和
    metalAffinity: { type: Number, default: 0 }, // 金亲和
    waterAffinity: { type: Number, default: 0 } // 水亲和
  },
  effects: [{
    // 特殊效果
    name: String,
    type: String, // 如：被动、主动、触发等
    value: Number,
    duration: Number, // 持续时间(秒)，如果是永久则为0
    description: String
  }],
  description: {
    type: String,
    required: true
  },
  usage: {
    // 使用方式
    type: String,
    enum: ['使用', '装备', '阅读', '合成材料', '任务使用'],
    default: '使用'
  },
  stackable: {
    // 是否可叠加
    type: Boolean,
    default: true
  },
  maxStack: {
    // 最大叠加数量
    type: Number,
    default: 99
  },
  price: {
    // 价格
    buyPrice: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 }
  },
  durability: {
    // 耐久度（对装备而言）
    current: { type: Number, default: 100 },
    max: { type: Number, default: 100 }
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
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model('Item', itemSchema);