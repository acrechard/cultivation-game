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