import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import { useGameStore } from './stores/game';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus);
app.use(router);

// 应用挂载后初始化游戏状态
app.mount('#app').$nextTick(() => {
  const gameStore = useGameStore();
  
  // 添加页面卸载事件监听器
  window.addEventListener('beforeunload', async () => {
    await gameStore.manualSaveBeforeUnload();
  });
  
  // 添加页面隐藏事件监听器（如切换标签页或最小化窗口）
  window.addEventListener('pagehide', async () => {
    await gameStore.manualSaveBeforeUnload();
  });
});