window.onload = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x23272a);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 10, 0);
    scene.add(light);

    // --- 1. The Alley ---
    const alleyGeo = new THREE.BoxGeometry(4, 0.5, 20);
    const alleyMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const alley = new THREE.Mesh(alleyGeo, alleyMat);
    alley.position.z = -5;
    scene.add(alley);

    // --- 2. The Rings (Targets) ---
    function createRing(radius, z, points, color) {
        const geo = new THREE.TorusGeometry(radius, 0.1, 16, 100);
        const mat = new THREE.MeshStandardMaterial({ color: color });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 0.5, z);
        ring.userData = { points };
        scene.add(ring);
        return ring;
    }

    const rings = [
        createRing(1.5, -12, 10, 0xffffff),
        createRing(1.0, -13, 50, 0xff0000),
        createRing(0.5, -14, 100, 0x0000ff)
    ];

    // --- 3. The Ball ---
    const ballGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    scene.add(ball);

    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, -5);

    // --- 4. Physics & Controls ---
    let score = 0;
    let isRolling = false;
    let velocity = new THREE.Vector3(0, 0, 0);
    let power = 0;
    let charging = false;

    window.addEventListener('mousedown', () => { 
        if (!isRolling) {
            charging = true;
            power = 0;
            document.getElementById('power-bar').style.display = 'block';
        }
    });

    window.addEventListener('mouseup', () => {
        if (charging) {
            charging = false;
            isRolling = true;
            velocity.z = -0.1 - (power * 0.4); // Force based on charge
            velocity.y = 0.15; // Small jump for the "ramp"
            document.getElementById('power-bar').style.display = 'none';
        }
    });

    function resetBall() {
        isRolling = false;
        ball.position.set(0, 0.5, 5);
        velocity.set(0,0,0);
    }

    function animate() {
        requestAnimationFrame(animate);

        if (charging) {
            power = Math.min(power + 0.02, 1);
            document.getElementById('fill').style.width = (power * 100) + '%';
        }

        if (isRolling) {
            ball.position.add(velocity);
            velocity.y -= 0.005; // Simple gravity

            // Bounce off the alley floor
            if (ball.position.y < 0.5) {
                ball.position.y = 0.5;
                velocity.y *= -0.5; // Dampen bounce
            }

            // Check if ball passed rings
            if (ball.position.z < -15) {
                checkScore();
                resetBall();
            }
        }

        renderer.render(scene, camera);
    }

    function checkScore() {
        // Logic: Check distance from ball to ring centers
        let earned = 0;
        rings.forEach(r => {
            const dist = ball.position.distanceTo(r.position);
            if (dist < r.geometry.parameters.radius) earned = r.userData.points;
        });
        
        if (earned > 0) {
            score += earned;
            document.getElementById('score').innerText = score;
        }
    }

    resetBall();
    animate();
};