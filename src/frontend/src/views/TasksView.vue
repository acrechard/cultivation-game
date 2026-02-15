<template>
  <div class="tasks">
    <el-page-header @back="$router.go(-1)" content="任务系统"></el-page-header>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="task-filters">
          <template #header>
            <span>任务筛选</span>
          </template>
          
          <el-form :model="filters" label-position="top">
            <el-form-item label="任务类型">
              <el-select 
                v-model="filters.type" 
                placeholder="请选择类型"
                clearable
                @change="loadTasks"
              >
                <el-option label="主线任务" value="主线任务"></el-option>
                <el-option label="支线任务" value="支线任务"></el-option>
                <el-option label="日常任务" value="日常任务"></el-option>
                <el-option label="修炼任务" value="修炼任务"></el-option>
                <el-option label="探索任务" value="探索任务"></el-option>
                <el-option label="战斗任务" value="战斗任务"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="任务状态">
              <el-select 
                v-model="filters.status" 
                placeholder="请选择状态"
                clearable
                @change="loadTasks"
              >
                <el-option label="未接取" value="未接取"></el-option>
                <el-option label="进行中" value="进行中"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
                <el-option label="已领取奖励" value="已领取奖励"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="loadTasks" style="width: 100%;">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="18">
        <el-card>
          <template #header>
            <div class="task-header">
              <span>任务列表</span>
              <el-button type="success" @click="showAvailableTasks">查看可接任务</el-button>
            </div>
          </template>
          
          <el-table 
            :data="tasks" 
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="title" label="任务名称" width="200" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="difficulty" label="难度" width="80">
              <template #default="scope">
                <el-tag 
                  :type="getDifficultyTagType(scope.row.difficulty)"
                  size="small"
                >
                  {{ scope.row.difficulty }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag 
                  :type="getStatusTagType(scope.row.status)"
                  size="small"
                >
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="进度" width="150">
              <template #default="scope">
                <div v-if="scope.row.conditions && scope.row.conditions.length > 0">
                  <div 
                    v-for="(condition, idx) in scope.row.conditions" 
                    :key="idx"
                    class="condition-progress"
                  >
                    <span>{{ condition.type }}: {{ condition.currentCount }}/{{ condition.requiredCount }}</span>
                    <el-progress 
                      :percentage="getConditionPercentage(condition)" 
                      :stroke-width="8"
                      :color="getProgressColor(getConditionPercentage(condition))"
                    />
                  </div>
                </div>
                <span v-else>无进度要求</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <div class="task-actions">
                  <el-button 
                    v-if="scope.row.status === '未接取'" 
                    type="primary" 
                    size="small"
                    @click="acceptTask(scope.row._id)"
                  >
                    接取
                  </el-button>
                  
                  <el-button 
                    v-if="scope.row.status === '进行中'" 
                    type="warning" 
                    size="small"
                    @click="viewTaskDetails(scope.row)"
                  >
                    查看
                  </el-button>
                  
                  <el-button 
                    v-if="scope.row.status === '已完成'" 
                    type="success" 
                    size="small"
                    @click="completeTask(scope.row._id)"
                  >
                    领取奖励
                  </el-button>
                  
                  <el-button 
                    v-if="scope.row.status === '进行中'" 
                    type="info" 
                    size="small"
                    @click="abandonTask(scope.row._id)"
                  >
                    放弃
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalTasks"
            style="margin-top: 20px; text-align: center;"
          />
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 任务详情弹窗 -->
    <el-dialog
      v-model="showTaskDetailDialog"
      title="任务详情"
      width="60%"
      :before-close="closeTaskDetailDialog"
    >
      <div v-if="selectedTask" class="task-detail-content">
        <h3>{{ selectedTask.title }}</h3>
        <p><strong>类型:</strong> <el-tag size="small" :type="getDifficultyTagType(selectedTask.type)">{{ selectedTask.type }}</el-tag></p>
        <p><strong>难度:</strong> <el-tag size="small" :type="getDifficultyTagType(selectedTask.difficulty)">{{ selectedTask.difficulty }}</el-tag></p>
        <p><strong>描述:</strong> {{ selectedTask.description }}</p>
        
        <div class="rewards-section" v-if="selectedTask.rewards">
          <h4>任务奖励</h4>
          <div class="reward-item" v-if="selectedTask.rewards.exp > 0">
            <i class="el-icon-magic-stick"></i> 经验值: +{{ selectedTask.rewards.exp }}
          </div>
          <div class="reward-item" v-if="selectedTask.rewards.money > 0">
            <i class="el-icon-wallet"></i> 金钱: +{{ selectedTask.rewards.money }}
          </div>
          <div class="reward-item" v-if="selectedTask.rewards.cultivationExp > 0">
            <i class="el-icon-medal"></i> 修炼经验: +{{ selectedTask.rewards.cultivationExp }}
          </div>
          <div class="reward-item" v-for="(item, idx) in selectedTask.rewards.items" :key="idx">
            <i class="el-icon-goods"></i> {{ item.name }} x{{ item.quantity }}
          </div>
        </div>
        
        <div class="conditions-section" v-if="selectedTask.conditions && selectedTask.conditions.length > 0">
          <h4>完成条件</h4>
          <div 
            v-for="(condition, idx) in selectedTask.conditions" 
            :key="idx"
            class="condition-item"
          >
            <el-checkbox 
              :model-value="condition.currentCount >= condition.requiredCount"
              :disabled="true"
            >
              {{ condition.type }}: {{ condition.target || '未知目标' }} 
              <span class="condition-count">({{ condition.currentCount }}/{{ condition.requiredCount }})</span>
            </el-checkbox>
            <el-progress 
              :percentage="getConditionPercentage(condition)" 
              :color="getProgressColor(getConditionPercentage(condition))"
            />
          </div>
        </div>
        
        <div class="requirements-section" v-if="selectedTask.requirements">
          <h4>接取要求</h4>
          <div class="requirement-item" v-if="selectedTask.requirements.level > 1">
            <i class="el-icon-star-off"></i> 等级要求: {{ selectedTask.requirements.level }}级
          </div>
          <div class="requirement-item" v-if="selectedTask.requirements.realm !== '炼气期'">
            <i class="el-icon-coordinate"></i> 境界要求: {{ selectedTask.requirements.realm }}
          </div>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeTaskDetailDialog">关闭</el-button>
          <el-button 
            v-if="selectedTask && selectedTask.status === '未接取'" 
            type="primary" 
            @click="acceptTask(selectedTask._id)"
          >
            接取任务
          </el-button>
          <el-button 
            v-if="selectedTask && selectedTask.status === '已完成'" 
            type="success" 
            @click="completeTask(selectedTask._id)"
          >
            领取奖励
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 可接任务弹窗 -->
    <el-dialog
      v-model="showAvailableDialog"
      title="可接任务"
      width="50%"
    >
      <el-table :data="availableTasks" style="width: 100%">
        <el-table-column prop="title" label="任务名称" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="difficulty" label="难度" width="80">
          <template #default="scope">
            <el-tag :type="getDifficultyTagType(scope.row.difficulty)" size="small">
              {{ scope.row.difficulty }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" size="small" @click="acceptTask(scope.row._id)">接取</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <el-button @click="showAvailableDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'TasksView',
  data() {
    return {
      tasks: [],
      availableTasks: [],
      filters: {
        type: '',
        status: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalTasks: 0,
      showTaskDetailDialog: false,
      showAvailableDialog: false,
      selectedTask: null
    };
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.status === '已完成') {
        return 'success-row';
      } else if (row.status === '进行中') {
        return 'warning-row';
      } else if (row.status === '未接取') {
        return 'info-row';
      }
      return '';
    },
    getDifficultyTagType(difficulty) {
      const types = {
        '简单': 'success',
        '普通': 'primary',
        '困难': 'warning',
        '极难': 'danger'
      };
      return types[difficulty] || 'info';
    },
    getStatusTagType(status) {
      const types = {
        '未接取': 'info',
        '进行中': 'warning',
        '已完成': 'success',
        '已领取奖励': 'primary'
      };
      return types[status] || 'info';
    },
    getConditionPercentage(condition) {
      if (!condition.requiredCount) return 0;
      return Math.min(100, Math.floor((condition.currentCount / condition.requiredCount) * 100));
    },
    getProgressColor(percentage) {
      if (percentage >= 100) return '#67C23A'; // 绿色
      if (percentage >= 50) return '#E6A23C'; // 黄色
      return '#409EFF'; // 蓝色
    },
    async loadTasks() {
      try {
        // 模拟API调用
        const mockTasks = [
          {
            _id: '1',
            title: '初入修仙界',
            type: '主线任务',
            difficulty: '简单',
            description: '了解修仙世界的基本情况，完成新手引导',
            status: '未接取',
            rewards: { exp: 100, money: 50, items: [{ name: '回血丹', quantity: 2 }] },
            requirements: { level: 1 },
            conditions: [
              { type: '对话NPC', target: '入门导师', requiredCount: 1, currentCount: 0 }
            ]
          },
          {
            _id: '2',
            title: '第一次修炼',
            type: '修炼任务',
            difficulty: '简单',
            description: '完成一次基础修炼，感受天地灵气',
            status: '进行中',
            rewards: { exp: 200, cultivationExp: 50 },
            requirements: { level: 1 },
            conditions: [
              { type: '修炼等级', target: '炼气期1层', requiredCount: 1, currentCount: 1 }
            ]
          },
          {
            _id: '3',
            title: '击败山中野怪',
            type: '战斗任务',
            difficulty: '普通',
            description: '前往后山击败3只野狼，保护村民安全',
            status: '已完成',
            rewards: { exp: 300, money: 100, items: [{ name: '狼牙', quantity: 3 }] },
            requirements: { level: 3 },
            conditions: [
              { type: '击杀怪物', target: '山中野狼', requiredCount: 3, currentCount: 3 }
            ]
          },
          {
            _id: '4',
            title: '采集草药',
            type: '探索任务',
            difficulty: '普通',
            description: '在灵药园采集10株清心草，用于炼制丹药',
            status: '已领取奖励',
            rewards: { exp: 250, money: 80 },
            requirements: { level: 5 },
            conditions: [
              { type: '收集物品', target: '清心草', requiredCount: 10, currentCount: 10 }
            ]
          }
        ];
        
        // 应用筛选条件
        let filteredTasks = [...mockTasks];
        
        if (this.filters.type) {
          filteredTasks = filteredTasks.filter(task => task.type === this.filters.type);
        }
        
        if (this.filters.status) {
          filteredTasks = filteredTasks.filter(task => task.status === this.filters.status);
        }
        
        this.tasks = filteredTasks;
        this.totalTasks = filteredTasks.length;
        
        ElMessage.success('任务列表加载成功');
      } catch (error) {
        ElMessage.error('加载任务列表失败');
        console.error(error);
      }
    },
    async loadAvailableTasks() {
      try {
        // 模拟API调用
        this.availableTasks = [
          {
            _id: '5',
            title: '门派试炼',
            type: '主线任务',
            difficulty: '困难',
            description: '通过门派的入门试炼，证明自己的实力',
            status: '未接取',
            rewards: { exp: 500, money: 200, items: [{ name: '门派令牌', quantity: 1 }] },
            requirements: { level: 10, realm: '筑基期' }
          },
          {
            _id: '6',
            title: '护送商队',
            type: '支线任务',
            difficulty: '普通',
            description: '护送商队穿越危险区域，获得报酬',
            status: '未接取',
            rewards: { exp: 300, money: 150 },
            requirements: { level: 5 }
          }
        ];
      } catch (error) {
        ElMessage.error('加载可接任务失败');
      }
    },
    async acceptTask(taskId) {
      try {
        const task = this.tasks.find(t => t._id === taskId);
        if (!task) {
          ElMessage.error('任务不存在');
          return;
        }
        
        if (task.status !== '未接取') {
          ElMessage.warning('该任务已被接取或已完成');
          return;
        }
        
        // 模拟接取任务
        task.status = '进行中';
        ElMessage.success(`成功接取任务：${task.title}`);
        
        // 消耗游戏时间（接取任务消耗少量时间）
        this.consumeGameTime(1/60); // 0.5天 = 1/60个月
        
        this.closeTaskDetailDialog();
      } catch (error) {
        ElMessage.error('接取任务失败');
      }
    },
    
    // 消耗游戏时间的方法
    consumeGameTime(months) {
      // 从全局store获取当前游戏时间
      let currentTime = new Date(this.gameStore.gameState.currentTime);
      
      // 根据参数增加游戏时间
      currentTime.setMonth(currentTime.getMonth() + months);
      
      // 更新全局store中的游戏时间
      this.gameStore.gameState.currentTime = currentTime.toISOString();
      
      // 消耗寿命（按比例消耗）
      this.consumeLife(months);
      
      // 显示时间流逝提示
      if (months >= 1) {
        const wholeMonths = Math.floor(months);
        const days = Math.round((months - wholeMonths) * 30);
        let timeString = '';
        if (wholeMonths > 0) timeString += `${wholeMonths}个月`;
        if (days > 0) timeString += `${days}天`;
        ElMessage.info(`时光飞逝，已过去${timeString}...`);
      } else {
        const days = Math.round(months * 30);
        if (days > 0) {
          ElMessage.info(`时光飞逝，已过去${days}天...`);
        }
      }
    },
    
    // 消耗寿命的方法
    consumeLife(months) {
      // 年龄增长
      this.gameStore.life.age += months/12; // 按月数增加年龄
      
      // 剩余寿命减少
      this.gameStore.life.remainingYears -= months/12;
      
      // 如果剩余寿命小于等于0，则触发死亡事件
      if (this.gameStore.life.remainingYears <= 0) {
        ElMessage.error('寿元耗尽，修士陨落...');
        // 可以在这里添加死亡处理逻辑，比如重置游戏或进入特殊状态
      }
    },
    async completeTask(taskId) {
      try {
        const task = this.tasks.find(t => t._id === taskId);
        if (!task) {
          ElMessage.error('任务不存在');
          return;
        }
        
        if (task.status !== '已完成') {
          ElMessage.warning('任务尚未完成');
          return;
        }
        
        // 模拟完成任务
        task.status = '已领取奖励';
        ElMessage.success(`任务完成，奖励已领取：${task.title}`);
        
        // 消耗游戏时间（完成任务消耗一定时间）
        this.consumeGameTime(1/30); // 1天 = 1/30个月
        
        this.closeTaskDetailDialog();
      } catch (error) {
        ElMessage.error('完成任务失败');
      }
    },
    async abandonTask(taskId) {
      try {
        await ElMessageBox.confirm(
          '确定要放弃这个任务吗？放弃后需要重新接取才能继续。',
          '确认放弃',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        const task = this.tasks.find(t => t._id === taskId);
        if (!task) {
          ElMessage.error('任务不存在');
          return;
        }
        
        if (task.status !== '进行中') {
          ElMessage.warning('无法放弃该任务');
          return;
        }
        
        // 模拟放弃任务
        task.status = '未接取';
        task.conditions.forEach(condition => {
          condition.currentCount = 0;
        });
        
        ElMessage.success(`已放弃任务：${task.title}`);
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('放弃任务失败');
        }
      }
    },
    viewTaskDetails(task) {
      this.selectedTask = { ...task };
      this.showTaskDetailDialog = true;
    },
    closeTaskDetailDialog() {
      this.showTaskDetailDialog = false;
      this.selectedTask = null;
    },
    showAvailableTasks() {
      this.loadAvailableTasks();
      this.showAvailableDialog = true;
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.loadTasks();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.loadTasks();
    }
  },
  async mounted() {
    document.title = '文字修仙传 - 任务系统';
    await this.loadTasks();
  }
};
</script>

<style scoped lang="scss">
.tasks {
  padding: 20px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.condition-progress {
  margin-bottom: 5px;
  
  .el-progress {
    margin-top: 3px;
  }
}

.task-actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.task-detail-content {
  h3 {
    color: #303133;
    margin-bottom: 15px;
  }
  
  p {
    margin: 8px 0;
    line-height: 1.5;
  }
  
  .rewards-section, .conditions-section, .requirements-section {
    margin: 20px 0;
    
    h4 {
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 5px;
      margin-bottom: 10px;
      color: #303133;
    }
  }
  
  .reward-item, .requirement-item {
    padding: 5px 0;
    color: #606266;
    
    i {
      margin-right: 5px;
    }
  }
  
  .condition-item {
    margin: 10px 0;
    
    .condition-count {
      color: #909399;
      font-size: 12px;
    }
    
    .el-progress {
      margin-top: 5px;
    }
  }
}

.dialog-footer {
  text-align: right;
}

::v-deep(.el-table .success-row) {
  background: #f0f9eb;
}

::v-deep(.el-table .warning-row) {
  background: #fdf6ec;
}

::v-deep(.el-table .info-row) {
  background: #f4f4f5;
}
</style>