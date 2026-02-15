@echo off
echo 准备部署文字修仙传项目...

echo 创建部署专用的package.json...

echo {
echo   "name": "cultivation-game-fullstack",
echo   "version": "1.0.0",
echo   "description": "Fullstack cultivation game",
echo   "main": "src/backend/server.js",
echo   "scripts": {
echo     "start": "node src/backend/server.js",
echo     "dev": "cd src/backend ^&^& nodemon server.js",
echo     "build": "echo 'Building frontend...' ^&^& cd src/frontend ^&^& npm run build"
echo   },
echo   "dependencies": {
echo     "express": "^4.18.2",
echo     "cors": "^2.8.5",
echo     "body-parser": "^1.20.2",
echo     "mongoose": "^7.0.3",
echo     "bcryptjs": "^2.4.3",
echo     "jsonwebtoken": "^9.0.0",
echo     "dotenv": "^16.0.3",
echo     "multer": "^1.4.5-lts.1"
echo   },
echo   "engines": {
echo     "node": ">=16.0.0"
echo   },
echo   "keywords": [
echo     "game",
echo     "cultivation",
echo     "rpg",
echo     "mmo"
echo   ],
echo   "author": "Cultivation Game Developer",
echo   "license": "MIT"
echo } > package.json

echo 创建环境变量示例...

echo //# 文字修仙传 - 环境变量示例 > .env.example
echo //# 请将此文件重命名为 .env 并填入实际值 >> .env.example
echo. >> .env.example
echo //# JWT密钥 - 请使用强密钥 >> .env.example
echo JWT_SECRET_KEY=your-super-secret-jwt-key-here-replace-with-random-string >> .env.example
echo. >> .env.example
echo //# MongoDB连接字符串 >> .env.example
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority >> .env.example
echo. >> .env.example
echo //# 端口（Railway会自动设置，但也可以手动指定） >> .env.example
echo PORT=8080 >> .env.example

echo 创建部署说明...

echo //# 部署说明 > DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo //#/ 部署到 Railway >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo //#/ 1. 准备工作 >> DEPLOYMENT.md
echo //1. 注册 Railway 账号：https://railway.app >> DEPLOYMENT.md
echo //2. 将此项目推送到 GitHub 仓库 >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo //#/ 2. 部署步骤 >> DEPLOYMENT.md
echo //1. 在 Railway 中点击 "New Project" >> DEPLOYMENT.md
echo //2. 选择 "Deploy from GitHub repo" >> DEPLOYMENT.md
echo //3. 选择您的仓库 >> DEPLOYMENT.md
echo //4. 点击 "Deploy Now" >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo //#/ 3. 配置环境变量 >> DEPLOYMENT.md
echo //部署后，在 Settings -> Environment Variables 中添加： >> DEPLOYMENT.md
echo //- JWT_SECRET_KEY: 随机生成的安全密钥 >> DEPLOYMENT.md
echo //- MONGODB_URI: MongoDB Atlas 连接字符串 >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo //#/ 4. MongoDB 设置 >> DEPLOYMENT.md
echo //推荐使用 MongoDB Atlas（免费版可用）： >> DEPLOYMENT.md
echo //1. 注册：https://www.mongodb.com/atlas >> DEPLOYMENT.md
echo //2. 创建集群 >> DEPLOYMENT.md
echo //3. 设置网络访问权限（允许 0.0.0.0/0） >> DEPLOYMENT.md
echo //4. 创建数据库用户 >> DEPLOYMENT.md
echo //5. 获取连接字符串 >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo //#/ 5. 访问应用 >> DEPLOYMENT.md
echo //部署完成后，Railway 会提供一个 URL，格式类似于： >> DEPLOYMENT.md
echo //https://your-project-name-production.up.railway.app >> DEPLOYMENT.md
echo. >> DEPLOYMENT.md
echo //# 注意事项 >> DEPLOYMENT.md
echo //- 首次部署可能需要几分钟时间 >> DEPLOYMENT.md
echo //- 确保环境变量已正确配置 >> DEPLOYMENT.md
echo //- 检查 CORS 设置是否允许前端域名访问 >> DEPLOYMENT.md

echo 部署准备完成！

echo.
echo 接下来的步骤：
echo 1. 检查生成的 package.json 和 .env.example 文件
echo 2. 将项目推送到 GitHub
echo 3. 在 Railway 上创建新项目并连接到您的 GitHub 仓库
echo 4. 配置环境变量
echo 5. 等待自动部署完成
echo.
echo 提示：如果需要修改后端端口，请编辑 src/backend/server.js 中的 PORT 变量

pause