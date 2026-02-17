$intervalSeconds = 10
Write-Host "Auto-sync started to https://github.com/dineshrk2005/Ai_Mental_Health_Chatbot.git" -ForegroundColor Cyan
Write-Host "Checking for changes every $intervalSeconds seconds... (Press Ctrl+C to stop)" -ForegroundColor Cyan

while ($true) {
    # Check for changes (modified, added, deleted, etc.)
    # We use Invoke-Expression to handle potential encoding issues or complex output better, 
    # but strictly assignment is fine here.
    $changes = git status --porcelain
    
    if ($changes) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "[$timestamp] Changes detected. Syncing..." -ForegroundColor Yellow
        
        # Add all changes
        git add .
        
        # Commit
        git commit -m "Auto-update: $timestamp" | Out-Null
        
        # Push
        Write-Host "Pushing to remote..."
        git push origin main
        
        if ($?) {
            Write-Host "[$timestamp] Successfully synced to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "[$timestamp] Git push failed. Will try again next cycle." -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds $intervalSeconds
}
