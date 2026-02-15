# 部署检查清单

## 上传前检查
- [ ] 项目根目录包含 package.json
- [ ] 项目根目录包含 .gitignore
- [ ] 项目根目录包含 README.md
- [ ] 项目根目录包含 DEPLOYMENT.md
- [ ] src/backend/ 目录存在且包含完整后端代码
- [ ] src/frontend/ 目录存在且包含完整前端代码
- [ ] node_modules/ 目录不在上传范围内（应被 .gitignore 忽略）

## GitHub 上传检查
- [ ] 已安装 Git
- [ ] 已在项目目录打开终端
- [ ] 已运行 `git init`
- [ ] 已运行 `git add .`
- [ ] 已运行 `git commit -m "Initial commit"`
- [ ] 已创建 GitHub 仓库
- [ ] 已运行 `git remote add origin <仓库地址>`
- [ ] 已运行 `git push -u origin main`

## Railway 部署检查
- [ ] 已注册 Railway 账户
- [ ] 已创建新项目并连接到 GitHub 仓库
- [ ] 已在 Environment Variables 中设置 JWT_SECRET_KEY
- [ ] 已在 Environment Variables 中设置 MONGODB_URI
- [ ] 后端服务已成功部署
- [ ] 已获取后端服务的 URL

## 前端部署检查
- [ ] 前端已构建完成（npm run build）
- [ ] 前端已部署到 Vercel/Netlify 或其他静态托管服务
- [ ] 已在前端配置中设置正确的后端 API 地址

## 测试检查
- [ ] 您可以访问部署后的应用
- [ ] 您的朋友可以访问部署后的应用
- [ ] 所有功能正常工作
- [ ] 用户注册/登录功能正常
- [ ] 游戏数据可以正常保存和加载

## 常见问题解决
1. **部署失败**：检查环境变量是否正确配置
2. **数据库连接失败**：检查 MongoDB URI 是否正确
3. **API 请求失败**：检查前后端 URL 配置
4. **静态资源加载失败**：检查前端构建配置

## 额外提示
- 保存好您的 Railway 和 MongoDB Atlas 账户信息
- 记录下部署后的 URL，方便分享
- 定期备份重要数据
- 监控应用的资源使用情况