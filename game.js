const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawField();
}

function drawField() {
    // Fill Green
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw White Markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 4;

    const margin = 40;
    const w = canvas.width - (margin * 2);
    const h = canvas.height - (margin * 2);

    // Outer box
    ctx.strokeRect(margin, margin, w, h);

    // Halfway line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, margin);
    ctx.lineTo(canvas.width / 2, h + margin);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
    ctx.stroke();
}



// THE COORDINATE FIX: Maps mouse directly to canvas pixels
function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function startDrawing(e) {
    drawing = true;
    const { x, y } = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!drawing) return;
    const { x, y } = getPointerPos(e);

    ctx.lineWidth = mode === 'erase' ? 40 : 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Smooth the line
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

// Global UI Functions
window.setMode = (m) => mode = m;
window.setColor = (c) => { color = c; mode = 'draw'; };
window.clearBoard = () => drawField();

// Mouse Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

// Touch Support (Critical for Mobile Discord)
canvas.addEventListener('touchstart', (e) => { 
    startDrawing(e); 
    e.preventDefault(); 
}, { passive: false });

canvas.addEventListener('touchmove', (e) => { 
    draw(e); 
    e.preventDefault(); 
}, { passive: false });

canvas.addEventListener('touchend', stopDrawing);

// Final Initialization
window.addEventListener('resize', init);
init();