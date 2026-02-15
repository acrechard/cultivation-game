const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// 模拟数据 - 在实际应用中，这些应该存储在数据库中
let explorationData = {};

// 获取探索相关信息
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  if (!explorationData[userId]) {
    explorationData[userId] = {
      currentLocation: 'village', // 默认位置
      visitedLocations: ['village'],
      explorationPoints: 0,
      lastExplorationTime: null
    };
  }
  
  res.json(explorationData[userId]);
});

// 更改当前位置
router.post('/location', authenticateToken, async (req, res) => {
  const { location } = req.body;
  const userId = req.user.userId;
  
  const validLocations = ['village', 'mountain', 'forest', 'city'];
  
  if (!validLocations.includes(location)) {
    return res.status(400).json({ error: '无效的位置' });
  }
  
  if (!explorationData[userId]) {
    explorationData[userId] = {
      currentLocation: 'village',
      visitedLocations: ['village'],
      explorationPoints: 0,
      lastExplorationTime: null
    };
  }
  
  explorationData[userId].currentLocation = location;
  
  // 如果是新访问的位置，加入已访问列表
  if (!explorationData[userId].visitedLocations.includes(location)) {
    explorationData[userId].visitedLocations.push(location);
  }
  
  res.json({
    message: `已移动到${getLocationName(location)}`,
    location: location
  });
});

// 探索当前区域
router.post('/explore', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const characterId = req.body.characterId; // 可选的角色ID
  
  if (!explorationData[userId]) {
    explorationData[userId] = {
      currentLocation: 'village',
      visitedLocations: ['village'],
      explorationPoints: 0,
      lastExplorationTime: null
    };
  }
  
  const currentLocation = explorationData[userId].currentLocation;
  const currentTime = new Date();
  
  // 检查上次探索时间，防止过于频繁的探索
  if (explorationData[userId].lastExplorationTime) {
    const timeDiff = (currentTime - new Date(explorationData[userId].lastExplorationTime)) / 1000; // 秒
    if (timeDiff < 5) { // 至少间隔5秒
      return res.status(429).json({ error: '探索过于频繁，请稍后再试' });
    }
  }
  
  // 根据不同位置生成不同的探索结果
  const explorationResults = generateExplorationResult(currentLocation);
  
  // 更新探索点数
  explorationData[userId].explorationPoints += 1;
  explorationData[userId].lastExplorationTime = currentTime.toISOString();
  
  res.json({
    message: `在${getLocationName(currentLocation)}探索`,
    location: currentLocation,
    results: explorationResults,
    explorationPoints: explorationData[userId].explorationPoints
  });
});

// 寻找机缘
router.post('/treasure', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  
  if (!explorationData[userId]) {
    return res.status(404).json({ error: '用户探索数据不存在' });
  }
  
  const currentLocation = explorationData[userId].currentLocation;
  const currentTime = new Date();
  
  // 检查上次寻宝时间
  if (explorationData[userId].lastTreasureTime) {
    const timeDiff = (currentTime - new Date(explorationData[userId].lastTreasureTime)) / 1000; // 秒
    if (timeDiff < 10) { // 寻宝间隔至少10秒
      return res.status(429).json({ error: '寻宝过于频繁，请稍后再试' });
    }
  }
  
  // 根据位置和运气计算寻宝结果
  const treasureResult = generateTreasureResult(currentLocation, userId);
  
  explorationData[userId].lastTreasureTime = currentTime.toISOString();
  
  res.json({
    message: `在${getLocationName(currentLocation)}寻找机缘`,
    location: currentLocation,
    treasure: treasureResult
  });
});

// 猎杀怪物
router.post('/hunt', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  
  if (!explorationData[userId]) {
    return res.status(404).json({ error: '用户探索数据不存在' });
  }
  
  const currentLocation = explorationData[userId].currentLocation;
  const currentTime = new Date();
  
  // 检查上次狩猎时间
  if (explorationData[userId].lastHuntTime) {
    const timeDiff = (currentTime - new Date(explorationData[userId].lastHuntTime)) / 1000; // 秒
    if (timeDiff < 8) { // 狩猎间隔至少8秒
      return res.status(429).json({ error: '狩猎过于频繁，请稍后再试' });
    }
  }
  
  // 生成狩猎结果
  const huntResult = generateHuntResult(currentLocation);
  
  explorationData[userId].lastHuntTime = currentTime.toISOString();
  
  res.json({
    message: `在${getLocationName(currentLocation)}猎杀怪物`,
    location: currentLocation,
    result: huntResult
  });
});

// 采集资源
router.post('/collect', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  
  if (!explorationData[userId]) {
    return res.status(404).json({ error: '用户探索数据不存在' });
  }
  
  const currentLocation = explorationData[userId].currentLocation;
  const currentTime = new Date();
  
  // 检查上次采集时间
  if (explorationData[userId].lastCollectTime) {
    const timeDiff = (currentTime - new Date(explorationData[userId].lastCollectTime)) / 1000; // 秒
    if (timeDiff < 6) { // 采集间隔至少6秒
      return res.status(429).json({ error: '采集过于频繁，请稍后再试' });
    }
  }
  
  // 生成采集结果
  const collectResult = generateCollectResult(currentLocation);
  
  explorationData[userId].lastCollectTime = currentTime.toISOString();
  
  res.json({
    message: `在${getLocationName(currentLocation)}采集资源`,
    location: currentLocation,
    result: collectResult
  });
});

// 获取位置名称
function getLocationName(locationKey) {
  const locationNames = {
    village: '新手村',
    mountain: '青云山脉',
    forest: '幽暗森林',
    city: '修仙城'
  };
  
  return locationNames[locationKey] || locationKey;
}

// 生成探索结果
function generateExplorationResult(location) {
  const locationEvents = {
    village: [
      { type: 'resource', message: '发现了一株普通草药', resource: { name: '普通草药', quantity: 1 } },
      { type: 'monster', message: '遇到了一只野兔', monster: '野兔' },
      { type: 'event', message: '遇到了一位老农，他告诉你一些有趣的故事' },
      { type: 'resource', message: '找到了一小堆灵石碎片', resource: { name: '灵石碎片', quantity: 2 } },
      { type: 'event', message: '发现了一个小洞穴，里面有些微弱的灵气' }
    ],
    mountain: [
      { type: 'resource', message: '采集到了一株灵芝', resource: { name: '灵芝', quantity: 1 } },
      { type: 'monster', message: '遭遇了一条毒蛇', monster: '毒蛇' },
      { type: 'resource', message: '挖到了一些低阶矿石', resource: { name: '低阶矿石', quantity: 1 } },
      { type: 'event', message: '发现了一个古老的石碑，上面刻着一些修炼心得' },
      { type: 'monster', message: '遇到了一头山猪', monster: '山猪' }
    ],
    forest: [
      { type: 'resource', message: '找到了珍贵的千年灵芝', resource: { name: '千年灵芝', quantity: 1 } },
      { type: 'monster', message: '遭遇了树妖', monster: '树妖' },
      { type: 'resource', message: '采集到了龙须草', resource: { name: '龙须草', quantity: 1 } },
      { type: 'event', message: '发现了一个隐秘的灵泉' },
      { type: 'monster', message: '遇到了一群毒虫', monster: '毒虫群' }
    ],
    city: [
      { type: 'event', message: '在茶馆听到了一些有趣的传闻' },
      { type: 'resource', message: '从商贩那里得到了一些修炼资料', resource: { name: '修炼资料', quantity: 1 } },
      { type: 'event', message: '遇到了一位前辈高人，指点你修炼' },
      { type: 'event', message: '参加了一场小型拍卖会' },
      { type: 'resource', message: '从书摊上淘到了一本古籍', resource: { name: '古籍', quantity: 1 } }
    ]
  };
  
  const events = locationEvents[location] || locationEvents.village;
  return events[Math.floor(Math.random() * events.length)];
}

// 生成寻宝结果
function generateTreasureResult(location, userId) {
  // 根据用户的探索点数增加寻宝成功率
  const explorationPoints = explorationData[userId]?.explorationPoints || 0;
  const successRate = Math.min(0.3 + (explorationPoints * 0.001), 0.8); // 最高80%成功率
  
  if (Math.random() > successRate) {
    return {
      success: false,
      message: '这次没有发现特别的机缘，继续努力探索吧！'
    };
  }
  
  const treasures = {
    village: [
      { name: '聚气丹', quantity: 1, type: 'item', rarity: 'common' },
      { name: '铁剑', quantity: 1, type: 'equipment', rarity: 'common' },
      { name: '灵石', quantity: 5, type: 'currency', rarity: 'common' },
      { name: '基础吐纳术', quantity: 1, type: 'technique', rarity: 'common' }
    ],
    mountain: [
      { name: '筑基丹', quantity: 1, type: 'item', rarity: 'uncommon' },
      { name: '青铜剑', quantity: 1, type: 'equipment', rarity: 'uncommon' },
      { name: '灵石', quantity: 10, type: 'currency', rarity: 'common' },
      { name: '基础剑法', quantity: 1, type: 'technique', rarity: 'uncommon' }
    ],
    forest: [
      { name: '结丹丹方', quantity: 1, type: 'recipe', rarity: 'rare' },
      { name: '精钢剑', quantity: 1, type: 'equipment', rarity: 'uncommon' },
      { name: '灵石', quantity: 20, type: 'currency', rarity: 'common' },
      { name: '高级疗伤丹', quantity: 2, type: 'item', rarity: 'uncommon' }
    ],
    city: [
      { name: '功法秘籍', quantity: 1, type: 'technique', rarity: 'rare' },
      { name: '法器', quantity: 1, type: 'equipment', rarity: 'rare' },
      { name: '灵石', quantity: 50, type: 'currency', rarity: 'common' },
      { name: '丹方大全', quantity: 1, type: 'recipe', rarity: 'epic' }
    ]
  };
  
  const availableTreasures = treasures[location] || treasures.village;
  const treasure = availableTreasures[Math.floor(Math.random() * availableTreasures.length)];
  
  return {
    success: true,
    message: `发现了宝藏: ${treasure.name} × ${treasure.quantity}`,
    treasure: treasure
  };
}

// 生成狩猎结果
function generateHuntResult(location) {
  const locationMonsters = {
    village: [
      { name: '野兔', exp: 5, items: [{ name: '兔肉', quantity: 1 }] },
      { name: '野狼', exp: 15, items: [{ name: '狼牙', quantity: 1 }, { name: '狼皮', quantity: 1 }] }
    ],
    mountain: [
      { name: '山猪', exp: 25, items: [{ name: '猪肉', quantity: 2 }, { name: '猪鬃', quantity: 1 }] },
      { name: '毒蛇', exp: 30, items: [{ name: '蛇胆', quantity: 1 }, { name: '蛇蜕', quantity: 1 }] }
    ],
    forest: [
      { name: '树妖', exp: 50, items: [{ name: '妖木', quantity: 2 }, { name: '灵叶', quantity: 1 }] },
      { name: '毒虫群', exp: 40, items: [{ name: '毒囊', quantity: 1 }, { name: '虫壳', quantity: 2 }] }
    ],
    city: [
      { name: '流浪修士', exp: 60, items: [{ name: '旧法袍', quantity: 1 }, { name: '残破功法', quantity: 1 }] }
    ]
  };
  
  const monsters = locationMonsters[location] || locationMonsters.village;
  const monster = monsters[Math.floor(Math.random() * monsters.length)];
  
  // 模拟战斗结果
  const win = Math.random() > 0.3; // 70%胜率
  
  if (win) {
    return {
      success: true,
      message: `成功击败了${monster.name}，获得了${monster.exp}经验值`,
      exp: monster.exp,
      items: monster.items
    };
  } else {
    return {
      success: false,
      message: `被${monster.name}击败，受了些轻伤，获得了${Math.floor(monster.exp/3)}经验值`,
      exp: Math.floor(monster.exp/3),
      items: []
    };
  }
}

// 生成采集结果
function generateCollectResult(location) {
  const locationResources = {
    village: [
      { name: '普通草药', quantity: Math.floor(Math.random() * 3) + 1 },
      { name: '普通木材', quantity: Math.floor(Math.random() * 2) + 1 },
      { name: '普通石材', quantity: Math.floor(Math.random() * 2) + 1 }
    ],
    mountain: [
      { name: '灵芝', quantity: Math.floor(Math.random() * 2) + 1 },
      { name: '何首乌', quantity: Math.floor(Math.random() * 2) + 1 },
      { name: '低阶矿石', quantity: Math.floor(Math.random() * 3) + 1 },
      { name: '山泉水', quantity: 1 }
    ],
    forest: [
      { name: '千年灵芝', quantity: 1 },
      { name: '龙须草', quantity: Math.floor(Math.random() * 2) + 1 },
      { name: '灵木', quantity: Math.floor(Math.random() * 2) + 1 },
      { name: '灵叶', quantity: Math.floor(Math.random() * 3) + 1 }
    ],
    city: [
      { name: '灵茶', quantity: 1 },
      { name: '香料', quantity: Math.floor(Math.random() * 2) + 1 },
      { name: '灵米', quantity: Math.floor(Math.random() * 3) + 1 }
    ]
  };
  
  const resources = locationResources[location] || locationResources.village;
  const resource = resources[Math.floor(Math.random() * resources.length)];
  
  return {
    success: true,
    message: `采集到了${resource.name} × ${resource.quantity}`,
    resource: resource
  };
}

module.exports = router;