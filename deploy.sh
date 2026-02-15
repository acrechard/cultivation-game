# 部署脚本
# 用于准备项目以便部署到云端平台

# 构建前端项目
echo "正在构建前端项目..."
cd src/frontend
npm install
npm run build
cd ../..

# 确保根目录有package.json
echo "根目录package.json已准备就绪"

# 提示用户配置环境变量
echo "请确保已配置以下环境变量："
echo "- JWT_SECRET_KEY"
echo "- MONGODB_URI"
echo "- PORT (可选，默认为8080)"

echo "部署准备完成！"
echo "现在您可以将项目推送到GitHub并使用Railway等平台进行部署。"