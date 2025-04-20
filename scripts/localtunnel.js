const { spawn } = require('child_process');
const localtunnel = require('localtunnel');

// Start Next.js development server
const nextDev = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

// Handle Next.js server process
nextDev.on('error', (error) => {
  console.error(`Failed to start Next.js server: ${error}`);
  process.exit(1);
});

// Function to start localtunnel
async function startTunnel() {
  try {
    // Wait a bit for Next.js to start (adjust if needed)
    console.log('Waiting for Next.js server to start...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Update the port to match your Next.js server
    // Based on the terminal output, Next.js is using port 3000
    let port = 3000; // Changed to 3000 based on Next.js output
    
    console.log(`Attempting to create tunnel to port ${port}...`);
    
    // Start localtunnel to the appropriate port
    const tunnel = await localtunnel({ port: port });
    
    console.log('\n\n=================================================');
    console.log(`🚀 Your temporary domain is ready: ${tunnel.url}`);
    console.log('=================================================\n');
    console.log('This URL will be active as long as this process is running.');
    console.log('Press Ctrl+C to stop the server and close the tunnel.\n');
    
    tunnel.on('close', () => {
      console.log('Tunnel closed');
      process.exit(0);
    });
  } catch (error) {
    console.error(`Failed to start tunnel: ${error}`);
    process.exit(1);
  }
}

// Start the tunnel
startTunnel();

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nShutting down server and tunnel...');
  process.exit(0);
});