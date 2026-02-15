const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// 模拟用户数据库
let mockUsers = [];

// 用户注册 - 测试模式
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = mockUsers.find(u => u.username === username || u.email === email);
    
    if (existingUser) {
      return res.status(400).json({ 
        error: '用户名或邮箱已被使用' 
      });
    }

    // 生成模拟用户ID
    const userId = 'user_' + Date.now();
    
    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = {
      _id: userId,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);

    // 生成JWT令牌
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET_KEY || 'fallback_secret_key_for_test',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败', details: error.message });
  }
});

// 用户登录 - 测试模式
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET_KEY || 'fallback_secret_key_for_test',
      { expiresIn: '24h' }
    );

    // 更新最后登录时间
    user.lastLogin = new Date().toISOString();

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败', details: error.message });
  }
});

// 验证令牌
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    message: '令牌验证成功',
    user: {
      id: req.user.userId,
      username: req.user.username
    }
  });
});

module.exports = router;