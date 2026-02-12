// --- 1. Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 5, 5);
scene.add(light, new THREE.AmbientLight(0x404040));

// Table
const tableGeo = new THREE.BoxGeometry(10, 0.2, 10);
const tableMat = new THREE.MeshStandardMaterial({ color: 0x1d4d1d });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.y = -1;
scene.add(table);

camera.position.set(0, 4, 6);
camera.lookAt(0, 0, 0);

// --- 2. Game Logic State ---
const cardColors = { 'Red': 0xff0000, 'Blue': 0x0000ff, 'Green': 0x00ff00, 'Yellow': 0xffff00 };
let hand = [];
let discardPile = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// --- 3. Functions ---
function createCardMesh(color, value, xPos) {
    const geometry = new THREE.BoxGeometry(0.8, 1.2, 0.05);
    const material = new THREE.MeshStandardMaterial({ color: cardColors[color] });
    const card = new THREE.Mesh(geometry, material);
    
    card.position.set(xPos, 0, 0);
    card.userData = { color, value }; // Store game data inside 3D object
    scene.add(card);
    return card;
}

function initGame() {
    // Initial Hand (5 Cards)
    const colors = ['Red', 'Blue', 'Green', 'Yellow'];
    for(let i = 0; i < 5; i++) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        const v = Math.floor(Math.random() * 10);
        hand.push(createCardMesh(c, v, (i - 2) * 1.2));
    }
}

// Click Detection
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hand);

    if (intersects.length > 0) {
        const clickedCard = intersects[0].object;
        playCard(clickedCard);
    }
});

function playCard(card) {
    // Basic Animation: Move to center
    card.position.set(0, 0.1, 0);
    card.rotation.x = Math.PI / 2;
    console.log(`Played ${card.userData.color} ${card.userData.value}`);
    // You can add logic here to remove from hand array
}

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

initGame();
animate();