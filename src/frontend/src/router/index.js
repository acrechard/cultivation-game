import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/character',
    name: 'Character',
    component: () => import('../views/CharacterView.vue')
  },
  {
    path: '/cultivation',
    name: 'Cultivation',
    component: () => import('../views/CultivationView.vue')
  },
  {
    path: '/battle',
    name: 'Battle',
    component: () => import('../views/BattleView.vue')
  },
  {
    path: '/exploration',
    name: 'Exploration',
    component: () => import('../views/ExplorationView.vue')
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/InventoryView.vue')
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/TasksView.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/TestView.vue')
  },
  {
    path: '/breakthrough',
    name: 'Breakthrough',
    component: () => import('../views/BreakthroughView.vue')
  },
  {
    path: '/alchemy',
    name: 'Alchemy',
    component: () => import('../views/AlchemyView.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/AuthView.vue')
  },
  {
    path: '/create-character',
    name: 'CreateCharacter',
    component: () => import('../views/CreateCharacterView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 导航守卫
router.beforeEach(async (to, from, next) => {
  // 需要认证的页面
  const requiresAuth = [
    '/', 
    '/character', 
    '/cultivation', 
    '/battle', 
    '/exploration', 
    '/inventory', 
    '/tasks', 
    '/breakthrough',
    '/create-character'
  ];
  
  // 不需要认证的页面
  const noAuthRequired = ['/auth', '/test'];
  
  // 检查是否需要认证
  if (requiresAuth.includes(to.path) && !noAuthRequired.includes(to.path)) {
    // 尝试从localStorage获取token
    const token = localStorage.getItem('token');
    
    if (!token) {
      // 没有token，重定向到登录页
      next('/auth');
      return;
    }
    
    // 检查是否已创建角色
    const characterId = localStorage.getItem('characterId');
    
    // 如果访问主页或其他游戏页面但没有角色ID，重定向到角色创建页面
    if (!characterId && to.path !== '/create-character' && to.path !== '/auth') {
      next('/create-character');
      return;
    }
    
    // 如果用户已登录且有角色ID，但试图访问创建角色页面，则重定向到主页
    if (characterId && to.path === '/create-character') {
      next('/');
      return;
    }
  }
  
  next();
});

export default router;