// hud.js
let hudEnabled = true;
let miniMapCamera, miniMapRenderer;

function initHUD() {
    // Add HUD elements to #info div
    const infoDiv = document.getElementById('info');
    const hudContainer = document.createElement('div');
    hudContainer.id = 'hud';
    hudContainer.style.marginTop = '10px';
    hudContainer.innerHTML = `
        <div>Speed: <span id="speed">0</span> km/h</div>
        <div>Altitude: <span id="altitude">3</span> m</div>
        <div>Fuel: <span id="fuel">100</span>%</div>
        <div><button id="toggleMiniMap">Show Mini-Map</button></div>
    `;
    infoDiv.appendChild(hudContainer);

    // Add mini-map container
    const miniMapContainer = document.createElement('div');
    miniMapContainer.id = 'miniMap';
    miniMapContainer.style.position = 'absolute';
    miniMapContainer.style.bottom = '150px';
    miniMapContainer.style.right = '20px';
    miniMapContainer.style.width = '200px';
    miniMapContainer.style.height = '200px';
    miniMapContainer.style.background = 'rgba(0, 0, 0, 0.7)';
    miniMapContainer.style.borderRadius = '10px';
    miniMapContainer.style.display = 'none';
    document.getElementById('container').appendChild(miniMapContainer);

    // Setup mini-map camera and renderer
    miniMapCamera = new THREE.OrthographicCamera(-20, 20, 20, -20, 0.1, 100);
    miniMapCamera.position.set(0, 50, 0);
    miniMapCamera.lookAt(0, 0, 0);

    miniMapRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    miniMapRenderer.setSize(200, 200);
    miniMapRenderer.setClearColor(0x000000, 0.5);
    miniMapContainer.appendChild(miniMapRenderer.domElement);

    // Toggle mini-map visibility
    document.getElementById('toggleMiniMap').addEventListener('click', () => {
        miniMapContainer.style.display = miniMapContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Add HUD toggle to controls
    const controlsDiv = document.getElementById('controls');
    const hudControl = document.createElement('div');
    hudControl.className = 'control-item';
    hudControl.textContent = 'H: Toggle HUD';
    controlsDiv.appendChild(hudControl);

    // Keyboard control for HUD toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyH') {
            hudEnabled = !hudEnabled;
            hudContainer.style.display = hudEnabled ? 'block' : 'none';
            miniMapContainer.style.display = hudEnabled && miniMapContainer.style.display !== 'none' ? 'block' : 'none';
        }
    });

    console.log("HUD initialized");
}

function updateHUD() {
    if (!hudEnabled) return;

    // Calculate helicopter stats
    let speed = 0;
    if (flightActive) {
        const angle = 2 * Math.PI * flightProgress;
        const dx = 10 * Math.cos(angle); // Derived from flight path in animations.js
        const dy = 2 * Math.cos(angle); // Height variation
        speed = Math.sqrt(dx * dx + dy * dy) * 10; // Approximate speed in km/h
    }
    const altitude = helicopter ? (helicopter.position.y - 0).toFixed(1) : 3; // Relative to ground
    const fuel = Math.max(0, 100 - flightProgress * 100).toFixed(0); // Simulated fuel consumption

    // Update HUD display
    document.getElementById('speed').textContent = speed.toFixed(1);
    document.getElementById('altitude').textContent = altitude;
    document.getElementById('fuel').textContent = fuel;

    // Update mini-map
    if (document.getElementById('miniMap').style.display === 'block') {
        miniMapCamera.position.x = helicopter ? helicopter.position.x : 0;
        miniMapCamera.position.z = helicopter ? helicopter.position.z : 0;
        miniMapRenderer.render(scene, miniMapCamera);
    }
}