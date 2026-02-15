const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const Material = require('../models/Material');
const Potion = require('../models/Potion');
const Character = require('../models/Character');

// 获取可用配方列表
router.get('/recipes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const characterId = req.query.characterId;

    // 验证用户是否有权限访问该角色
    const character = await Character.findOne({ _id: characterId, userId: userId });
    if (!character) {
      return res.status(403).json({ error: '无权访问该角色' });
    }

    // 根据角色境界筛选可用配方
    const availableRecipes = await Recipe.find({
      $or: [
        { requiredRealm: { $lt: character.cultivation.realm } },
        { 
          requiredRealm: character.cultivation.realm,
          requiredRealmLevel: { $lte: character.cultivation.realmLevel }
        }
      ]
    });

    res.json(availableRecipes);
  } catch (error) {
    console.error('获取配方列表失败:', error);
    res.status(500).json({ error: '获取配方列表失败', details: error.message });
  }
});

// 获取材料列表
router.get('/materials', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const characterId = req.query.characterId;

    // 验证用户是否有权限访问该角色
    const character = await Character.findOne({ _id: characterId, userId: userId });
    if (!character) {
      return res.status(403).json({ error: '无权访问该角色' });
    }

    // 在实际应用中，这里应该从用户的背包中获取材料信息
    // 目前我们返回一些预设的材料，后续可以与inventory系统集成
    const materials = await Material.find({}).limit(20);

    // 如果没有预设材料，创建一些示例材料
    if (materials.length === 0) {
      const sampleMaterials = [
        { _id: 'yaocai_001', name: '千年灵药', type: '草药', quality: '优质', value: 10 },
        { _id: 'kuangshi_001', name: '寒铁矿石', type: '矿物', quality: '普通', value: 5 },
        { _id: 'yaoshou_001', name: '一级妖兽内丹', type: '妖兽材料', quality: '普通', value: 8 },
        { _id: 'yaocai_002', name: '九转仙草', type: '草药', quality: '珍稀', value: 25 },
        { _id: 'yaocai_003', name: '玄冰花', type: '草药', quality: '优质', value: 15 },
        { _id: 'kuangshi_002', name: '天外陨铁', type: '矿物', quality: '珍稀', value: 30 }
      ];
      
      // 确保材料数据存在
      await Material.insertMany(sampleMaterials);
      res.json(sampleMaterials);
    } else {
      res.json(materials);
    }
  } catch (error) {
    console.error('获取材料列表失败:', error);
    res.status(500).json({ error: '获取材料列表失败', details: error.message });
  }
});

// 开始炼制
router.post('/brew', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { characterId, recipeId, materials } = req.body;

    // 验证用户是否有权限访问该角色
    const character = await Character.findOne({ _id: characterId, userId: userId });
    if (!character) {
      return res.status(403).json({ error: '无权访问该角色' });
    }

    // 获取配方信息
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: '配方不存在' });
    }

    // 检查角色是否满足炼制条件（境界要求）
    if (character.cultivation.realm < recipe.requiredRealm ||
        (character.cultivation.realm === recipe.requiredRealm && 
         character.cultivation.realmLevel < recipe.requiredRealmLevel)) {
      return res.status(400).json({ error: '境界不足，无法炼制此丹药' });
    }

    // 检查材料是否充足（这里简化处理，实际应该检查用户库存）
    if (!materials || materials.length === 0) {
      return res.status(400).json({ error: '材料不足' });
    }

    // 计算炼制结果
    const success = Math.random() * 100 <= recipe.result.successRate;
    
    if (!success) {
      return res.json({ 
        success: false, 
        message: '炼制失败！', 
        result: null 
      });
    }

    // 生成丹药
    const potion = new Potion({
      name: recipe.result.potionName || `${recipe.name}`,
      type: recipe.type,
      recipeId: recipeId,
      characterId: characterId,
      quantity: recipe.result.baseQuantity,
      effect: recipe.effect || {}
    });

    await potion.save();

    res.json({ 
      success: true, 
      message: '炼制成功！', 
      result: potion 
    });

  } catch (error) {
    console.error('炼制丹药失败:', error);
    res.status(500).json({ error: '炼制丹药失败', details: error.message });
  }
});

// 获取角色拥有的丹药
router.get('/potions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const characterId = req.query.characterId;

    // 验证用户是否有权限访问该角色
    const character = await Character.findOne({ _id: characterId, userId: userId });
    if (!character) {
      return res.status(403).json({ error: '无权访问该角色' });
    }

    const potions = await Potion.find({ characterId: characterId });

    res.json(potions);
  } catch (error) {
    console.error('获取丹药列表失败:', error);
    res.status(500).json({ error: '获取丹药列表失败', details: error.message });
  }
});

module.exports = router;