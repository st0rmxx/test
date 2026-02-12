const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d', { desynchronized: true }); // Tells Discord to skip some security checks for speed

// Hidden canvas to store your actual drawings
const buffer = document.createElement('canvas');
const bCtx = buffer.getContext('2d');

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

function resize() {
    canvas.width = buffer.width = window.innerWidth;
    canvas.height = buffer.height = window.innerHeight;
    clearBoard(); 
}

function clearBoard() {
    // Fill the hidden buffer with Green
    bCtx.fillStyle = '#2e7d32';
    bCtx.fillRect(0, 0, buffer.width, buffer.height);
    
    // Draw the pitch lines on the hidden buffer
    bCtx.strokeStyle = 'rgba(255,255,255,0.5)';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(50, 50, buffer.width - 100, buffer.height - 100);
    
    bCtx.beginPath();
    bCtx.moveTo(buffer.width/2, 50);
    bCtx.lineTo(buffer.width/2, buffer.height - 50);
    bCtx.stroke();

    bCtx.beginPath();
    bCtx.arc(buffer.width/2, buffer.height/2, 60, 0, Math.PI*2);
    bCtx.stroke();
}



function draw(e) {
    if (!drawing) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);

    bCtx.lineWidth = mode === 'erase' ? 40 : 6;
    bCtx.lineCap = 'round';
    bCtx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    bCtx.lineTo(x, y);
    bCtx.stroke();
    bCtx.beginPath();
    bCtx.moveTo(x, y);
}

// THE DISCORD FIX: This loop runs 60 times a second
function loop() {
    // Constantly copy the hidden green field to the visible screen
    ctx.drawImage(buffer, 0, 0);
    requestAnimationFrame(loop);
}

// Interaction Listeners
canvas.addEventListener('mousedown', (e) => { drawing = true; bCtx.beginPath(); });
window.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

// Mobile Support for Discord App
canvas.addEventListener('touchstart', (e) => { drawing = true; bCtx.beginPath(); e.preventDefault(); }, {passive:false});
canvas.addEventListener('touchmove', (e) => { draw(e); e.preventDefault(); }, {passive:false});

window.addEventListener('resize', resize);
resize();
loop(); // Start the engine