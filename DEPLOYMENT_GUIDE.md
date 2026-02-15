# 文字修仙传 - 部署指南

## 部署到 Railway

### 1. 准备工作
- 注册 Railway 账号：https://railway.app
- 安装 Railway CLI（可选）：`npm install -g @railway/cli`

### 2. 部署后端服务

#### 方法一：使用 GitHub 集成（推荐）
1. 将项目推送到 GitHub 仓库
2. 在 Railway 中选择 "Deploy from GitHub repo"
3. 选择您的仓库
4. 在设置中添加环境变量：
   - JWT_SECRET_KEY: 随机生成的安全密钥
   - MONGODB_URI: MongoDB Atlas 连接字符串

#### 方法二：使用 Railway CLI
1. 登录：`railway login`
2. 初始化项目：`railway init`
3. 设置变量：`railway variables set KEY=value`
4. 部署：`railway up`

### 3. 部署前端服务

前端可以部署到 Netlify 或 Vercel：

#### 部署到 Vercel
1. 安装 Vercel CLI：`npm i -g vercel`
2. 登录：`vercel login`
3. 构建项目：`cd src/frontend && npm run build`
4. 部署：`vercel dist`

#### 部署到 Netlify
1. 访问 https://netlify.com
2. 选择 "New site from Git"
3. 选择您的 GitHub 仓库
4. 设置构建配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: 设置后端API地址

### 4. 环境变量配置

#### 后端需要的环境变量
- `JWT_SECRET_KEY`: 用于JWT签名的密钥
- `MONGODB_URI`: MongoDB数据库连接字符串
- `PORT`: 端口号（默认3001）

#### 前端需要的环境变量
- `VUE_APP_API_URL`: 后端API的完整URL

### 5. MongoDB 设置
推荐使用 MongoDB Atlas（免费版可用）：
1. 注册：https://www.mongodb.com/atlas
2. 创建集群
3. 设置网络访问权限（允许所有IP）
4. 创建数据库用户
5. 获取连接字符串

### 6. 部署完成后
- 前端和后端会有不同的URL
- 需要在前端配置中设置正确的后端API地址
- 记得在CORS配置中添加前端URL

### 7. 持续集成
- 每次推送代码到GitHub时，Railway会自动重新部署
- 可以设置不同的环境（开发、测试、生产）

### 8. 性能优化建议
- 使用CDN加速静态资源
- 启用压缩和缓存
- 监控资源使用情况
- 设置自动扩缩容