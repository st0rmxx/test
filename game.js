const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d', { alpha: false });

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

// --- The Pitch Background & Lines ---
function drawField() {
    // Fill the whole background green
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pitch markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 4;
    
    const m = 40; // margin
    const w = canvas.width - (m * 2);
    const h = canvas.height - (m * 2);

    // Boundaries
    ctx.strokeRect(m, m, w, h);
    
    // Halfway line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, m);
    ctx.lineTo(canvas.width / 2, h + m);
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, h * 0.15, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty Boxes
    const boxH = h * 0.4;
    ctx.strokeRect(m, (canvas.height - boxH) / 2, w * 0.15, boxH); // Left
    ctx.strokeRect(canvas.width - m - (w * 0.15), (canvas.height - boxH) / 2, w * 0.15, boxH); // Right
}


// --- Handling the "Small Box" Bug ---
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawField();
}

// Watch for Discord window changes
const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
        resize();
    }
});
observer.observe(document.body);

// --- Drawing Interaction ---
function getCoords(e) {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    return { x, y };
}

function start(e) {
    drawing = true;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!drawing) return;
    const { x, y } = getCoords(e);
    
    ctx.lineWidth = mode === 'erase' ? 40 : 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
}

function stop() {
    drawing = false;
}

// Tool Global Functions
window.setMode = (m) => mode = m;
window.setColor = (c) => { color = c; mode = 'draw'; };
window.clearBoard = () => drawField();

// Listeners
canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stop);

// Mobile/Touch Support
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }, {passive: false});
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, {passive: false});
canvas.addEventListener('touchend', stop);

// Initial call
resize();