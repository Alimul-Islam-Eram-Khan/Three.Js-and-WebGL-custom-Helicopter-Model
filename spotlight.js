// spotlight.js
let spotlight, spotlightMesh, spotlightEnabled = true;
let spotlightIntensity = 1.0;

function initSpotlight() {
    // Create spotlight
    spotlight = new THREE.SpotLight(0xffffff, 1.0, 50, Math.PI / 6, 0.5, 2);
    spotlight.position.set(0, -1, 0); // Below helicopter
    spotlight.target.position.set(0, -10, 0); // Point downward
    helicopter.add(spotlight);
    helicopter.add(spotlight.target);
    spotlight.visible = spotlightEnabled && dayNight === 'night';

    // Visual cone for spotlight
    const coneGeometry = new THREE.ConeGeometry(2, 10, 16);
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    spotlightMesh = new THREE.Mesh(coneGeometry, coneMaterial);
    spotlightMesh.position.set(0, -5, 0);
    spotlightMesh.rotation.x = Math.PI;
    spotlightMesh.visible = spotlightEnabled && dayNight === 'night';
    helicopter.add(spotlightMesh);

    // Add spotlight toggle to controls UI
    const controlsDiv = document.getElementById('controls');
    const spotlightControl = document.createElement('div');
    spotlightControl.className = 'control-item';
    spotlightControl.textContent = 'O: Toggle spotlight (night only), Wheel: Adjust intensity';
    controlsDiv.appendChild(spotlightControl);

    // Keyboard control for spotlight toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyO' && dayNight === 'night') {
            spotlightEnabled = !spotlightEnabled;
            spotlight.visible = spotlightEnabled && dayNight === 'night';
            spotlightMesh.visible = spotlightEnabled && dayNight === 'night';
        }
    });

    // Mouse wheel for spotlight intensity
    document.addEventListener('wheel', (event) => {
        if (spotlightEnabled && dayNight === 'night') {
            spotlightIntensity = Math.max(0.5, Math.min(2.0, spotlightIntensity + event.deltaY * -0.001));
            spotlight.intensity = spotlightIntensity;
        }
    });

    console.log("Spotlight initialized");
}

function updateSpotlight() {
    spotlight.visible = spotlightEnabled && dayNight === 'night';
    spotlightMesh.visible = spotlightEnabled && dayNight === 'night';
    if (spotlightEnabled && dayNight === 'night') {
        spotlight.position.copy(helicopter.position).add(new THREE.Vector3(0, -1, 0));
        spotlight.target.position.copy(helicopter.position).add(new THREE.Vector3(0, -10, 0));
        spotlightMesh.position.copy(helicopter.position).add(new THREE.Vector3(0, -5, 0));
    }
}