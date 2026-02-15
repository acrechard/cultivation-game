// 初始化炼丹配方数据
const Recipe = require('../models/Recipe');

const initializeRecipes = async () => {
  try {
    // 检查是否已经有配方数据
    const count = await Recipe.countDocuments();
    
    if (count > 0) {
      console.log('配方数据已存在，跳过初始化');
      return;
    }
    
    // 创建示例配方
    const sampleRecipes = [
      {
        _id: 'recipe_juqi_001',
        name: '聚气丹',
        type: '修炼丹药',
        requiredRealm: '炼气期',
        requiredRealmLevel: 1,
        ingredients: [
          { materialId: 'yaocai_001', quantity: 2 }, // 千年灵药
          { materialId: 'kuangshi_001', quantity: 1 } // 寒铁矿石
        ],
        result: {
          potionName: '聚气丹',
          baseQuantity: 1,
          successRate: 80
        },
        description: '提升修炼效率的初级丹药',
        effect: {
          description: '修炼速度提升20%',
          duration: 2, // 2小时
          attributes: {},
          cultivationBonus: {
            speed: 20,
            successRate: 0
          },
          healthBonus: 0
        }
      },
      {
        _id: 'recipe_zhuj_001',
        name: '筑基丹',
        type: '突破丹药',
        requiredRealm: '炼气期',
        requiredRealmLevel: 9,
        ingredients: [
          { materialId: 'yaocai_002', quantity: 3 }, // 九转仙草
          { materialId: 'yaoshou_001', quantity: 2 }, // 一级妖兽内丹
          { materialId: 'yaocai_003', quantity: 1 } // 玄冰花
        ],
        result: {
          potionName: '筑基丹',
          baseQuantity: 1,
          successRate: 60
        },
        description: '助人突破至筑基期的神丹',
        effect: {
          description: '突破成功率提升50%',
          duration: -1, // 永久效果
          attributes: {},
          cultivationBonus: {
            speed: 0,
            successRate: 50
          },
          healthBonus: 10
        }
      },
      {
        _id: 'recipe_xisui_001',
        name: '洗髓丹',
        type: '增益丹药',
        requiredRealm: '炼气期',
        requiredRealmLevel: 5,
        ingredients: [
          { materialId: 'yaocai_002', quantity: 2 }, // 九转仙草
          { materialId: 'kuangshi_002', quantity: 1 } // 天外陨铁
        ],
        result: {
          potionName: '洗髓丹',
          baseQuantity: 1,
          successRate: 70
        },
        description: '改善修仙资质的奇丹',
        effect: {
          description: '根骨资质永久提升',
          duration: -1, // 永久效果
          attributes: {
            constitution: 5,
            intelligence: 5,
            physique: 5,
            soulForce: 5
          },
          cultivationBonus: {
            speed: 0,
            successRate: 0
          },
          healthBonus: 20
        }
      }
    ];
    
    for (const recipe of sampleRecipes) {
      await Recipe.create(recipe);
    }
    
    console.log('示例配方数据初始化完成');
  } catch (error) {
    console.error('初始化配方数据失败:', error);
  }
};

module.exports = initializeRecipes;