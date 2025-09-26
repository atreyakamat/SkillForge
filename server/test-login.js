// Simple test script to check if the backend login is working
import https from 'https';
import http from 'http';

// Test health endpoint first
function testHealth() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Health check:', res.statusCode, data);
        resolve(data);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Health check failed:', err.message);
      reject(err);
    });
    
    req.end();
  });
}

// Test registration
function testRegister() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      role: 'Developer'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Registration test:', res.statusCode, data);
        resolve(data);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Registration failed:', err.message);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test login
function testLogin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'test@example.com',
      password: 'TestPassword123!'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Login test:', res.statusCode, data);
        resolve(data);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Login failed:', err.message);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🚀 Starting backend API tests...\n');
  
  try {
    await testHealth();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testRegister();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await testLogin();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.log('\n❌ Tests failed:', error.message);
  }
}

runTests();