// Frontend Form Debug Test
console.log('🐛 Frontend Form Debug Test Starting...');

// Test if we can reach the backend directly
async function testDirectAPI() {
  console.log('🔗 Testing direct API call...');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Direct Test User',
        email: 'direct.test@skillforge.com',
        password: 'TestPassword123!',
        role: 'Developer'
      })
    });
    
    console.log('✅ Direct API Status:', response.status);
    const data = await response.json();
    console.log('✅ Direct API Response:', data);
    
  } catch (error) {
    console.error('❌ Direct API Error:', error);
  }
}

// Test axios configuration 
async function testAxiosConfig() {
  console.log('⚙️ Testing axios configuration...');
  
  try {
    // Import axios and test the same configuration
    const axios = (await import('axios')).default;
    
    const BASE_URL = 'http://localhost:5000/api';
    console.log('🎯 Base URL:', BASE_URL);
    
    const instance = axios.create({ 
      baseURL: BASE_URL, 
      withCredentials: false, 
      timeout: 20000 
    });
    
    // Add the same interceptors
    instance.interceptors.request.use((config) => {
      console.log('📤 Axios Request:', config.method?.toUpperCase(), config.url, config.data);
      return config;
    });
    
    instance.interceptors.response.use(
      (response) => {
        console.log('📥 Axios Response:', response.status, response.config.url, response.data);
        return response;
      },
      (error) => {
        console.error('📥 Axios Error:', error.response?.status, error.config?.url, error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
    
    const { data } = await instance.post('/auth/register', {
      name: 'Axios Test User',
      email: 'axios.test@skillforge.com', 
      password: 'TestPassword123!',
      role: 'Developer'
    });
    
    console.log('✅ Axios test successful:', data);
    
  } catch (error) {
    console.error('❌ Axios test failed:', error.response?.data || error.message);
  }
}

// Run both tests
async function runDebugTests() {
  await testDirectAPI();
  console.log('\n---\n');
  await testAxiosConfig();
}

runDebugTests();