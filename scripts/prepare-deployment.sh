#!/bin/bash
# 部署准备脚本

echo "准备部署文字修仙传项目..."

# 检查是否安装了Git
if ! [ -x "$(command -v git)" ]; then
  echo "错误: Git未安装，请先安装Git" >&2
  exit 1
fi

# 检查是否在项目根目录
if [ ! -f "README.md" ] && [ ! -d "src" ]; then
  echo "错误: 请在项目根目录运行此脚本" >&2
  exit 1
fi

echo "创建部署专用的package.json..."

# 创建用于部署的package.json
cat > package.json << EOF
{
  "name": "cultivation-game-fullstack",
  "version": "1.0.0",
  "description": "Fullstack cultivation game",
  "main": "src/backend/server.js",
  "scripts": {
    "start": "node src/backend/server.js",
    "dev": "cd src/backend && nodemon server.js",
    "build": "echo 'Building frontend...' && cd src/frontend && npm run build"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "mongoose": "^7.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "multer": "^1.4.5-lts.1"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "keywords": [
    "game",
    "cultivation",
    "rpg",
    "mmo"
  ],
  "author": "Cultivation Game Developer",
  "license": "MIT"
}
EOF

echo "创建部署所需的环境配置..."

# 创建环境变量示例
cat > .env.example << EOF
# 文字修仙传 - 环境变量示例
# 请将此文件重命名为 .env 并填入实际值

# JWT密钥 - 请使用强密钥
JWT_SECRET_KEY=your-super-secret-jwt-key-here-replace-with-random-string

# MongoDB连接字符串
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# 端口（Railway会自动设置，但也可以手动指定）
PORT=8080
EOF

echo "创建部署说明..."

cat > DEPLOYMENT.md << EOF
# 部署说明

## 部署到 Railway

### 1. 准备工作
1. 注册 Railway 账号：https://railway.app
2. 将此项目推送到 GitHub 仓库

### 2. 部署步骤
1. 在 Railway 中点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择您的仓库
4. 点击 "Deploy Now"

### 3. 配置环境变量
部署后，在 Settings -> Environment Variables 中添加：
- JWT_SECRET_KEY: 随机生成的安全密钥
- MONGODB_URI: MongoDB Atlas 连接字符串

### 4. MongoDB 设置
推荐使用 MongoDB Atlas（免费版可用）：
1. 注册：https://www.mongodb.com/atlas
2. 创建集群
3. 设置网络访问权限（允许 0.0.0.0/0）
4. 创建数据库用户
5. 获取连接字符串

### 5. 访问应用
部署完成后，Railway 会提供一个 URL，格式类似于：
https://your-project-name-production.up.railway.app

## 注意事项
- 首次部署可能需要几分钟时间
- 确保环境变量已正确配置
- 检查 CORS 设置是否允许前端域名访问
EOF

echo "部署准备完成！"

echo ""
echo "接下来的步骤："
echo "1. 检查生成的 package.json 和 .env.example 文件"
echo "2. 将项目推送到 GitHub"
echo "3. 在 Railway 上创建新项目并连接到您的 GitHub 仓库"
echo "4. 配置环境变量"
echo "5. 等待自动部署完成"
echo ""
echo "提示：如果需要修改后端端口，请编辑 src/backend/server.js 中的 PORT 变量"