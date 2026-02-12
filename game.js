let scene, camera, renderer, currentModel;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x23272a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    animate();
}

// --- The Upload Logic ---
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const reader = new FileReader();
    
    document.getElementById('loading').style.display = 'inline-block';

    reader.onload = function(e) {
        const contents = e.target.result;
        const url = URL.createObjectURL(new Blob([contents]));

        if (fileName.endsWith('.obj')) {
            loadWithLoader(new THREE.OBJLoader(), url);
        } else if (fileName.endsWith('.fbx')) {
            loadWithLoader(new THREE.FBXLoader(), url);
        } else {
            alert("Unsupported file format!");
            document.getElementById('loading').style.display = 'none';
        }
    };

    // Read file as ArrayBuffer for binary FBX support
    reader.readAsArrayBuffer(file);
});

function loadWithLoader(loader, url) {
    loader.load(url, (object) => {
        if (currentModel) scene.remove(currentModel);
        
        currentModel = object;
        
        // Center and Scale the model automatically
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        
        object.position.x += (object.position.x - center.x);
        object.position.y += (object.position.y - center.y);
        object.position.z += (object.position.z - center.z);
        
        const scale = 5 / size; // Normalize size to fit view
        object.scale.set(scale, scale, scale);

        scene.add(object);
        document.getElementById('loading').style.display = 'none';
    }, undefined, (err) => {
        console.error(err);
        document.getElementById('loading').innerText = "Error parsing file!";
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (currentModel) currentModel.rotation.y += 0.005;
    renderer.render(scene, camera);
}

init();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});