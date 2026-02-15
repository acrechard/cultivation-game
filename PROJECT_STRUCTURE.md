# 文字修仙传 - 项目结构说明

## 核心文件（必须上传）

### 1. 后端代码
路径: `src/backend/`
- server.js - 主服务器文件
- package.json - 后端依赖
- models/ - 数据模型
- routes/ - API路由
- middleware/ - 中间件

### 2. 前端代码  
路径: `src/frontend/`
- package.json - 前端依赖
- src/ - Vue组件和源代码
- public/ - 静态资源
- vite.config.js - 构建配置

### 3. 部署配置文件
- package.json (根目录) - 用于云端部署
- .gitignore - 指定不需要上传的文件
- README.md - 项目说明
- DEPLOYMENT.md - 部署指南

## 不需要上传的文件（会被忽略）

- node_modules/ - 依赖目录（太大，会重新安装）
- dist/ - 构建输出目录
- uploads/ - 上传文件目录
- .env - 敏感配置文件

## 如何上传

### 第一步：安装 Git
1. 访问 https://git-scm.com/
2. 下载并安装 Git

### 第二步：在项目目录打开终端
1. 在项目文件夹空白处按 Shift+右键
2. 选择 "在此处打开 PowerShell 窗口" 或 "在此处打开命令窗口"

### 第三步：初始化 Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### 第四步：创建 GitHub 仓库
1. 访问 https://github.com
2. 登录您的账户
3. 点击右上角的 "+" 号，选择 "New repository"
4. 输入仓库名称（例如："cultivation-game"）
5. 选择 "Public"
6. 不要勾选 "Initialize this repository with a README"
7. 点击 "Create repository"

### 第五步：上传项目
复制 GitHub 页面上显示的命令（类似如下）：
```bash
git remote add origin https://github.com/您的用户名/仓库名称.git
git branch -M main
git push -u origin main
```

### 第六步：部署到 Railway
1. 访问 https://railway.app
2. 注册并登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 选择您的仓库
6. 等待自动部署
7. 在 Environment Variables 中添加：
   - JWT_SECRET_KEY: 一个随机的长字符串
   - MONGODB_URI: MongoDB Atlas 的连接字符串

## 重要提醒
- 不要上传 node_modules 目录，它会被 .gitignore 自动忽略
- 上传后，Railway 会自动运行 npm install 安装依赖
- 记得配置环境变量，否则部署会失败