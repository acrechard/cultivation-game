const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
 const UserState = require('../models/UserState');
const Character = require('../models/Character');

// 保存用户状态
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { characterId, gameState } = req.body;

    // 验证用户是否有权限访问该角色
    const character = await Character.findOne({ _id: characterId, userId: userId });
    if (!character) {
      return res.status(403).json({ error: '无权访问该角色' });
    }

    // 查找或创建用户状态
    let userState = await UserState.findOne({ userId: userId, characterId: characterId });
    
    if (userState) {
      // 更新现有状态
      Object.assign(userState, gameState);
      userState.lastSavedAt = new Date();
    } else {
      // 创建新状态
      userState = new UserState({
        userId: userId,
        characterId: characterId,
        ...gameState
      });
    }

    await userState.save();

    res.json({ 
      success: true, 
      message: '状态保存成功',
      savedAt: userState.lastSavedAt 
    });
  } catch (error) {
    console.error('保存用户状态失败:', error);
    res.status(500).json({ error: '保存状态失败', details: error.message });
  }
});

// 加载用户状态
router.get('/load/:characterId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { characterId } = req.params;

    // 验证用户是否有权限访问该角色
    const character = await Character.findOne({ _id: characterId, userId: userId });
    if (!character) {
      return res.status(403).json({ error: '无权访问该角色' });
    }

    // 查找用户状态
    const userState = await UserState.findOne({ 
      userId: userId, 
      characterId: characterId 
    }).sort({ lastSavedAt: -1 }); // 获取最新的状态

    if (!userState) {
      return res.status(404).json({ error: '未找到用户状态，可能从未保存过' });
    }

    res.json({
      success: true,
      gameState: userState.toObject(),
      lastSavedAt: userState.lastSavedAt
    });
  } catch (error) {
    console.error('加载用户状态失败:', error);
    res.status(500).json({ error: '加载状态失败', details: error.message });
  }
});

// 获取用户的所有角色状态列表
router.get('/list/:userId', authenticateToken, async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    const { userId } = req.params;

    // 验证用户是否有权限访问该用户的状态
    if (requestingUserId !== userId) {
      return res.status(403).json({ error: '无权访问该用户的状态' });
    }

    const userStates = await UserState.find({ userId: userId })
      .select('characterId lastSavedAt createdAt')
      .sort({ lastSavedAt: -1 });

    res.json({
      success: true,
      userStates: userStates
    });
  } catch (error) {
    console.error('获取用户状态列表失败:', error);
    res.status(500).json({ error: '获取状态列表失败', details: error.message });
  }
});

// 自动保存状态（用于定期自动保存）
router.post('/auto-save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { characterId, gameState } = req.body;

    // 验证用户是否有权限访问该角色
    const character = await Character.findOne({ _id: characterId, userId: userId });
    if (!character) {
      return res.status(403).json({ error: '无权访问该角色' });
    }

    // 查找或创建用户状态
    let userState = await UserState.findOne({ userId: userId, characterId: characterId });
    
    if (userState) {
      // 更新现有状态
      Object.assign(userState, gameState);
    } else {
      // 创建新状态
      userState = new UserState({
        userId: userId,
        characterId: characterId,
        ...gameState
      });
    }

    await userState.save();

    res.json({ 
      success: true, 
      message: '自动保存成功',
      savedAt: userState.lastSavedAt 
    });
  } catch (error) {
    console.error('自动保存用户状态失败:', error);
    res.status(500).json({ error: '自动保存失败', details: error.message });
  }
});

module.exports = router;