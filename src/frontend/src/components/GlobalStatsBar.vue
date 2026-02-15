<template>
  <div class="global-stats-bar" v-if="gameStore.isInitialized && !gameStore.isLoading">
    <div class="stats-container">
      <div class="stat-item">
        <span class="stat-label">当前境界</span>
        <span class="stat-value">{{ cultivation.realm }} · 第{{ cultivation.realmLevel }}层</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">修为进度</span>
        <span class="stat-value">{{ cultivation.cultivationExp }} / {{ cultivation.cultivationExpToNext }}</span>
        <el-progress 
          :percentage="getExperiencePercentage()" 
          :color="getProgressColor()"
          :stroke-width="8"
          style="margin-top: 5px; width: 120px;"
        />
      </div>
      <div class="stat-item">
        <span class="stat-label">灵力值</span>
        <span class="stat-value">{{ character.mana }} / {{ character.maxMana }}</span>
        <el-progress 
          :percentage="(character.mana / character.maxMana) * 100" 
          :color="getManaProgressColor()"
          :stroke-width="8"
          style="margin-top: 5px; width: 120px;"
        />
      </div>
      <div class="stat-item">
        <span class="stat-label">游戏时间</span>
        <span class="stat-value">{{ formattedGameTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useGameStore } from '@/stores/game';

export default {
  name: 'GlobalStatsBar',
  computed: {
    gameStore() {
      return useGameStore();
    },
    cultivation() {
      return this.gameStore.cultivation;
    },
    character() {
      return this.gameStore.character;
    },
    formattedGameTime() {
      if (!this.gameStore.gameTime) return '';
      const date = new Date(this.gameStore.gameTime);
      return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
    }
  },
  methods: {
    getExperiencePercentage() {
      if (!this.cultivation.cultivationExpToNext || this.cultivation.cultivationExpToNext === 0) {
        return 0;
      }
      return Math.round((this.cultivation.cultivationExp / this.cultivation.cultivationExpToNext) * 100);
    },
    getProgressColor() {
      const percentage = this.getExperiencePercentage();
      if (percentage < 30) return '#5cb85c'; // 绿色
      if (percentage < 60) return '#f0ad4e'; // 黄色
      return '#d9534f'; // 红色
    },
    getManaProgressColor() {
      const manaPercentage = (this.character.mana / this.character.maxMana) * 100;
      if (manaPercentage < 30) return '#d9534f'; // 红色
      if (manaPercentage < 60) return '#f0ad4e'; // 黄色
      return '#5cb85c'; // 绿色
    }
  }
};
</script>

<style scoped>
.global-stats-bar {
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats-container {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #bdc3c7;
  margin-bottom: 2px;
}

.stat-value {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}
</style>