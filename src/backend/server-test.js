const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose'); // 暂时注释掉，以便在没有MongoDB的情况下运行
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 模拟数据库 - 仅用于测试目的
let mockUsers = [];
let mockCharacters = [];

// API路由
app.use('/api/auth', require('./routes/auth-test'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/cultivation', require('./routes/cultivation'));
app.use('/api/exploration', require('./routes/exploration'));
app.use('/api/user-state', require('./routes/user-state'));
// app.use('/api/battle', require('./routes/battle'));
// app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/inventory', require('./routes/inventory'));

// 根路径返回简单的API信息
app.get('/', (req, res) => {
  res.json({ 
    message: '文字修仙传 - 游戏API服务', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`API文档: http://localhost:${PORT}/api/docs`);
  console.log('(注意: 当前为测试模式，未连接数据库)');
});

module.exports = app;