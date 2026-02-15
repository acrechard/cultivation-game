# 文字修仙传 - 上传到 GitHub 指南

## 简化上传清单

### 必须上传的核心文件/目录：
- src/backend/ (后端代码)
- src/frontend/ (前端代码)
- package.json (根目录，用于部署)
- .env.example (环境变量模板)
- README.md (项目说明)
- DEPLOYMENT.md (部署说明)

### 可以忽略的文件/目录（不会上传）：
- node_modules/ (各个项目的依赖，会在部署时重新安装)
- dist/ (构建后的文件，由前端构建产生)
- uploads/ (上传的文件，如果是临时文件)
- .git/ (Git 自身的目录)
- .vscode/ (编辑器配置)
- logs/ (日志文件)

### 步骤 1: 初始化 Git 仓库
在项目根目录打开终端，执行：
```
git init
```

### 步骤 2: 创建 .gitignore 文件
创建一个 .gitignore 文件，告诉 Git 哪些文件不需要上传：
```
node_modules/
dist/
.DS_Store
Thumbs.db
.env
logs/
*.log
npm-debug.log*
coverage/
.nyc_output/
.vscode/
.idea/
```

### 步骤 3: 添加文件到 Git
```
git add package.json README.md DEPLOYMENT.md .env.example src/
```

### 步骤 4: 提交更改
```
git commit -m "Initial commit: 文字修仙传项目"
```

### 步骤 5: 创建 GitHub 仓库
1. 访问 https://github.com
2. 点击右上角的 "+" 号，选择 "New repository"
3. 输入仓库名称（例如：cultivation-game）
4. 选择 "Public"（公开）
5. 不要勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

### 步骤 6: 连接到 GitHub
复制 GitHub 提供的命令（类似下面的命令，但使用您的仓库地址）：
```
git remote add origin https://github.com/您的用户名/仓库名称.git
git branch -M main
git push -u origin main
```

### 步骤 7: 在 Railway 上部署
1. 访问 https://railway.app
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择您刚创建的仓库
5. 点击 "Deploy Now"
6. 在 "Settings" -> "Environment Variables" 中添加：
   - JWT_SECRET_KEY: 一个随机的长字符串
   - MONGODB_URI: MongoDB Atlas 的连接字符串

### 提示
- 如果您的项目很大，可以删除不必要的文件（如 node_modules）后再上传
- 确保 .gitignore 文件包含了不需要上传的目录
- GitHub 免费账户有存储限制，所以只上传必要的文件

这样，您的朋友就能通过 Railway 提供的 URL 访问游戏了！