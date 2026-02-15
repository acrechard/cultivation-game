const express = require('express');
const jwt = require('jsonwebtoken');
const Cultivation = require('../models/Cultivation');
const Character = require('../models/Character');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// 获取用户修炼信息
router.get('/:characterId', authenticateToken, async (req, res) => {
  try {
    const { characterId } = req.params;
    
    // 验证角色属于当前用户
    const character = await Character.findOne({ _id: characterId, userId: req.user.userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在或无权访问' });
    }
    
    let cultivation = await Cultivation.findOne({ characterId: characterId });
    
    // 如果没有修炼记录，创建一个新的
    if (!cultivation) {
      cultivation = new Cultivation({
        userId: req.user.userId,
        characterId: characterId,
        realm: '炼气期',
        level: 1,
        experience: 0,
        nextLevelExp: 100
      });
      await cultivation.save();
    }
    
    res.json(cultivation);
  } catch (error) {
    res.status(500).json({ error: '获取修炼信息失败', details: error.message });
  }
});

// 开始修炼
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { characterId } = req.body;
    
    // 验证角色属于当前用户
    const character = await Character.findOne({ _id: characterId, userId: req.user.userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在或无权访问' });
    }
    
    let cultivation = await Cultivation.findOne({ characterId: characterId });
    if (!cultivation) {
      cultivation = new Cultivation({
        userId: req.user.userId,
        characterId: characterId,
        realm: '炼气期',
        level: 1,
        experience: 0,
        nextLevelExp: 100
      });
    }
    
    // 计算修炼获得的经验值
    // 基础经验 = 修炼速度 * 时间 * 功法效率
    const baseExp = 10;
    const spiritRootBonus = Math.max(
      cultivation.spiritRoot.wood,
      cultivation.spiritRoot.fire,
      cultivation.spiritRoot.earth,
      cultivation.spiritRoot.metal,
      cultivation.spiritRoot.water
    );
    const methodEfficiency = cultivation.cultivationMethod.efficiency;
    
    const expGain = Math.floor(baseExp * spiritRootBonus * methodEfficiency);
    
    // 更新修炼信息
    cultivation.experience += expGain;
    
    // 检查是否升级
    if (cultivation.experience >= cultivation.nextLevelExp) {
      cultivation.level += 1;
      cultivation.experience = cultivation.experience - cultivation.nextLevelExp;
      
      // 计算下一个级别的所需经验
      cultivation.nextLevelExp = Math.floor(cultivation.nextLevelExp * 1.5);
      
      // 检查是否突破境界
      const realms = ['炼气期', '筑基期', '结丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期', '大罗金仙'];
      const currentRealmIndex = realms.indexOf(cultivation.realm);
      
      // 每10级突破一个小境界
      if (cultivation.level % 10 === 0 && currentRealmIndex < realms.length - 1) {
        cultivation.realm = realms[currentRealmIndex + 1];
      }
    }
    
    await cultivation.save();
    
    res.json({
      message: '修炼完成',
      cultivation,
      expGain
    });
  } catch (error) {
    res.status(500).json({ error: '开始修炼失败', details: error.message });
  }
});

// 更换功法
router.put('/method/:characterId', authenticateToken, async (req, res) => {
  try {
    const { characterId } = req.params;
    const { methodName, methodType, methodLevel } = req.body;
    
    // 验证角色属于当前用户
    const character = await Character.findOne({ _id: characterId, userId: req.user.userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在或无权访问' });
    }
    
    const cultivation = await Cultivation.findOne({ characterId: characterId });
    if (!cultivation) {
      return res.status(404).json({ error: '修炼信息不存在' });
    }
    
    // 更新功法信息
    cultivation.cultivationMethod = {
      name: methodName,
      type: methodType,
      level: methodLevel,
      efficiency: methodLevel * 0.1 + 1.0  // 等级越高效率越高
    };
    
    await cultivation.save();
    
    res.json({
      message: '功法更换成功',
      cultivation
    });
  } catch (error) {
    res.status(500).json({ error: '更换功法失败', details: error.message });
  }
});

// 获取修炼排行榜
router.get('/leaderboard/:realm?', authenticateToken, async (req, res) => {
  try {
    const { realm } = req.params;
    
    let query = {};
    if (realm && realm !== 'all') {
      query.realm = realm;
    }
    
    const cultivations = await Cultivation.find(query)
      .populate('userId', 'username')
      .populate('characterId', 'name level')
      .sort({ level: -1, experience: -1 })
      .limit(20);
    
    res.json(cultivations);
  } catch (error) {
    res.status(500).json({ error: '获取排行榜失败', details: error.message });
  }
});

module.exports = router;