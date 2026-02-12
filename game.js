// --- 1. Scene & Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
const cardBackTex = loader.load('assets/card_back.png'); // Upload a back image!

// --- 2. Card Factory ---
function create3DCard(color, value, x) {
    const geometry = new THREE.BoxGeometry(1, 1.4, 0.05);
    
    // In Three.js, a box has 6 sides. We map the front texture to index 4 or 5.
    const frontTex = loader.load(`assets/${color}_${value}.png`); 
    const materials = [
        new THREE.MeshStandardMaterial({color: 0x888888}), // sides
        new THREE.MeshStandardMaterial({color: 0x888888}), // sides
        new THREE.MeshStandardMaterial({color: 0x888888}), // top
        new THREE.MeshStandardMaterial({color: 0x888888}), // bottom
        new THREE.MeshStandardMaterial({map: frontTex}),   // front
        new THREE.MeshStandardMaterial({map: cardBackTex}) // back
    ];

    const card = new THREE.Mesh(geometry, materials);
    card.position.set(x, 0, 0);
    card.userData = { color, value };
    scene.add(card);
    return card;
}

// --- 3. Interaction (Raycasting) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const found = raycaster.intersectObjects(scene.children);
    
    if (found.length > 0 && found[0].object.userData.color) {
        handlePlay(found[0].object);
    }
});

function handlePlay(card) {
    // Replace alert() with UI feedback
    const errorDiv = document.getElementById('error');
    errorDiv.style.opacity = "1";
    setTimeout(() => errorDiv.style.opacity = "0", 2000);
    
    // Add logic here to move the card mesh to the center of the "table"
}

// Lighting & Loop
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();