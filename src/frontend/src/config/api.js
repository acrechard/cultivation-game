// API配置文件
const getApiBaseUrl = () => {
  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined') {
    // 在生产环境中使用VUE_APP_API_URL环境变量
    // 注意：process.env.VUE_APP_API_URL 会在构建时被替换为实际值
    const envUrl = process.env.VUE_APP_API_URL;
    if (envUrl) {
      return envUrl;
    }
  }
  
  // 如果环境变量未设置，默认返回空字符串（开发环境使用Vite代理）
  // 或者在生产环境可以返回一个默认URL
  return typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? 'https://cultivation-game-production-ccb0.up.railway.app' 
    : '';
};

export const API_BASE_URL = getApiBaseUrl();

// 用于axios或其他HTTP客户端的默认配置
export default {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};