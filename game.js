const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

// Create a second "virtual" canvas to store your drawings
const offscreen = document.createElement('canvas');
const oCtx = offscreen.getContext('2d');

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

function init() {
    canvas.width = offscreen.width = window.innerWidth;
    canvas.height = offscreen.height = window.innerHeight;
    
    // Draw the initial field on the OFFSCREEN canvas
    drawPitch(oCtx);
}

function drawPitch(context) {
    context.fillStyle = '#2e7d32'; // Green
    context.fillRect(0, 0, offscreen.width, offscreen.height);

    context.strokeStyle = 'rgba(255,255,255,0.5)';
    context.lineWidth = 4;
    
    // Field boundary
    const m = 50;
    context.strokeRect(m, m, offscreen.width - m*2, offscreen.height - m*2);
    
    // Center line and circle
    context.beginPath();
    context.moveTo(offscreen.width/2, m);
    context.lineTo(offscreen.width/2, offscreen.height - m);
    context.stroke();
    
    context.beginPath();
    context.arc(offscreen.width/2, offscreen.height/2, 60, 0, Math.PI*2);
    context.stroke();
}


// Drawing interactions happen on the OFFSCREEN canvas
function handleMove(e) {
    if (!drawing) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);

    oCtx.lineWidth = mode === 'erase' ? 40 : 6;
    oCtx.lineCap = 'round';
    oCtx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    oCtx.lineTo(x, y);
    oCtx.stroke();
    oCtx.beginPath();
    oCtx.moveTo(x, y);
}

// THE ENGINE: This runs 60 times a second to keep Discord's video buffer alive
function renderLoop() {
    // Copy the offscreen canvas to the visible one
    ctx.drawImage(offscreen, 0, 0);
    requestAnimationFrame(renderLoop);
}

// Global functions
window.setMode = (m) => mode = m;
window.setColor = (c) => { color = c; mode = 'draw'; };
window.clearBoard = () => drawPitch(oCtx);

canvas.addEventListener('mousedown', (e) => { drawing = true; oCtx.beginPath(); });
window.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', handleMove);

// Touch support
canvas.addEventListener('touchstart', (e) => { drawing = true; oCtx.beginPath(); e.preventDefault(); }, {passive:false});
canvas.addEventListener('touchmove', (e) => { handleMove(e); e.preventDefault(); }, {passive:false});

window.addEventListener('resize', init);
init();
renderLoop(); // Start the force-active loop