const canvas = document.getElementById('tacticBoard');
const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false improves performance

let isDrawing = false;
let currentMode = 'draw';
let currentColor = '#ffffff';

// 1. Initialize Canvas Size
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawPitchBase();
}

// 2. Draw the Football Pitch Layout
function drawPitchBase() {
    // Fill background
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 4;

    // Outer box
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Halfway line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 40);
    ctx.lineTo(canvas.width / 2, canvas.height - 40);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty Areas
    ctx.strokeRect(40, canvas.height / 2 - 100, 120, 200); // Left
    ctx.strokeRect(canvas.width - 160, canvas.height / 2 - 100, 120, 200); // Right
}



// 3. Drawing Logic
function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    // Get correct coordinates for Mouse or Touch
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineWidth = currentMode === 'erase' ? 40 : 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentMode === 'erase' ? '#2e7d32' : currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 4. Tool Controls
window.setMode = (mode) => { currentMode = mode; };
window.setColor = (color) => { 
    currentColor = color; 
    currentMode = 'draw'; 
};
window.clearBoard = () => { drawPitchBase(); };

// 5. Event Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

// Touch Support (Discord Mobile)
canvas.addEventListener('touchstart', (e) => { startDrawing(e); e.preventDefault(); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { draw(e); e.preventDefault(); }, { passive: false });
window.addEventListener('touchend', stopDrawing);

// Resize handling
window.addEventListener('resize', initCanvas);

// 6. Force start
window.onload = initCanvas;