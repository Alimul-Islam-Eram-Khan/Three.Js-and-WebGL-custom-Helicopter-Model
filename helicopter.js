function createHelicopter() {
    helicopter = new THREE.Group();

    // Create custom materials with shaders
    const helicopterMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.7 },
            roughness: { value: 0.3 },
            baseColor: { value: new THREE.Color(0x2980b9) },
            time: { value: 0 },
            noiseScale: { value: 20.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    // Main body
    const bodyGeometry = new THREE.CylinderGeometry(1, 1, 4, 32);
    const body = new THREE.Mesh(bodyGeometry, helicopterMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    body.rotation.z = Math.PI / 2;
    helicopter.add(body);

    // Rounded ends
    const endGeometry = new THREE.SphereGeometry(1, 32, 32);
    const frontEnd = new THREE.Mesh(endGeometry, helicopterMaterial);
    frontEnd.position.set(2, 0, 0);
    frontEnd.castShadow = true;
    helicopter.add(frontEnd);

    const backEnd = new THREE.Mesh(endGeometry, helicopterMaterial);
    backEnd.position.set(-2, 0, 0);
    backEnd.castShadow = true;
    helicopter.add(backEnd);

    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(1.2, 32, 24, 0, Math.PI);
    const cockpitMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.9 },
            roughness: { value: 0.1 },
            baseColor: { value: new THREE.Color(0x3498db) },
            time: { value: 0 },
            noiseScale: { value: 10.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        opacity: 0.7
    });

    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(1.5, 0, 0);
    cockpit.rotation.y = Math.PI / 2;
    cockpit.castShadow = true;
    helicopter.add(cockpit);

    // Tail boom
    const tailGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 16);
    const tail = new THREE.Mesh(tailGeometry, helicopterMaterial);
    tail.position.set(-3, 0, 0);
    tail.rotation.z = Math.PI / 2;
    tail.castShadow = true;
    helicopter.add(tail);

    // Landing skids
    const skidMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.5 },
            roughness: { value: 0.5 },
            baseColor: { value: new THREE.Color(0x7f8c8d) },
            time: { value: 0 },
            noiseScale: { value: 15.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    const skidGeometry = new THREE.BoxGeometry(4, 0.1, 0.3);
    const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
    leftSkid.position.set(0, -1.2, -0.8);
    leftSkid.castShadow = true;
    helicopter.add(leftSkid);

    const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
    rightSkid.position.set(0, -1.2, 0.8);
    rightSkid.castShadow = true;
    helicopter.add(rightSkid);

    // Skid connectors
    const connectorGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    for (let i = 0; i < 4; i++) {
        const connector = new THREE.Mesh(connectorGeometry, skidMaterial);
        connector.position.set(i * 1.5 - 2.25, -0.6, i % 2 === 0 ? -0.8 : 0.8);
        connector.castShadow = true;
        helicopter.add(connector);
    }

    // Main rotor mast
    const mastGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 16);
    const mast = new THREE.Mesh(mastGeometry, skidMaterial);
    mast.position.set(0, 1.5, 0);
    mast.castShadow = true;
    helicopter.add(mast);

    // Create rotors
    createMainRotor();
    createTailRotor();

    // Particle system for engine exhaust
    createExhaustParticles();

    helicopter.position.copy(originalHeliPosition);
    scene.add(helicopter);

    console.log("Helicopter created");
}

function createMainRotor() {
    rotorMain = new THREE.Group();

    const rotorMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.3 },
            roughness: { value: 0.7 },
            baseColor: { value: new THREE.Color(0x34495e) },
            time: { value: 0 },
            noiseScale: { value: 25.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide
    });

    // Main rotor hub
    const hubGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
    const hub = new THREE.Mesh(hubGeometry, rotorMaterial);
    rotorMain.add(hub);

    // Main rotor blades
    const bladeGeometry = new THREE.BoxGeometry(8, 0.05, 0.3);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladeGeometry, rotorMaterial);
        blade.rotation.y = (i * Math.PI) / 2;
        blade.castShadow = true;
        rotorMain.add(blade);

        // Blade tips
        const tipGeometry = new THREE.CylinderGeometry(0.02, 0.1, 0.3, 12);
        const tip = new THREE.Mesh(tipGeometry, rotorMaterial);
        tip.position.x = i % 2 === 0 ? 4 : -4;
        tip.rotation.z = Math.PI / 2;
        tip.rotation.y = (i * Math.PI) / 2;
        rotorMain.add(tip);
    }

    rotorMain.position.set(0, 2.2, 0);
    helicopter.add(rotorMain);
}

function createTailRotor() {
    rotorTail = new THREE.Group();

    const tailRotorMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            metallic: { value: 0.3 },
            roughness: { value: 0.7 },
            baseColor: { value: new THREE.Color(0x34495e) },
            time: { value: 0 },
            noiseScale: { value: 25.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide
    });

    // Tail rotor hub
    const tailHubGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const tailHub = new THREE.Mesh(tailHubGeometry, tailRotorMaterial);
    tailHub.rotation.z = Math.PI / 2;
    rotorTail.add(tailHub);

    // Tail rotor blades
    const tailBladeGeometry = new THREE.BoxGeometry(0.05, 2, 0.15);
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(tailBladeGeometry, tailRotorMaterial);
        blade.rotation.x = (i * Math.PI) / 2;
        blade.castShadow = true;
        rotorTail.add(blade);
    }

    rotorTail.position.set(-6, 1, 0);
    helicopter.add(rotorTail);
}

function createExhaustParticles() {
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = -4;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        velocities[i * 3] = -0.1 - Math.random() * 0.05;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffaa33,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    helicopter.add(particleSystem);
}