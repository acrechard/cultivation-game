# 文字修仙传

一个基于Web的文字修仙RPG游戏，玩家可以在其中体验修仙世界的乐趣。

## 技术栈

- **前端**: Vue.js 3, Vite, Element Plus, Pinia, Vue Router
- **后端**: Node.js, Express, MongoDB/Mongoose
- **认证**: JWT Token
- **部署**: Railway/Vercel

## 功能特色

- 修炼系统：独特的修仙境界体系
- 战斗系统：回合制战斗机制
- 任务系统：丰富的修仙任务
- 背包系统：物品管理和装备系统
- 探索系统：随机事件和地图探索
- 突破系统：境界突破挑战
- 丹药炼制：材料收集和丹药炼制

## 部署说明

### 后端部署

1. 克隆仓库
   ```bash
   git clone <repository-url>
   cd 文字修仙传
   ```

2. 安装依赖
   ```bash
   cd src/backend
   npm install
   ```

3. 配置环境变量
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入实际值
   ```

4. 启动服务
   ```bash
   npm start
   ```

### 前端部署

1. 构建前端项目
   ```bash
   cd src/frontend
   npm install
   npm run build
   ```

2. 部署到静态托管服务（如Vercel、Netlify等）

### 云部署

推荐使用以下服务进行部署：

1. **后端**：Railway、Heroku、Render
2. **前端**：Vercel、Netlify、GitHub Pages
3. **数据库**：MongoDB Atlas

## 环境变量

- `JWT_SECRET_KEY`: JWT签名密钥
- `MONGODB_URI`: MongoDB连接字符串
- `PORT`: 服务器端口（默认8080）

## API 文档

API文档可在 `/api/docs` 路径下查看。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 许可证

MIT