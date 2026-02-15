# 文字修仙传 - 云端部署配置
FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY ./src/backend/package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY ./src/backend/ .

# 创建uploads目录（如果需要）
RUN mkdir -p uploads

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8080
ENV MONGODB_URI=mongodb+srv://<your-cluster>/<database>?retryWrites=true&w=majority

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["node", "server.js"]