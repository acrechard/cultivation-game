const express = require('express');
const Character = require('../models/Character');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// 获取用户的所有角色
router.get('/', authenticateToken, async (req, res) => {
  try {
    const characters = await Character.find({ userId: req.user.userId })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: '获取角色列表失败', details: error.message });
  }
});

// 获取特定角色
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).select('-__v');

    if (!character) {
      return res.status(404).json({ error: '角色不存在或无权访问' });
    }

    res.json(character);
  } catch (error) {
    res.status(500).json({ error: '获取角色信息失败', details: error.message });
  }
});

// 创建新角色
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id, name, title, description } = req.body;

    // 检查角色ID是否已存在
    const existingCharacter = await Character.findOne({
      userId: req.user.userId,
      _id: id  // 使用_id字段存储用户自定义的ID
    });

    if (existingCharacter) {
      return res.status(400).json({ error: '角色ID已存在' });
    }

    // 检查角色名称是否已存在
    const existingName = await Character.findOne({
      userId: req.user.userId,
      name
    });

    if (existingName) {
      return res.status(400).json({ error: '角色名称已存在' });
    }

    // 创建新角色
    const newCharacter = new Character({
      _id: id,  // 使用用户指定的ID作为MongoDB文档ID
      userId: req.user.userId,
      name,
      title: title || '无名修士',
      description: description || '',
      // 其他默认属性会在模型中自动设置
    });

    await newCharacter.save();

    res.status(201).json({
      message: '角色创建成功',
      character: newCharacter
    });
  } catch (error) {
    res.status(500).json({ error: '创建角色失败', details: error.message });
  }
});

// 更新角色信息
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!character) {
      return res.status(404).json({ error: '角色不存在或无权访问' });
    }

    // 更新允许的字段
    const allowedUpdates = [
      'name', 'level', 'experience', 'health', 'maxHealth', 'mana', 'maxMana',
      'attributes', 'gameState', 'inventory', 'equipment'
    ];
    
    const updates = {};
    for (const key in req.body) {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    Object.assign(character, updates);
    await character.save();

    res.json({
      message: '角色信息更新成功',
      character
    });
  } catch (error) {
    res.status(500).json({ error: '更新角色信息失败', details: error.message });
  }
});

// 删除角色
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!character) {
      return res.status(404).json({ error: '角色不存在或无权访问' });
    }

    await Character.findByIdAndDelete(req.params.id);

    res.json({ message: '角色删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除角色失败', details: error.message });
  }
});

// 角色升级
router.post('/:id/level-up', authenticateToken, async (req, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!character) {
      return res.status(404).json({ error: '角色不存在或无权访问' });
    }

    // 检查是否有足够的经验值
    if (character.experience < character.experienceToNextLevel) {
      return res.status(400).json({ error: '经验值不足，无法升级' });
    }

    // 执行升级
    character.level += 1;
    character.experience -= character.experienceToNextLevel;
    character.experienceToNextLevel = Math.floor(character.experienceToNextLevel * 1.5);
    
    // 提升基础属性
    character.maxHealth += 10;
    character.health = character.maxHealth;
    character.maxMana += 5;
    character.mana = character.maxMana;

    await character.save();

    res.json({
      message: '升级成功',
      character
    });
  } catch (error) {
    res.status(500).json({ error: '升级失败', details: error.message });
  }
});

module.exports = router;