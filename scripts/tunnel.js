const { spawn } = require('child_process');
const ngrok = require('ngrok');

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

// Function to start ngrok tunnel
async function startTunnel() {
  try {
    // Wait a bit for Next.js to start (adjust if needed)
    console.log('Waiting for Next.js server to start...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Determine which port Next.js is using
    // Next.js outputs the port in the console, but we'll use a default fallback
    // Port 3000 is the default, but Next.js will try 3001, 3002, etc. if 3000 is in use
    let port = 3033; // Based on the last output, Next.js is using port 3005
    
    console.log(`Attempting to create tunnel to port ${port}...`);
    
    // Initialize ngrok - this step is important
    try {
      await ngrok.kill(); // Kill any existing ngrok processes
      console.log('Starting ngrok service...');
    } catch (e) {
      console.log('No existing ngrok process to kill, continuing...');
    }
    
    // Start ngrok tunnel to the appropriate port
    const url = await ngrok.connect({
      addr: port,
      region: 'us', // Change to your preferred region if needed
    });
    
    console.log('\n\n=================================================');
    console.log(`🚀 Your temporary domain is ready: ${url}`);
    console.log('=================================================\n');
    console.log('This URL will be active as long as this process is running.');
    console.log('Press Ctrl+C to stop the server and close the tunnel.\n');
  } catch (error) {
    console.error(`Failed to start ngrok tunnel: ${error}`);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure ngrok is properly installed');
    console.log('2. Check if another instance of ngrok is already running');
    console.log('3. Try running "npx ngrok http 3003" in a separate terminal');
    process.exit(1);
  }
}

// Start the tunnel
startTunnel();

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nShutting down server and tunnel...');
  await ngrok.kill();
  process.exit(0);
});