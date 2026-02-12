// Wrap everything in a check to ensure the page is 100% loaded
window.addEventListener('load', function() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x23272a); // Discord Grey

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // 1. LIGHTING (Crucial: Without this, everything is black)
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    // 2. THE ALLEY (A long brown box)
    const alleyGeo = new THREE.BoxGeometry(4, 0.5, 20);
    const alleyMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const alley = new THREE.Mesh(alleyGeo, alleyMat);
    alley.position.set(0, -0.25, -5);
    scene.add(alley);

    // 3. THE BALL (A bright orange sphere)
    const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 0.5, 5); // Place it near the camera
    scene.add(ball);

    // 4. CAMERA POSITION (Angled down)
    camera.position.set(0, 5, 12); 
    camera.lookAt(0, 0, 0);

    // 5. RENDER LOOP
    function animate() {
        requestAnimationFrame(animate);
        
        // Let's add a tiny bit of rotation to the ball so we know the game is "alive"
        ball.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();

    // 6. RESIZE FIX (Discord windows change size a lot)
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log("3D Scene Initialized");
});