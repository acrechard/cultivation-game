# 文字修仙传 - 开发环境配置

## 项目概述
文字修仙传是一个基于Vue.js 3和Node.js的Web应用，旨在提供沉浸式的文字修仙体验。

## 项目结构
- src/
  - frontend/: 前端代码 (Vue.js 3 + Vite + Element Plus)
  - backend/: 后端代码 (Node.js + Express + MongoDB)

## 开发环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB Community Server (开发环境)

## 环境变量配置

### 后端 (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/cultivation_game
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### 前端 (vite.config.js 中配置)
- 代理目标: http://localhost:3001

## 开发流程

### 启动后端服务
```bash
cd src/backend
npm install
npm start
```

### 启动前端服务
```bash
cd src/frontend
npm install
npm run serve
```

## 构建生产版本

### 构建前端
```bash
cd src/frontend
npm run build
```

### 启动生产服务
```bash
cd src/backend
NODE_ENV=production npm start
```

## API 端点
- 用户认证: /api/auth/*
- 角色管理: /api/characters/*
- 修炼系统: /api/cultivation/*
- 战斗系统: /api/battle/*
- 任务系统: /api/tasks/*
- 物品系统: /api/inventory/*

## 前端路由
- 首页: /
- 角色信息: /character
- 修炼系统: /cultivation
- 战斗系统: /battle
- 探索系统: /exploration
- 任务系统: /tasks
- 背包系统: /inventory

## 数据模型
- User: 用户账户信息
- Character: 角色信息
- Item: 物品信息
- Quest: 任务信息

## 部署说明
1. 确保MongoDB服务已启动
2. 构建前端生产版本
3. 配置环境变量
4. 启动后端服务
5. 使用反向代理（如Nginx）服务前端构建产物

## 故障排除
- 确保MongoDB服务正在运行
- 检查端口是否被占用
- 验证环境变量配置
- 检查跨域设置