// terrain.js
let terrainMesh, terrainEnabled = false;
let originalGround;

function initTerrain() {
    // Store reference to original ground
    scene.traverse((child) => {
        if (child.isMesh && child.geometry instanceof THREE.PlaneGeometry) {
            originalGround = child;
        }
    });

    // Generate heightmap using simple Perlin noise
    const size = 100, segments = 20;
    const terrainGeometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const vertices = terrainGeometry.attributes.position.array;
    for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
            const index = (i * (segments + 1) + j) * 3;
            const x = (j / segments - 0.5) * size;
            const z = (i / segments - 0.5) * size;
            vertices[index + 2] = noise(x * 0.05, z * 0.05) * 5; // Height up to 5 units
        }
    }
    terrainGeometry.computeVertexNormals();

    // Simple Perlin noise implementation
    function noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return n - Math.floor(n);
    }

    const terrainMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.0 },
            roughness: { value: 1.0 },
            baseColor: { value: new THREE.Color(0x27ae60) },
            time: { value: 0 },
            noiseScale: { value: 5.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.receiveShadow = true;
    terrainMesh.visible = false;
    scene.add(terrainMesh);

    // Add terrain toggle to controls UI
    const controlsDiv = document.getElementById('controls');
    const terrainControl = document.createElement('div');
    terrainControl.className = 'control-item';
    terrainControl.textContent = 'T: Toggle terrain';
    controlsDiv.appendChild(terrainControl);

    // Keyboard control for terrain toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyT') {
            terrainEnabled = !terrainEnabled;
            terrainMesh.visible = terrainEnabled;
            originalGround.visible = !terrainEnabled;
        }
    });

    console.log("Terrain initialized");
}

function updateTerrain(currentTime) {
    if (terrainEnabled) {
        terrainMesh.material.uniforms.time.value = currentTime * 0.001;
        terrainMesh.material.uniforms.lightPosition.value = light.position;
        terrainMesh.material.uniforms.ambientColor.value = dayNight === 'day' ? new THREE.Color(0x404040) : new THREE.Color(0x101010);
    }
}