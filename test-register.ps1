$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    name = "Test User"
    email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "TestPassword123!"
    role = "Developer"
} | ConvertTo-Json

Write-Host "🧪 Testing registration API with PowerShell..."
Write-Host "📤 Request body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Headers $headers -Body $body -TimeoutSec 10
    Write-Host "✅ Registration successful!"
    Write-Host "👤 User: $($response.user | ConvertTo-Json)"
    Write-Host "🔑 Tokens: $($response.tokens | ConvertTo-Json)"
}
catch {
    Write-Host "❌ Registration failed!"
    Write-Host "🚨 Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "📋 Response: $responseBody"
    }
}