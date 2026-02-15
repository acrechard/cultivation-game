<template>
  <div class="home">
    <div class="welcome-section" style="margin-bottom: 20px; text-align: center;">
      <h2 style="color: #409EFF;">欢迎来到修仙世界</h2>
      <p style="font-size: 16px; color: #666;">在这里，你将踏上从凡人到仙人的漫长道路</p>
    </div>

    <div class="quick-actions" style="display: flex; gap: 20px; margin-bottom: 30px;">
      <div 
        class="action-card" 
        @click="goToCharacter"
        style="flex: 1; padding: 20px; background: #f5f7fa; border-radius: 8px; cursor: pointer; text-align: center; transition: box-shadow 0.3s;"
        onMouseEnter="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
        onMouseLeave="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'"
      >
        <div class="action-icon" style="font-size: 40px; margin-bottom: 10px;">👤</div>
        <div class="action-text" style="font-size: 16px; font-weight: bold;">角色信息</div>
      </div>
      <div 
        class="action-card" 
        @click="goToCultivation"
        style="flex: 1; padding: 20px; background: #f5f7fa; border-radius: 8px; cursor: pointer; text-align: center; transition: box-shadow 0.3s;"
        onMouseEnter="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
        onMouseLeave="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'"
      >
        <div class="action-icon" style="font-size: 40px; margin-bottom: 10px;">🌱</div>
        <div class="action-text" style="font-size: 16px; font-weight: bold;">开始修炼</div>
      </div>
      <div 
        class="action-card" 
        @click="goToExploration"
        style="flex: 1; padding: 20px; background: #f5f7fa; border-radius: 8px; cursor: pointer; text-align: center; transition: box-shadow 0.3s;"
        onMouseEnter="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
        onMouseLeave="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'"
      >
        <div class="action-icon" style="font-size: 40px; margin-bottom: 10px;">🗺️</div>
        <div class="action-text" style="font-size: 16px; font-weight: bold;">探索世界</div>
      </div>
      <div 
        class="action-card" 
        @click="goToTasks"
        style="flex: 1; padding: 20px; background: #f5f7fa; border-radius: 8px; cursor: pointer; text-align: center; transition: box-shadow 0.3s;"
        onMouseEnter="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
        onMouseLeave="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'"
      >
        <div class="action-icon" style="font-size: 40px; margin-bottom: 10px;">📜</div>
        <div class="action-text" style="font-size: 16px; font-weight: bold;">任务系统</div>
      </div>
      <div 
        class="action-card" 
        @click="goToBreakthrough"
        style="flex: 1; padding: 20px; background: #f5f7fa; border-radius: 8px; cursor: pointer; text-align: center; transition: box-shadow 0.3s;"
        onMouseEnter="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
        onMouseLeave="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'"
      >
        <div class="action-icon" style="font-size: 40px; margin-bottom: 10px;">✨</div>
        <div class="action-text" style="font-size: 16px; font-weight: bold;">境界突破</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    goToCharacter() {
      this.$router.push('/character');
    },
    goToCultivation() {
      this.$router.push('/cultivation');
    },
    goToExploration() {
      this.$router.push('/exploration');
    },
    goToTasks() {
      this.$router.push('/tasks');
    },
    goToBreakthrough() {
      this.$router.push('/breakthrough');
    }
  },
  mounted() {
    document.title = '文字修仙传 - 首页';
  }
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 30px;
  text-align: center;
}

.welcome-section h2 {
  margin: 0 0 10px 0;
  color: #409EFF;
}

.welcome-section p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.quick-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.action-card {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: box-shadow 0.3s;
}

.action-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.action-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.action-text {
  font-size: 16px;
  font-weight: bold;
}

.game-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  margin-top: 10px;
  font-size: 16px;
}
</style>