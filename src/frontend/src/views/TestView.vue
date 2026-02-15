<template>
  <div class="test-page">
    <el-page-header @back="$router.go(-1)" content="测试页面"></el-page-header>
    
    <el-card style="margin: 20px;">
      <template #header>
        <span>组件测试</span>
      </template>
      
      <div>
        <h2>Element Plus 组件测试</h2>
        
        <!-- 测试按钮 -->
        <el-button type="primary" style="margin: 5px;">主要按钮</el-button>
        <el-button type="success" style="margin: 5px;">成功按钮</el-button>
        <el-button type="warning" style="margin: 5px;">警告按钮</el-button>
        <el-button type="danger" style="margin: 5px;">危险按钮</el-button>
        
        <!-- 测试输入框 -->
        <div style="margin: 15px 0;">
          <el-input placeholder="这是一个输入框测试" style="width: 300px;"></el-input>
        </div>
        
        <!-- 测试卡片 -->
        <el-card shadow="hover" style="margin: 15px 0; padding: 15px;">
          <div slot="header">这是卡片测试</div>
          如果能看到这个卡片，说明Element Plus组件库工作正常
        </el-card>
        
        <!-- 测试进度条 -->
        <div style="margin: 15px 0;">
          <el-progress :percentage="70" />
        </div>
        
        <!-- 测试标签 -->
        <div style="margin: 15px 0;">
          <el-tag type="success">成功</el-tag>
          <el-tag type="warning" style="margin-left: 10px;">警告</el-tag>
          <el-tag type="danger" style="margin-left: 10px;">危险</el-tag>
        </div>
        
        <!-- 测试表格 -->
        <div style="margin: 15px 0;">
          <el-table :data="[{name: '测试数据', value: 100}]" style="width: 100%;">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="value" label="数值" />
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TestView'
};
</script>

<style scoped>
.test-page {
  padding: 20px;
}
</style>