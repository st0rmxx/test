const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d', { alpha: false });

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

function syncAndDraw() {
    // FORCE internal resolution to match screen size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Background
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // DRAW THE PITCH
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 4;
    
    // Calculate field based on center-point to ensure visibility
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fieldW = canvas.width * 0.9;
    const fieldH = canvas.height * 0.85;

    // Main Boundary (Centered)
    ctx.strokeRect(centerX - (fieldW/2), centerY - (fieldH/2), fieldW, fieldH);
    
    // Halfway Line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - (fieldH/2));
    ctx.lineTo(centerX, centerY + (fieldH/2));
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.min(fieldW, fieldH) * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Goal Boxes (Left & Right)
    ctx.strokeRect(centerX - (fieldW/2), centerY - 100, fieldW * 0.1, 200);
    ctx.strokeRect(centerX + (fieldW/2) - (fieldW * 0.1), centerY - 100, fieldW * 0.1, 200);
}



// Drawing Logic with Offset Correction
function getMouse(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    return { x, y };
}

canvas.addEventListener('mousedown', (e) => { 
    drawing = true; 
    const { x, y } = getMouse(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
});

window.addEventListener('mouseup', () => { drawing = false; });

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const { x, y } = getMouse(e);
    
    ctx.lineWidth = mode === 'erase' ? 40 : 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
});

// UI Controls
window.setMode = (m) => mode = m;
window.setColor = (c) => { color = c; mode = 'draw'; };
window.clearBoard = () => syncAndDraw();

// The "Discord expansion" safety net
window.addEventListener('resize', syncAndDraw);
// Run multiple times as Discord loads
syncAndDraw();
setTimeout(syncAndDraw, 100);
setTimeout(syncAndDraw, 1000);

// Touch Support for Mobile Discord
canvas.addEventListener('touchstart', (e) => { 
    drawing = true; 
    const { x, y } = getMouse(e);
    ctx.beginPath(); ctx.moveTo(x, y);
    e.preventDefault(); 
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    if (!drawing) return;
    const { x, y } = getMouse(e);
    ctx.lineTo(x, y); ctx.stroke();
    e.preventDefault();
}, {passive: false});