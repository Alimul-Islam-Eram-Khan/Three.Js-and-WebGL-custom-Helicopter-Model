// clouds.js
let cloudSystem, cloudEnabled = true;
let cloudCount = 20;

function initClouds() {
    // Custom cloud shader
    const cloudVertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    const cloudFragmentShader = `
        uniform float time;
        uniform float isNight;
        varying vec2 vUv;
        float noise(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        void main() {
            vec2 uv = vUv - 0.5;
            float d = length(uv);
            float alpha = smoothstep(0.5, 0.2, d) * (0.5 + 0.5 * isNight); // Denser at night
            float n = noise(uv * 10.0 + time * 0.1);
            vec3 color = mix(vec3(0.9, 0.9, 0.95), vec3(0.5, 0.5, 0.6), isNight);
            gl_FragColor = vec4(color, alpha * (0.7 + n * 0.3));
        }
    `;

    // Create cloud billboards
    const cloudGeometry = new THREE.PlaneGeometry(20, 20);
    const cloudMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            isNight: { value: dayNight === 'night' ? 1.0 : 0.0 }
        },
        vertexShader: cloudVertexShader,
        fragmentShader: cloudFragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    });

    cloudSystem = new THREE.Group();
    for (let i = 0; i < cloudCount; i++) {
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial.clone());
        cloud.position.set(
            Math.random() * 100 - 50,
            20 + Math.random() * 10,
            Math.random() * 100 - 50
        );
        cloud.rotation.y = Math.random() * Math.PI * 2;
        cloudSystem.add(cloud);
    }
    cloudSystem.visible = cloudEnabled;
    scene.add(cloudSystem);

    // Add cloud toggle to controls UI
    const controlsDiv = document.getElementById('controls');
    const cloudControl = document.createElement('div');
    cloudControl.className = 'control-item';
    cloudControl.textContent = 'L: Toggle clouds';
    controlsDiv.appendChild(cloudControl);

    // Keyboard control for cloud toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyL') {
            cloudEnabled = !cloudEnabled;
            cloudSystem.visible = cloudEnabled;
        }
    });

    console.log("Cloud system initialized");
}

function updateClouds(currentTime) {
    if (!cloudEnabled) return;

    // Update cloud material uniforms
    cloudSystem.traverse((cloud) => {
        if (cloud.material) {
            cloud.material.uniforms.time.value = currentTime * 0.001;
            cloud.material.uniforms.isNight.value = dayNight === 'night' ? 1.0 : 0.0;
        }
    });

    // Move clouds with wind (if wind.js is active)
    const windDirection = windEnabled ? new THREE.Vector3(Math.sin(currentTime * 0.001), 0, Math.cos(currentTime * 0.001)).normalize() : new THREE.Vector3(0, 0, 0);
    const windSpeed = windEnabled ? (dayNight === 'night' ? 0.1 : 0.05) : 0.02;
    cloudSystem.traverse((cloud) => {
        cloud.position.x += windDirection.x * windSpeed * 0.05;
        cloud.position.z += windDirection.z * windSpeed * 0.05;
        // Wrap clouds around scene
        if (cloud.position.x > 50) cloud.position.x -= 100;
        if (cloud.position.x < -50) cloud.position.x += 100;
        if (cloud.position.z > 50) cloud.position.z -= 100;
        if (cloud.position.z < -50) cloud.position.z += 100;
    });
}