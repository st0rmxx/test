// 1. Create and Inject Canvas immediately
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '1';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d', { alpha: false });

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Force a Green Fill immediately
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawPitch();
}

function drawPitch() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    // Boundary
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    // Middle Line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 50);
    ctx.lineTo(canvas.width / 2, canvas.height - 50);
    ctx.stroke();
}



// 2. The Interaction Logic
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    return { x, y };
}

canvas.addEventListener('mousedown', (e) => { 
    drawing = true; 
    ctx.beginPath(); 
    const {x, y} = getPos(e);
    ctx.moveTo(x, y);
});

window.addEventListener('mouseup', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const {x, y} = getPos(e);
    ctx.lineWidth = mode === 'erase' ? 40 : 6;
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
});

// 3. Global Helpers
window.setMode = (m) => mode = m;

// 4. Force-Refresh Loop (To fight Discord's "Black Out")
function frame() {
    // If the background is ever "not green", fill it again
    // But we don't clear the whole canvas so the drawings stay
    requestAnimationFrame(frame);
}

window.addEventListener('resize', setup);
setup();
frame();

// Touch support for Mobile
canvas.addEventListener('touchstart', (e) => { drawing = true; ctx.beginPath(); e.preventDefault(); }, {passive:false});
canvas.addEventListener('touchmove', (e) => { 
    if(!drawing) return;
    const {x, y} = getPos(e);
    ctx.lineTo(x,y); ctx.stroke();
    e.preventDefault(); 
}, {passive:false});