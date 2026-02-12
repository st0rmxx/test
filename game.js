let scene, camera, renderer, currentModel;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x23272a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // --- Studio Lighting ---
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    animate();
}

function loadModel(type) {
    if (currentModel) scene.remove(currentModel);
    document.getElementById('loading').style.display = 'block';

    const loader = (type === 'obj') ? new THREE.OBJLoader() : new THREE.FBXLoader();
    const extension = (type === 'obj') ? '.obj' : '.fbx';
    
    // Replace 'my_model' with your actual file name in your assets folder
    loader.load(`assets/test_model${extension}`, (object) => {
        currentModel = object;
        
        // Auto-scale to fit screen
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center); // Center the model
        
        scene.add(object);
        document.getElementById('loading').style.display = 'none';
    }, 
    (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
    (error) => { 
        console.error(error);
        document.getElementById('loading').innerText = "Error Loading!";
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (currentModel) {
        currentModel.rotation.y += 0.01; // Auto-rotate for display
    }
    renderer.render(scene, camera);
}

init();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});