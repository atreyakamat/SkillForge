# PowerShell Test for SkillForge Registration and Login APIs

Write-Host "🧪 SkillForge Frontend-Backend Validation Test" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Test registration endpoint
Write-Host "`n📝 Testing Registration API..." -ForegroundColor Yellow

$registrationData = @{
    name = "PowerShell Test User"
    email = "powershell.test@skillforge.com"
    password = "TestPassword123!"
    role = "Developer"
} | ConvertTo-Json

try {
    $registrationResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $registrationData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "Response: $($registrationResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Green
    
    $accessToken = $registrationResponse.tokens.access
    Write-Host "🔑 Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Registration failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    $accessToken = $null
}

# Test login endpoint  
Write-Host "`n🔐 Testing Login API..." -ForegroundColor Yellow

$loginData = @{
    email = "powershell.test@skillforge.com"
    password = "TestPassword123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Response: $($loginResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Login failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Test protected endpoint if we have a token
if ($accessToken) {
    Write-Host "`n🔐 Testing Protected Endpoint..." -ForegroundColor Yellow
    
    try {
        $headers = @{
            "Authorization" = "Bearer $accessToken"
            "Content-Type" = "application/json"
        }
        
        $profileResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/user/profile" -Method GET -Headers $headers -TimeoutSec 10
        
        Write-Host "✅ Protected endpoint access successful!" -ForegroundColor Green
        Write-Host "Profile: $($profileResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Protected endpoint failed:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host "`n🏁 Test completed!" -ForegroundColor Cyan