# Get the process named 'node' (if it exists)
$process = Get-Process -Name "node" -ErrorAction SilentlyContinue

# Check if the process exists
if ($process) {
    # Stop the 'node' process
    Stop-Process -Name "node"
    Write-Output "Process 'node' was running and has been terminated."
} else {
    Write-Output "Process 'node' is not running."
}

# Change directory to the server folder
cd "C:\Users\saimu\OneDrive\Desktop\empstlgbm\empstlgbm\server"

# Start the npm server
npm start

