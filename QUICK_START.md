# 文字修仙传 - 快速启动指南

## 准备工作

### 1. 系统要求
- Windows 10/11 或其他支持的操作系统
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB Community Server (可选，用于完整功能)

### 2. 安装依赖
```bash
# 安装前端依赖
cd src/frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

## 启动应用

### 方法一：独立启动（推荐用于开发）

#### 启动后端服务
```bash
cd src/backend
npm start
```
后端服务将在 http://localhost:3001 启动

#### 启动前端服务
```bash
cd src/frontend
npm run serve
```
前端服务将在 http://localhost:3000 或其他可用端口启动

### 方法二：测试模式（无需MongoDB）

如果尚未安装MongoDB，可以使用测试模式：

```bash
# 在后端目录中
cd src/backend
node server-test.js
```

## 项目结构

```
src/
├── frontend/           # 前端代码
│   ├── public/         # 静态资源
│   ├── src/
│   │   ├── views/      # 页面组件
│   │   ├── router/     # 路由配置
│   │   └── store/      # 状态管理
│   └── package.json    # 前端依赖
└── backend/            # 后端代码
    ├── models/         # 数据模型
    ├── routes/         # API路由
    ├── middleware/     # 中间件
    └── package.json    # 后端依赖
```

## 功能模块

1. **首页** - 游戏入口和导航
2. **角色系统** - 角色信息和属性展示
3. **修炼系统** - 修炼功能和境界提升
4. **战斗系统** - 战斗机制
5. **探索系统** - 世界探索功能
6. **任务系统** - 任务管理和追踪
7. **背包系统** - 物品管理和使用

## 故障排除

### 常见问题

Q: 访问页面显示空白或404错误？
A: 确保前后端服务都已启动，并检查端口是否正确。

Q: MongoDB连接失败？
A: 使用测试模式(server-test.js)进行开发，或安装并启动MongoDB服务。

Q: 端口被占用？
A: Vite会自动选择可用端口，查看控制台输出获取正确的访问地址。

## 开发模式

要进行开发，请分别启动前端和后端服务，利用热重载功能实时预览更改。

## 生产部署

1. 构建前端应用: `npm run build` (在frontend目录)
2. 配置后端环境变量
3. 启动后端服务
4. 使用Nginx或其他web服务器托管前端构建产物