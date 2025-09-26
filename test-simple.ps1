$headers = @{ 'Content-Type' = 'application/json' }
$testUser = @{
    name = 'Test User Registration'
    email = "test$(Get-Date -Format 'yyyyMMddHHmmssfff')@example.com"
    password = 'TestPassword123!'
    role = 'Developer'
} | ConvertTo-Json

Write-Host "Testing Registration API directly..."
Write-Host "Test data: $testUser"

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' -Method Post -Headers $headers -Body $testUser -TimeoutSec 15
    Write-Host "SUCCESS! Registration worked!"
    Write-Host "User created: $($response.user | ConvertTo-Json -Depth 2)"
    Write-Host "Tokens received: Access=$($response.tokens.access -ne $null), Refresh=$($response.tokens.refresh -ne $null)"
} catch {
    Write-Host "FAILED! Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()  
        Write-Host "Error details: $errorBody"
    }
}