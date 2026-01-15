function createEnvironment() {
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
    const groundMaterial = new THREE.ShaderMaterial({
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

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add buildings
    createBuildings();

    // Add trees
    createTrees();

    // Add stars
    createStars();

    // Add skybox
    createSkybox();

    console.log("Environment created");
}

function createBuildings() {
    const buildingMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.2 },
            roughness: { value: 0.6 },
            baseColor: { value: new THREE.Color(0x7f8c8d) },
            time: { value: 0 },
            noiseScale: { value: 15.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    for (let i = 0; i < 12; i++) {
        const height = Math.random() * 12 + 5;
        const width = Math.random() * 2 + 1.5;

        const buildingGeometry = new THREE.BoxGeometry(width, height, width);
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

        const angle = (i / 12) * Math.PI * 2;
        const radius = 25 + Math.random() * 20;

        building.position.set(
            Math.cos(angle) * radius,
            height / 2,
            Math.sin(angle) * radius
        );

        building.castShadow = true;
        building.receiveShadow = true;
        scene.add(building);

        // Add windows
        for (let j = 0; j < Math.floor(height / 2); j++) {
            if (Math.random() > 0.3) {
                const windowGeometry = new THREE.PlaneGeometry(0.3, 0.3);
                const windowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff88 });
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(building.position.x, j * 2 + 2, building.position.z + width/2 + 0.01);
                scene.add(window);
            }
        }
    }
}

function createTrees() {
    const trunkMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.1 },
            roughness: { value: 0.8 },
            baseColor: { value: new THREE.Color(0x8B4513) },
            time: { value: 0 },
            noiseScale: { value: 10.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    const foliageMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.0 },
            roughness: { value: 0.9 },
            baseColor: { value: new THREE.Color(0x228B22) },
            time: { value: 0 },
            noiseScale: { value: 15.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    for (let i = 0; i < 20; i++) {
        const tree = new THREE.Group();
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 3, 12);
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        tree.add(trunk);

        for (let j = 0; j < 3; j++) {
            const foliageGeometry = new THREE.ConeGeometry(1.5 - j * 0.3, 2, 12);
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 3 + j * 1.2;
            foliage.castShadow = true;
            tree.add(foliage);
        }

        tree.position.set(
            Math.random() * 80 - 40,
            0,
            Math.random() * 80 - 40
        );
        tree.scale.set(
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4
        );
        scene.add(tree);
    }
}

function createStars() {
    const starCount = 500;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = Math.random() * 200 - 100;
        positions[i * 3 + 1] = Math.random() * 100 + 50;
        positions[i * 3 + 2] = Math.random() * 200 - 100;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    stars = new THREE.Points(starGeometry, starMaterial);
    stars.visible = false;
    scene.add(stars);
}

function createSkybox() {
    const skyGeometry = new THREE.SphereGeometry(90, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            noiseScale: { value: 10.0 },
            isNight: { value: 0.0 }
        },
        vertexShader: skyVertexShader,
        fragmentShader: skyFragmentShader,
        side: THREE.BackSide
    });

    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
}