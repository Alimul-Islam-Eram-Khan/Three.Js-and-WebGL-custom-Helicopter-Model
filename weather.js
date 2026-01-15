// weather.js
let rainSystem, rainEnabled = false;
let rainCount = 500;

function initWeather() {
    // Create rain particles
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
        positions[i * 3] = Math.random() * 100 - 50; // Spread across scene
        positions[i * 3 + 1] = Math.random() * 50 + 10; // Start above ground
        positions[i * 3 + 2] = Math.random() * 100 - 50;
        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = -0.2 - Math.random() * 0.1; // Fall speed
        velocities[i * 3 + 2] = 0;
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    rainGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    rainSystem = new THREE.Points(rainGeometry, rainMaterial);
    rainSystem.visible = false;
    scene.add(rainSystem);

    // Add weather toggle to controls UI
    const controlsDiv = document.getElementById('controls');
    const weatherControl = document.createElement('div');
    weatherControl.className = 'control-item';
    weatherControl.textContent = 'R: Toggle rain (night only)';
    controlsDiv.appendChild(weatherControl);

    // Keyboard control for rain toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyR' && dayNight === 'night') {
            rainEnabled = !rainEnabled;
            rainSystem.visible = rainEnabled;
        }
    });

    console.log("Weather system initialized");
}

function updateWeather(currentTime) {
    if (!rainEnabled || dayNight !== 'night') {
        rainSystem.visible = false;
        return;
    }

    rainSystem.visible = true;
    const positions = rainSystem.geometry.attributes.position.array;
    const velocities = rainSystem.geometry.attributes.velocity.array;

    for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] += velocities[i * 3 + 1]; // Update y-position
        if (positions[i * 3 + 1] < 0) { // Reset when hitting ground
            positions[i * 3] = Math.random() * 100 - 50;
            positions[i * 3 + 1] = Math.random() * 50 + 10;
            positions[i * 3 + 2] = Math.random() * 100 - 50;
        }
    }

    rainSystem.geometry.attributes.position.needsUpdate = true;
}