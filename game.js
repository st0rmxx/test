// --- 1. Scene & Renderer Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x23272a); // Dark Discord theme

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 2. Lighting (Essential!) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); 
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(5, 10, 7);
scene.add(pointLight);

// --- 3. Camera Positioning ---
camera.position.set(0, 5, 8); // Move camera up and back
camera.lookAt(0, 0, 0);       // Point at the center of the world

// --- 4. Game Logic & State ---
const COLORS = ['Red', 'Blue', 'Green', 'Yellow'];
const HEX_COLORS = { 'Red': 0xff5555, 'Blue': 0x5555ff, 'Green': 0x55aa55, 'Yellow': 0xffaa00 };
let hand = [];
let topCard = null;

// --- 5. Functions ---
function createCardMesh(color, value) {
    const geometry = new THREE.BoxGeometry(1, 1.5, 0.1);
    const material = new THREE.MeshStandardMaterial({ color: HEX_COLORS[color] });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.userData = { color, value };
    scene.add(mesh);
    return mesh;
}

window.drawCard = () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const value = Math.floor(Math.random() * 10).toString();
    const card = createCardMesh(color, value);
    hand.push(card);
    updateHandLayout();
};

function updateHandLayout() {
    hand.forEach((card, i) => {
        const xPos = (i - (hand.length - 1) / 2) * 1.3;
        card.position.set(xPos, -2, 4); // Position cards at bottom of screen
        card.rotation.set(-0.4, 0, 0);  // Tilt toward camera
    });
}

function playCard(card) {
    const { color, value } = card.userData;
    
    // Check UNO Rules
    if (!topCard || color === topCard.color || value === topCard.value) {
        if (topCard) scene.remove(topCard.mesh); // Remove previous discard
        
        topCard = { color, value, mesh: card };
        
        // Move card to the center "Discard Pile"
        card.position.set(0, 0, 0);
        card.rotation.set(0, 0, 0);
        
        hand = hand.filter(c => c !== card); // Remove from player hand
        document.getElementById('current-target').innerText = `${color} ${value}`;
        updateHandLayout();
    } else {
        const err = document.getElementById('error-msg');
        err.style.display = 'block';
        setTimeout(() => err.style.display = 'none', 1500);
    }
}

// --- 6. Interaction (Clicking 3D Objects) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hand);

    if (intersects.length > 0) {
        playCard(intersects[0].object);
    }
});

// --- 7. Initialization & Loop ---
for(let i=0; i<5; i++) drawCard(); // Start with 5 cards

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});