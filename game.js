const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let drawing = false;
let mode = 'draw';
let color = 'white';

function init() {
    // Set internal resolution to match screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Fill the green field
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw simple white lines
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
}


function getPos(e) {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    return { x, y };
}

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const {x, y} = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
});

window.addEventListener('mouseup', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const {x, y} = getPos(e);
    
    ctx.lineWidth = mode === 'erase' ? 40 : 5;
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;
    ctx.lineCap = 'round';
    
    ctx.lineTo(x, y);
    ctx.stroke();
});

// Global for the HTML buttons
window.clearBoard = () => init();

// Touch support for mobile
canvas.addEventListener('touchstart', (e) => {
    drawing = true;
    const {x, y} = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.preventDefault();
}, {passive: false});

canvas.addEventListener('touchmove', (e) => {
    if (!drawing) return;
    const {x, y} = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    e.preventDefault();
}, {passive: false});

window.addEventListener('resize', init);
init();