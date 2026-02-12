const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

let drawing = false;
let mode = 'draw'; // 'draw' or 'erase'
let color = '#ffffff';

// Set Canvas Size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawPitch(); // Redraw pitch whenever resized
}

function drawPitch() {
    // Green Pitch
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pitch Lines
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 3;
    
    // Outer boundary
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Halfway line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 50);
    ctx.lineTo(canvas.width / 2, canvas.height - 50);
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
    ctx.stroke();
}



// Drawing Logic
function startPos(e) {
    drawing = true;
    draw(e);
}

function endPos() {
    drawing = false;
    ctx.beginPath(); // Resets the line path so it doesn't connect dots
}

function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = mode === 'erase' ? 40 : 5;
    ctx.lineCap = 'round';
    
    // If erasing, use the pitch color, otherwise use chosen color
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    // Support both mouse and touch for Discord mobile
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Tool Switchers
document.getElementById('drawBtn').onclick = () => mode = 'draw';
document.getElementById('eraseBtn').onclick = () => mode = 'erase';
window.setColor = (c) => { color = c; mode = 'draw'; };
window.clearBoard = () => drawPitch();

// Listeners
canvas.addEventListener('mousedown', startPos);
canvas.addEventListener('mouseup', endPos);
canvas.addEventListener('mousemove', draw);

// Mobile Support
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPos(e); }, {passive: false});
canvas.addEventListener('touchend', endPos);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, {passive: false});

window.addEventListener('resize', resize);
resize();