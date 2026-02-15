// 测试API连接
async function testApiConnection() {
  try {
    console.log('正在测试API连接...');
    
    // 测试根路径
    const response = await fetch('http://localhost:3001/');
    const data = await response.json();
    
    console.log('API连接成功!');
    console.log('响应数据:', data);
    
    return true;
  } catch (error) {
    console.error('API连接失败:', error);
    return false;
  }
}

// 测试认证相关功能
async function testAuthFunctionality() {
  console.log('\n正在测试认证功能...');
  
  try {
    // 测试登录接口（使用无效凭据，预期返回错误）
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('登录测试结果:', loginResult);
    
    return true;
  } catch (error) {
    console.error('认证功能测试失败:', error);
    return false;
  }
}

// 运行测试
console.log('开始测试前后端交互...');
testApiConnection().then(success => {
  if (success) {
    testAuthFunctionality();
  }
});