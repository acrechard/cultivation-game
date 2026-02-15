const express = require('express');
const router = express.Router();
const Breakthrough = require('../models/Breakthrough');
const UserState = require('../models/UserState');
const auth = require('../middleware/auth');

// 获取突破条件
router.get('/conditions/:realm/:level', auth, async (req, res) => {
  try {
    const { realm, level } = req.params;
    
    // 根据境界和层级返回突破条件
    let conditions = {};
    
    // 不同境界有不同的突破条件
    if (realm === '炼气期' && level == 9) {
      conditions = {
        requiredExp: 1000,
        requiredItems: [
          { name: '聚气丹', quantity: 3 },
          { name: '灵石', quantity: 10 }
        ],
        successRate: 0.7,
        description: '炼气期圆满，准备筑基'
      };
    } else if (realm === '筑基期' && level == 9) {
      conditions = {
        requiredExp: 5000,
        requiredItems: [
          { name: '筑基丹', quantity: 5 },
          { name: '千年灵芝', quantity: 1 },
          { name: '灵石', quantity: 50 }
        ],
        successRate: 0.5,
        description: '筑基期圆满，准备结丹'
      };
    } else {
      conditions = {
        requiredExp: 100,
        requiredItems: [],
        successRate: 0.9,
        description: '常规升级'
      };
    }
    
    res.json(conditions);
  } catch (error) {
    console.error('获取突破条件错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 尝试突破
router.post('/attempt', auth, async (req, res) => {
  try {
    const { currentRealm, realmLevel } = req.body;
    
    // 获取用户当前状态
    let userState = await UserState.findOne({ userId: req.user.userId });
    if (!userState) {
      return res.status(404).json({ message: '用户状态未找到' });
    }
    
    // 检查是否满足突破条件
    let canAttempt = false;
    let conditions = {};
    
    if (currentRealm === '炼气期' && realmLevel == 9) {
      conditions = {
        requiredExp: 1000,
        requiredItems: [
          { name: '聚气丹', quantity: 3 },
          { name: '灵石', quantity: 10 }
        ],
        successRate: 0.7
      };
      
      // 检查经验值
      if (userState.cultivation.cultivationExp >= conditions.requiredExp) {
        // 检查物品
        let hasRequiredItems = true;
        for (let item of conditions.requiredItems) {
          const inventoryItem = userState.inventory.items.find(i => i.name === item.name);
          if (!inventoryItem || inventoryItem.quantity < item.quantity) {
            hasRequiredItems = false;
            break;
          }
        }
        
        if (hasRequiredItems) {
          canAttempt = true;
        }
      }
    } else if (currentRealm === '筑基期' && realmLevel == 9) {
      conditions = {
        requiredExp: 5000,
        requiredItems: [
          { name: '筑基丹', quantity: 5 },
          { name: '千年灵芝', quantity: 1 },
          { name: '灵石', quantity: 50 }
        ],
        successRate: 0.5
      };
      
      if (userState.cultivation.cultivationExp >= conditions.requiredExp) {
        let hasRequiredItems = true;
        for (let item of conditions.requiredItems) {
          const inventoryItem = userState.inventory.items.find(i => i.name === item.name);
          if (!inventoryItem || inventoryItem.quantity < item.quantity) {
            hasRequiredItems = false;
            break;
          }
        }
        
        if (hasRequiredItems) {
          canAttempt = true;
        }
      }
    } else if (realmLevel % 10 === 0) {
      // 每10层一个小突破
      conditions = {
        requiredExp: 100,
        requiredItems: [],
        successRate: 0.9
      };
      
      if (userState.cultivation.cultivationExp >= conditions.requiredExp) {
        canAttempt = true;
      }
    }
    
    if (!canAttempt) {
      return res.status(400).json({ 
        success: false, 
        message: '不满足突破条件',
        conditions: conditions
      });
    }
    
    // 执行突破尝试
    const isSuccess = Math.random() < conditions.successRate;
    
    // 记录突破尝试
    const breakthroughRecord = new Breakthrough({
      userId: req.user.userId,
      currentRealm,
      targetRealm: getNextRealm(currentRealm),
      realmLevel,
      success: isSuccess,
      requiredItems: conditions.requiredItems
    });
    
    await breakthroughRecord.save();
    
    if (isSuccess) {
      // 突破成功，更新用户状态
      if (realmLevel % 10 === 0) {
        // 大境界突破
        userState.cultivation.realm = getNextRealm(currentRealm);
        userState.cultivation.realmLevel = 1;
        userState.cultivation.cultivationExp = 0;
        userState.cultivation.cultivationExpToNext = 100;
      } else {
        // 小层次提升
        userState.cultivation.realmLevel += 1;
      }
      
      // 消耗突破物品
      for (let item of conditions.requiredItems) {
        const inventoryItem = userState.inventory.items.find(i => i.name === item.name);
        if (inventoryItem) {
          inventoryItem.quantity -= item.quantity;
          if (inventoryItem.quantity <= 0) {
            userState.inventory.items = userState.inventory.items.filter(i => i.name !== item.name);
          }
        }
      }
      
      // 添加突破奖励
      userState.gameState.gold += Math.floor(Math.random() * 100) + 50; // 随机50-150灵石
      
      await userState.save();
      
      res.json({
        success: true,
        message: `恭喜突破至${getNextRealm(currentRealm)}！`,
        newState: userState.cultivation,
        rewards: {
          gold: Math.floor(Math.random() * 100) + 50
        }
      });
    } else {
      // 突破失败，扣除部分修为
      userState.cultivation.cultivationExp = Math.floor(userState.cultivation.cultivationExp * 0.8);
      await userState.save();
      
      res.json({
        success: false,
        message: '突破失败，修为有所损耗',
        newState: userState.cultivation
      });
    }
  } catch (error) {
    console.error('突破尝试错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户突破历史
router.get('/history', auth, async (req, res) => {
  try {
    const breakthroughs = await Breakthrough.find({ userId: req.user.userId })
      .sort({ breakthroughDate: -1 })
      .limit(20);
    
    res.json(breakthroughs);
  } catch (error) {
    console.error('获取突破历史错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 辅助函数：获取下一境界
function getNextRealm(currentRealm) {
  const realms = ['炼气期', '筑基期', '金丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期'];
  const currentIndex = realms.indexOf(currentRealm);
  
  if (currentIndex !== -1 && currentIndex < realms.length - 1) {
    return realms[currentIndex + 1];
  }
  
  return currentRealm; // 如果已经是最高境界，则返回当前境界
}

module.exports = router;