// 临时调试文件
const express = require('express');
const router = express.Router();

console.log('Attempting to import auth middleware...');
try {
  const auth = require('../middleware/auth');
  console.log('auth object:', auth);
  console.log('authenticateToken property:', auth.authenticateToken);
  console.log('typeof authenticateToken:', typeof auth.authenticateToken);
} catch (error) {
  console.error('Error importing auth:', error.message);
  process.exit(1);
}

const authenticateToken = auth.authenticateToken;

console.log('Testing route definition...');

try {
  // 测试路由定义
  router.get('/', authenticateToken, (req, res) => {
    res.json({ test: 'success' });
  });
  console.log('Route defined successfully!');
} catch (error) {
  console.error('Error defining route:', error.message);
  console.error('Error stack:', error.stack);
}

module.exports = router;