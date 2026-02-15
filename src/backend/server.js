const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

// 引入模型以确保它们被注册
require('./models/User');
require('./models/Character');
require('./models/Item');
require('./models/Quest');
require('./models/Cultivation');
require('./models/Battle');
require('./models/UserState');
require('./models/Material');
require('./models/Potion');
require('./models/Recipe');

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
// CORS配置
const corsOptions = {
  credentials: true
};

// 在生产环境中允许所有来源，开发环境中限制为本地
if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = '*';  // 生产环境中允许所有来源
} else {
  corsOptions.origin = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:5173',  // Vite默认端口
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://0.0.0.0:5173',
    'http://0.0.0.0:5174'
  ];
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cultivation_game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB数据库连接成功');
  
  // 初始化配方数据
  const initializeRecipes = require('./utils/init-recipes');
  initializeRecipes();
})
.catch((error) => {
  console.error('MongoDB连接失败:', error);
  console.log('请确保MongoDB服务已启动');
});

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/cultivation', require('./routes/cultivation'));
app.use('/api/battle', require('./routes/battle'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/exploration', require('./routes/exploration-auth'));
app.use('/api/alchemy', require('./routes/alchemy'));
app.use('/api/breakthrough', require('./routes/breakthrough'));
app.use('/api/user-state', require('./routes/user-state'));

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
});

module.exports = app;