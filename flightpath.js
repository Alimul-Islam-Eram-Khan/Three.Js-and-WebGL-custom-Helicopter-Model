// flightpath.js
let flightPath, pathEnabled = true;

function initFlightPath() {
    // Create flight path geometry (circle with radius 10, matching flight loop in animations.js)
    const pathGeometry = new THREE.BufferGeometry();
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        points.push(new THREE.Vector3(
            10 * Math.sin(angle),
            3 + Math.sin(angle) * 2, // Match helicopter's height variation
            10 * (Math.cos(angle) - 1)
        ));
    }
    pathGeometry.setFromPoints(points);

    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2, transparent: true, opacity: 0.7 });
    flightPath = new THREE.Line(pathGeometry, pathMaterial);
    flightPath.visible = pathEnabled;
    scene.add(flightPath);

    // Add flight path toggle to controls UI
    const controlsDiv = document.getElementById('controls');
    const pathControl = document.createElement('div');
    pathControl.className = 'control-item';
    pathControl.textContent = 'P: Toggle flight path';
    controlsDiv.appendChild(pathControl);

    // Keyboard control for path toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyP') {
            pathEnabled = !pathEnabled;
            flightPath.visible = pathEnabled;
        }
    });

    console.log("Flight path initialized");
}

function updateFlightPath() {
    // No dynamic updates needed; path is static but visibility toggles
    flightPath.visible = pathEnabled && flightActive;
}