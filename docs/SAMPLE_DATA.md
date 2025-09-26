# SkillForge - Sample Data for Frontend Testing

## 🔐 Authentication Test Data

### Test User Accounts

All test accounts use the same password pattern for consistency:

| **User Name** | **Email** | **Password** | **Role** | **Purpose** |
|---------------|-----------|--------------|----------|-------------|
| Frontend Test User | `frontend@example.com` | `Test123!@#` | user | Basic frontend testing |
| John Developer | `john@example.com` | `Dev123!@#` | user | Developer persona |
| Sarah Designer | `sarah@example.com` | `Design123!` | user | Designer persona |
| Mike Manager | `mike@example.com` | `Manage123!` | user | Manager persona |
| Lisa Analyst | `lisa@example.com` | `Analyze123!` | user | Analyst persona |

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter  
- Must contain number
- Must contain special character

---

## 🌐 API Endpoints for Frontend Integration

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### 1. User Registration
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "your.email@example.com", 
  "password": "YourPassword123!"
}

// Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id_here",
    "name": "Your Name",
    "email": "your.email@example.com",
    "role": "user",
    "skills": [],
    "careerGoals": []
  },
  "tokens": {
    "access": "jwt_access_token_here",
    "refresh": "jwt_refresh_token_here"
  }
}
```

#### 2. User Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "frontend@example.com",
  "password": "Test123!@#"
}

// Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "68d67b766597352d97551836",
    "name": "Frontend Test User",
    "email": "frontend@example.com",
    "role": "user",
    "skills": [],
    "careerGoals": []
  },
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "refresh": "1892e21166c21f02c999..."
  }
}
```

#### 3. Protected Route Test
```javascript
GET /api/auth/me
Authorization: Bearer <access_token>

// Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

## 🛠️ Frontend Integration Code Examples

### React/JavaScript Example

#### Login Function
```javascript
const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', data.tokens.access);
    localStorage.setItem('refreshToken', data.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

#### Register Function
```javascript
const registerUser = async (name, email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
```

#### Authenticated API Request Example
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`http://localhost:5000${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });

  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.clear();
    window.location.href = '/login';
    return;
  }

  return response.json();
};
```

---

## 🎯 Quick Test Commands (PowerShell)

### Test Registration
```powershell
$headers = @{'Content-Type' = 'application/json'}
$userData = @{ name = "Test User"; email = "test@example.com"; password = "Test123!@#" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' -Method POST -Headers $headers -Body $userData
```

### Test Login
```powershell
$loginData = @{ email = "frontend@example.com"; password = "Test123!@#" } | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -Headers $headers -Body $loginData
```

### Test Protected Route
```powershell
$authHeaders = @{'Authorization' = "Bearer $($loginResponse.tokens.access)"}
$profile = Invoke-RestMethod -Uri 'http://localhost:5000/api/users/profile' -Headers $authHeaders
```

---

## 🚀 Getting Started Checklist

### For Frontend Developers:

1. **✅ Server Running**: Ensure backend server is running on `http://localhost:5000`
2. **✅ CORS Configured**: Frontend (port 5173) can make requests to backend (port 5000)
3. **✅ Test Login**: Use any of the sample accounts above
4. **✅ Store Tokens**: Save JWT tokens in localStorage or secure storage
5. **✅ Handle Auth**: Add Authorization header to protected requests
6. **✅ Error Handling**: Handle 401 responses for expired tokens

### Quick Verification:
```bash
# 1. Check server is running
curl http://localhost:5000/

# 2. Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"frontend@example.com","password":"Test123!@#"}'
```

---

## 📋 Available API Systems

Once authenticated, you can access these systems:

- **Skills Management**: `/api/skills`
- **User Profile**: `/api/users/profile`
- **Job Matching**: `/api/jobs`
- **Analytics**: `/api/analytics`
- **Peer Reviews**: `/api/peer`
- **Reports**: `/api/reports`

All protected routes require the `Authorization: Bearer <token>` header.

---

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure frontend is running on port 5173 or update CORS_ORIGIN in `.env`
2. **Connection Refused**: Check if backend server is running on port 5000
3. **401 Unauthorized**: Token may be expired, try logging in again
4. **400 Bad Request**: Check request body format and required fields

### Server Status Check:
```powershell
# Check if server is running
netstat -ano | findstr :5000

# Start server if not running
cd c:\Projects\SkillForge\server
node server.js
```