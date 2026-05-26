Write-Host "Setting up Git repository for Blockchain Education Website..."

# Ensure you have Git installed and added to PATH.
# Initialize repository
if (-not (Test-Path .git)) {
    git init
    Write-Host "Initialized empty Git repository."
}

# Add all files
git add .

# Commit (replace the message if desired)
$commitMessage = "Initial commit of blockchain education website"
git commit -m $commitMessage

# Create remote repository via GitHub API (requires a personal access token with repo scope)
$token = "YOUR_GITHUB_TOKEN_HERE"
$repoName = "blockchain-education-website"
$owner = "chiranjeevisaikapuluru-collab"
$apiUrl = "https://api.github.com/user/repos"
$payload = @{
    name = $repoName
    private = $false
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post -Uri $apiUrl -Headers @{ Authorization = "token $token" } -Body $payload -ContentType "application/json"
if ($response.clone_url) {
    Write-Host "Repository created: $($response.html_url)"
    # Set remote and push
    git remote add origin $response.clone_url
    git branch -M main
    git push -u origin main
} else {
    Write-Error "Failed to create repository via GitHub API. Check your token and permissions."
}
