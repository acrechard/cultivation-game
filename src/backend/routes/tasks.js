const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const Character = require('../models/Character');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// 获取用户任务列表
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let query = { userId: req.user.userId };
    
    if (type) query.type = type;
    if (status) query.status = status;
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: '获取任务列表失败', details: error.message });
  }
});

// 获取特定任务详情
router.get('/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findOne({ 
      _id: taskId, 
      userId: req.user.userId 
    });
    
    if (!task) {
      return res.status(404).json({ error: '任务不存在或无权访问' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: '获取任务详情失败', details: error.message });
  }
});

// 接取任务
router.post('/accept/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // 查找任务
    let task = await Task.findOne({ 
      _id: taskId,
      userId: { $exists: false } // 任务还未被接取
    });
    
    if (!task) {
      return res.status(404).json({ error: '任务不存在或已被他人接取' });
    }
    
    // 检查角色是否满足任务前置条件
    const character = await Character.findOne({ userId: req.user.userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    if (character.level < task.requirements.level) {
      return res.status(400).json({ error: `角色等级不足，需要达到${task.requirements.level}级` });
    }
    
    // 分配任务给用户
    task.userId = req.user.userId;
    task.characterId = character._id;
    task.status = '进行中';
    
    await task.save();
    
    res.json({
      message: '成功接取任务',
      task
    });
  } catch (error) {
    res.status(500).json({ error: '接取任务失败', details: error.message });
  }
});

// 更新任务进度
router.put('/progress/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { conditionType, increment = 1 } = req.body;
    
    const task = await Task.findOne({ 
      _id: taskId, 
      userId: req.user.userId,
      status: '进行中'
    });
    
    if (!task) {
      return res.status(404).json({ error: '任务不存在或无法更新进度' });
    }
    
    // 找到匹配的条件并更新进度
    const conditionIndex = task.conditions.findIndex(
      condition => condition.type === conditionType
    );
    
    if (conditionIndex !== -1) {
      task.conditions[conditionIndex].currentCount = Math.min(
        task.conditions[conditionIndex].currentCount + increment,
        task.conditions[conditionIndex].requiredCount
      );
    }
    
    // 检查任务是否完成
    const allConditionsMet = task.conditions.every(
      condition => condition.currentCount >= condition.requiredCount
    );
    
    if (allConditionsMet) {
      task.status = '已完成';
    }
    
    await task.save();
    
    res.json({
      message: '任务进度已更新',
      task
    });
  } catch (error) {
    res.status(500).json({ error: '更新任务进度失败', details: error.message });
  }
});

// 完成任务并领取奖励
router.post('/complete/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findOne({ 
      _id: taskId, 
      userId: req.user.userId,
      status: '已完成'
    });
    
    if (!task) {
      return res.status(400).json({ error: '任务未完成或无法领取奖励' });
    }
    
    // 这里应该有奖励发放逻辑，比如增加经验值、金钱、物品等
    // 暂时简化处理
    
    task.status = '已领取奖励';
    task.completedAt = new Date();
    
    await task.save();
    
    res.json({
      message: '任务完成，奖励已领取',
      task,
      rewards: task.rewards
    });
  } catch (error) {
    res.status(500).json({ error: '完成任务失败', details: error.message });
  }
});

// 创建新任务（仅限系统）
router.post('/create', async (req, res) => {
  try {
    const { title, description, type, difficulty, rewards, requirements, conditions } = req.body;
    
    const newTask = new Task({
      title,
      description,
      type,
      difficulty,
      rewards,
      requirements,
      conditions,
      status: '未接取'
    });
    
    await newTask.save();
    
    res.json({
      message: '任务创建成功',
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ error: '创建任务失败', details: error.message });
  }
});

// 放弃任务
router.delete('/abandon/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findOne({ 
      _id: taskId, 
      userId: req.user.userId,
      status: { $in: ['未接取', '进行中'] }
    });
    
    if (!task) {
      return res.status(400).json({ error: '无法放弃该任务' });
    }
    
    // 将任务状态改回未接取，清除用户关联
    task.userId = undefined;
    task.characterId = undefined;
    task.status = '未接取';
    task.conditions.forEach(condition => {
      condition.currentCount = 0;
    });
    
    await task.save();
    
    res.json({
      message: '任务已放弃',
      task
    });
  } catch (error) {
    res.status(500).json({ error: '放弃任务失败', details: error.message });
  }
});

module.exports = router;