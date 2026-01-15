let scene, camera, renderer, helicopter, rotorMain, rotorTail, light;
let sunMesh, moonMesh, stars;
let dayNight = 'day';
let flightActive = false;
let flightProgress = 0;
let cameraFollow = false;
let originalHeliPosition = new THREE.Vector3(0, 3, 0);

function init() {
    console.log("Initializing Three.js scene...");

    try {
        // Create scene
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x1e3c72, 20, 100);

        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        updateCameraPosition();

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x1e3c72, 1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add renderer to DOM
        document.getElementById('container').appendChild(renderer.domElement);

        // Setup lighting
        setupLighting();

        // Create helicopter
        createHelicopter();

        // Create environment
        createEnvironment();

        // Setup controls
        setupControls();

        // Hide loading screen
        hideLoadingScreen();

        // Start animation
        animate();

        console.log("Initialization complete!");

    } catch (error) {
        console.error("Initialization error:", error);
        document.getElementById('loading').innerHTML = `
            <div style="color: red;">
                <h3>Error Loading 3D Scene</h3>
                <p>Please refresh the page and try again.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

function hideLoadingScreen() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('info').style.display = 'block';
    document.getElementById('controls').style.display = 'block';
    updateDayNightUI();
}

function setupLighting() {
    // Main directional light (sun)
    light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(10, 10, 5);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    light.shadow.camera.left = -20;
    light.shadow.camera.right = 20;
    light.shadow.camera.top = 20;
    light.shadow.camera.bottom = -20;
    scene.add(light);

    // Sun mesh
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 });
    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.copy(light.position);
    scene.add(sunMesh);

    // Moon mesh
    const moonGeometry = new THREE.SphereGeometry(2, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.6 });
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.visible = false;
    scene.add(moonMesh);

    // Point light for highlights
    const pointLight = new THREE.PointLight(0xffaa33, 0.5, 50);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x7ec8e3, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    console.log("Lighting setup complete");
}

function updateDayNightUI() {
    document.getElementById('dayNight').textContent = dayNight.charAt(0).toUpperCase() + dayNight.slice(1);
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(init, 100);
});