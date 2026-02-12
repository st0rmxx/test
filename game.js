// --- Initialize 3D Environment ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x23272a); // Discord-ish Dark Grey

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0x404040, 2));

camera.position.set(0, 5, 7);
camera.lookAt(0, 0, 0);

// --- Game State ---
const COLORS = ['Red', 'Blue', 'Green', 'Yellow'];
const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const HEX = { 'Red': 0xff5555, 'Blue': 0x5555ff, 'Green': 0x55aa55, 'Yellow': 0xffaa00 };

let hand = [];
let discardPile = [];
let topCard = null;

// --- Card Logic ---
function createCard(color, value, isPlayerHand = true) {
    const geometry = new THREE.BoxGeometry(1, 1.5, 0.05);
    const material = new THREE.MeshStandardMaterial({ color: HEX[color] });
    const cardMesh = new THREE.Mesh(geometry, material);
    
    cardMesh.userData = { color, value };
    scene.add(cardMesh);
    return cardMesh;
}

function updateHandLayout() {
    hand.forEach((card, i) => {
        const xPos = (i - (hand.length - 1) / 2) * 1.2;
        card.position.set(xPos, -2, 2); // Put cards at the bottom of the screen
        card.rotation.set(-0.5, 0, 0); // Tilt toward camera
    });
}

function playCard(card) {
    if (!topCard || card.userData.color === topCard.color || card.userData.value === topCard.value) {
        // Valid Move
        if (topCard && topCard.mesh) scene.remove(topCard.mesh); // Remove old center card
        
        topCard = { color: card.userData.color, value: card.userData.value, mesh: card };
        
        // Move card to center
        card.position.set(0, 0, 0);
        card.rotation.set(0, 0, 0);
        
        hand = hand.filter(c => c !== card); // Remove from hand array
        document.getElementById('current-target').innerText = `${topCard.color} ${topCard.value}`;
        updateHandLayout();
    } else {
        // Invalid Move
        const ov = document.getElementById('msg-overlay');
        ov.style.display = 'block';
        setTimeout(() => ov.style.display = 'none', 1500);
    }
}

function drawCard() {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    const v = VALUES[Math.floor(Math.random() * VALUES.length)];
    const newCard = createCard(c, v);
    hand.push(newCard);
    updateHandLayout();
}

// --- Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(hand);
    if (intersects.length > 0) {
        playCard(intersects[0].object);
    }
});

// Start Game
for(let i=0; i<5; i++) drawCard();

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