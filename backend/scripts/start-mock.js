// Script to launch mock server using ts-node
const { spawn } = require('child_process');
const path = require('path');

const mockPath = path.join(__dirname, '..', 'src', 'mock-server.ts');
console.log('[Dev] Starting Mock Server on port 4000...');

const child = spawn('npx', ['ts-node', mockPath], { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code || 0));
