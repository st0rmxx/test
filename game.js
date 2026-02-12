const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d', { alpha: false });

let drawing = false;
let mode = 'draw';
let color = '#ffffff';

// This is the core fix: A function that draws the pitch dynamically
function drawField() {
    // 1. Match canvas internal resolution to the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 2. Fill Background
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Draw Pitch Markings (Dynamic based on current width/height)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 4;
    
    const m = 40; // margin from edges
    const w = canvas.width - (m * 2);
    const h = canvas.height - (m * 2);

    // Outer pitch boundary
    ctx.strokeRect(m, m, w, h);
    
    // Halfway line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, m);
    ctx.lineTo(canvas.width / 2, h + m);
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(w, h) * 0.15, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty Areas
    const boxH = h * 0.4;
    ctx.strokeRect(m, (canvas.height - boxH) / 2, w * 0.12, boxH); // Left
    ctx.strokeRect(canvas.width - m - (w * 0.12), (canvas.height - boxH) / 2, w * 0.12, boxH); // Right
}


// --- Interaction Logic ---
function getPos(e) {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    return { x, y };
}

canvas.addEventListener('mousedown', (e) => { drawing = true; ctx.beginPath(); });
window.addEventListener('mouseup', () => { drawing = false; });

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    
    ctx.lineWidth = mode === 'erase' ? 40 : 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#2e7d32' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
});

// Tool Handlers
window.setMode = (m) => mode = m;
window.setColor = (c) => { color = c; mode = 'draw'; };
window.clearBoard = () => drawField();

// --- THE DISCORD FIX: Resize Observer ---
// This watches for the exact moment Discord expands the window
const resizeObserver = new ResizeObserver(() => {
    drawField();
});
resizeObserver.observe(document.body);

// Initial draw
drawField();