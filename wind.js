// wind.js
let windEnabled = true;
let windStrength = 0.05; // Default wind strength

function initWind() {
    // Add wind toggle to controls UI
    const controlsDiv = document.getElementById('controls');
    const windControl = document.createElement('div');
    windControl.className = 'control-item';
    windControl.textContent = 'W: Toggle wind effects';
    controlsDiv.appendChild(windControl);

    // Keyboard control for wind toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyW') {
            windEnabled = !windEnabled;
        }
    });

    console.log("Wind effects initialized");
}

function updateWind(currentTime) {
    if (!windEnabled) return;

    // Adjust wind strength based on day/night
    const baseWindStrength = dayNight === 'night' ? 0.1 : 0.05;
    const windDirection = new THREE.Vector3(Math.sin(currentTime * 0.001), 0, Math.cos(currentTime * 0.001)).normalize();

    // Affect rain particles if weather is active
    if (rainSystem && rainEnabled && dayNight === 'night') {
        const positions = rainSystem.geometry.attributes.position.array;
        const velocities = rainSystem.geometry.attributes.velocity.array;
        for (let i = 0; i < rainCount; i++) {
            velocities[i * 3] = windDirection.x * baseWindStrength; // Sideways movement
            velocities[i * 3 + 2] = windDirection.z * baseWindStrength;
        }
        rainSystem.geometry.attributes.velocity.needsUpdate = true;
    }

    // Sway trees
    scene.traverse((child) => {
        if (child.isGroup && child.children.some(c => c.geometry instanceof THREE.ConeGeometry)) { // Tree groups
            child.rotation.z = Math.sin(currentTime * 0.002) * baseWindStrength * 0.5;
            child.rotation.x = Math.cos(currentTime * 0.002) * baseWindStrength * 0.5;
        }
    });
}