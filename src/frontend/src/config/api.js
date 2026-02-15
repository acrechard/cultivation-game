// API配置文件
const getApiBaseUrl = () => {
  // 在浏览器环境中检查
  if (typeof window !== 'undefined') {
    // 生产环境：使用VUE_APP_API_URL环境变量
    if (process.env.NODE_ENV === 'production') {
      return process.env.VUE_APP_API_URL || 'https://cultivation-game-production-ccb0.up.railway.app';
    }
  }
  
  // 开发环境：使用相对路径（由Vite代理处理）
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// 用于axios或其他HTTP客户端的默认配置
export default {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};