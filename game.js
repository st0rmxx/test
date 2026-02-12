const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d', { desynchronized: true });

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

function init() {
    // Force internal resolution to match exact screen pixels
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawPitchLines();
}

function drawPitchLines() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 4;
    const m = 40;
    ctx.strokeRect(m, m, canvas.width - m*2, canvas.height - m*2);
    
    // Halfway line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, m);
    ctx.lineTo(canvas.width / 2, canvas.height - m);
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
    ctx.stroke();
}



function getXY(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX || (e.touches && e.touches[0].clientX);
    const cy = e.clientY || (e.touches && e.touches[0].clientY);
    return {
        x: (cx - rect.left) * (canvas.width / rect.width),
        y: (cy - rect.top) * (canvas.height / rect.height)
    };
}

const start = (e) => {
    drawing = true;
    const { x, y } = getXY(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
};

const move = (e) => {
    if (!drawing) return;
    const { x, y } = getXY(e);
    
    ctx.lineWidth = mode === 'erase' ? 40 : 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
};

const stop = () => { drawing = false; };

// UI Global Functions
window.setMode = (m) => mode = m;
window.setColor = (c) => { color = c; mode = 'draw'; };
window.clearBoard = () => init();

// Mouse: Using 'true' to capture events before Discord intercepts them
canvas.addEventListener('mousedown', start, true);
window.addEventListener('mousemove', move, true);
window.addEventListener('mouseup', stop, true);

// Touch: Using 'true' for mobile capturing
canvas.addEventListener('touchstart', (e) => { start(e); e.preventDefault(); }, true);
canvas.addEventListener('touchmove', (e) => { move(e); e.preventDefault(); }, true);
canvas.addEventListener('touchend', stop, true);

window.addEventListener('resize', init);
init();