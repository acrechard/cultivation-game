<template>
  <div id="app">
    <!-- 显示加载状态 -->
    <div v-if="gameStore.isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <p>正在加载游戏数据...</p>
      </div>
    </div>
    
    <!-- 主界面 -->
    <div v-else>
      <GlobalStatsBar />
      <div class="header" style="background-color: #409EFF; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 1.8rem;">文字修仙传</h1>
      </div>
      
      <!-- 导航菜单 -->
      <div class="nav-menu" style="background-color: #545c64; padding: 0 20px;">
        <el-menu
          :default-active="$route.path"
          mode="horizontal"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="border: none; max-width: 1200px; margin: 0 auto;"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/character">角色信息</el-menu-item>
          <el-menu-item index="/cultivation">修炼系统</el-menu-item>
          <el-menu-item index="/exploration">探索世界</el-menu-item>
          <el-menu-item index="/battle">战斗系统</el-menu-item>
          <el-menu-item index="/inventory">背包系统</el-menu-item>
          <el-menu-item index="/tasks">任务系统</el-menu-item>
          <el-menu-item index="/breakthrough">突破系统</el-menu-item>
          <el-menu-item index="/alchemy">丹药炼制</el-menu-item>
          
          <!-- 用户菜单 -->
          <div class="user-menu" style="float: right;">
            <template v-if="authStore.isLoggedIn">
              <el-sub-menu>
                <template #title>{{ authStore.user?.username || '用户' }}</template>
                <el-menu-item @click="handleLogout">退出登录</el-menu-item>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item index="/auth">登录/注册</el-menu-item>
            </template>
          </div>
        </el-menu>
      </div>
      
      <div class="main-content" style="padding: 20px; min-height: calc(100vh - 180px);">
        <router-view />
      </div>
      <div class="footer" style="background-color: #f5f5f5; text-align: center; padding: 10px; color: #666; height: 40px;">
        <p style="margin: 0;">© 2026 文字修仙传 - 体验真正的修仙之旅</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useGameStore } from './stores/game';
import { useAuthStore } from './stores/auth';
import GlobalStatsBar from './components/GlobalStatsBar.vue';
import { ElMessage } from 'element-plus';

export default {
  name: 'App',
  components: {
    GlobalStatsBar
  },
  setup() {
    const authStore = useAuthStore();
    const gameStore = useGameStore();
    
    return {
      authStore,
      gameStore
    };
  },
  async created() {
    // 页面加载时验证token
    const isAuthenticated = await this.authStore.verifyToken();
    
    // 如果用户已认证，尝试加载游戏状态
    if (isAuthenticated) {
      const characterId = localStorage.getItem('characterId');
      if (characterId) {
        await this.gameStore.loadGameState(characterId);
        // 启动自动保存功能
        this.gameStore.startAutoSave(5); // 每5分钟自动保存一次
      }
      // 如果没有角色ID，用户会被路由守卫重定向到角色创建页面
    }
  },
  async beforeUnmount() {
    // 组件销毁前保存游戏状态
    const gameStore = useGameStore();
    await gameStore.manualSaveBeforeUnload();
  },
  methods: {
    async handleLogout() {
      await this.authStore.logout();
      this.$router.push('/auth');
      ElMessage.success('已退出登录');
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #ffffff; /* 确保背景色为白色 */
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  padding: 20px;
}
</style>