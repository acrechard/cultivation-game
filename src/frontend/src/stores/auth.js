import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && state.isAuthenticated
  },

  actions: {
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/auth/register', userData);
        const { token, user } = response.data;
        
        // 保存token到本地存储和状态
        localStorage.setItem('token', token);
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        
        return { success: true, user, token };
      } catch (error) {
        this.error = error.response?.data?.error || '注册失败';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/auth/login', credentials);
        const { token, user } = response.data;
        
        // 保存token到本地存储和状态
        localStorage.setItem('token', token);
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        
        return { success: true, user, token };
      } catch (error) {
        this.error = error.response?.data?.error || '登录失败';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      // 清除本地存储和状态
      localStorage.removeItem('token');
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
    },

    async verifyToken() {
      if (!this.token) {
        this.isAuthenticated = false;
        return false;
      }

      try {
        // 设置请求头
        const config = {
          headers: { Authorization: `Bearer ${this.token}` }
        };
        
        const response = await axios.get('/api/auth/verify', config);
        this.user = response.data.user;
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        // Token无效，清除状态
        this.logout();
        return false;
      }
    }
  }
});