const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// 获取背包内容
router.get('/', authenticateToken, async (req, res) => {
  try {
    // 模拟返回背包内容
    const inventory = {
      items: [
        {
          id: '1',
          name: '回春丹',
          description: '恢复50点生命值',
          type: 'consumable',
          quantity: 5,
          effect: {
            type: 'health',
            value: 50
          }
        },
        {
          id: '2',
          name: '聚气丹',
          description: '恢复30点灵力值',
          type: 'consumable',
          quantity: 3,
          effect: {
            type: 'mana',
            value: 30
          }
        },
        {
          id: '3',
          name: '铁剑',
          description: '普通的铁剑',
          type: 'weapon',
          quantity: 1,
          attributes: {
            attack: 10
          }
        }
      ],
      maxSize: 50,
      currentSize: 9
    };

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: '获取背包内容失败', details: error.message });
  }
});

// 使用物品
router.post('/use/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { characterId } = req.body;

    // 模拟使用物品
    const usage = {
      itemId,
      characterId,
      success: true,
      result: {
        message: '物品使用成功',
        effects: [
          {
            type: 'health',
            value: 50
          }
        ]
      }
    };

    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: '使用物品失败', details: error.message });
  }
});

// 装备物品
router.post('/equip/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { characterId } = req.body;

    // 模拟装备物品
    const equip = {
      itemId,
      characterId,
      success: true,
      message: '装备成功'
    };

    res.json(equip);
  } catch (error) {
    res.status(500).json({ error: '装备物品失败', details: error.message });
  }
});

// 卸下装备
router.post('/unequip/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { characterId } = req.body;

    // 模拟卸下装备
    const unequip = {
      itemId,
      characterId,
      success: true,
      message: '卸下装备成功'
    };

    res.json(unequip);
  } catch (error) {
    res.status(500).json({ error: '卸下装备失败', details: error.message });
  }
});

// 丢弃物品
router.delete('/drop/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // 模拟丢弃物品
    const drop = {
      itemId,
      quantity: quantity || 1,
      success: true,
      message: '物品已丢弃'
    };

    res.json(drop);
  } catch (error) {
    res.status(500).json({ error: '丢弃物品失败', details: error.message });
  }
});

// 获取装备信息
router.get('/equipment/:characterId', authenticateToken, async (req, res) => {
  try {
    const { characterId } = req.params;

    // 模拟返回装备信息
    const equipment = {
      characterId,
      weapon: {
        id: '3',
        name: '铁剑',
        type: 'weapon',
        attributes: {
          attack: 10
        }
      },
      armor: null,
      accessory: null
    };

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: '获取装备信息失败', details: error.message });
  }
});

module.exports = router;