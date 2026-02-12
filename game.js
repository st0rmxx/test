const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d', { alpha: false });

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

function resize() {
    // Force the canvas to the actual size of the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawField();
}

function drawField() {
    // Pitch Background
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Field Markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 4;
    
    const margin = 50;
    const w = canvas.width - (margin * 2);
    const h = canvas.height - (margin * 2);

    // Outer Boundary
    ctx.strokeRect(margin, margin, w, h);

    // Center Line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, margin);
    ctx.lineTo(canvas.width / 2, canvas.height - margin);
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
    ctx.stroke();
}


// Core Drawing Logic
function start(e) {
    drawing = true;
    draw(e);
}

function stop() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;

    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);

    ctx.lineWidth = mode === 'erase' ? 40 : 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Global UI Functions
window.setMode = (m) => mode = m;
window.setColor = (c) => { color = c; mode = 'draw'; };
window.clearBoard = () => drawField();

// Event Listeners
canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stop);

// Touch Support
canvas.addEventListener('touchstart', (e) => { start(e); e.preventDefault(); }, {passive: false});
canvas.addEventListener('touchmove', (e) => { draw(e); e.preventDefault(); }, {passive: false});

// The "Discord Fix": Resize immediately and then again after 500ms
window.addEventListener('resize', resize);
resize();
setTimeout(resize, 500); 

window.onload = resize;