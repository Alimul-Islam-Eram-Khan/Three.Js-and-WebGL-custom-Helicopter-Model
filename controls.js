let mouseX = 0, mouseY = 0;
let cameraAngle = 0, cameraRadius = 15, cameraHeight = 5;
let animationEnabled = true;
let lightRotationSpeed = 0.01;
const keys = {
    w: false, a: false, s: false, d: false,
    up: false, down: false, space: false, shift: false,
    n: false, c: false
};

function setupControls() {
    // Mouse move for light control
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        const lightRadius = 15;
        const lightAngle = mouseX * Math.PI * 2;
        const lightHeight = mouseY * 10 + 10;

        light.position.set(
            Math.cos(lightAngle) * lightRadius,
            lightHeight,
            Math.sin(lightAngle) * lightRadius
        );

        document.getElementById('lightAngle').textContent = Math.round(lightAngle * 180 / Math.PI) + '°';
    });

    // Mouse click for flight
    document.addEventListener('click', () => {
        if (!flightActive) {
            flightActive = true;
            flightProgress = 0;
        }
    });

    // Mouse wheel for zoom
    document.addEventListener('wheel', (event) => {
        cameraRadius += event.deltaY * 0.01;
        cameraRadius = Math.max(5, Math.min(30, cameraRadius));
        document.getElementById('cameraZoom').textContent = Math.round(cameraRadius);
        updateCameraPosition();
    });

    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        switch(event.code) {
            case 'KeyW': keys.w = true; break;
            case 'KeyA': keys.a = true; break;
            case 'KeyS': keys.s = true; break;
            case 'KeyD': keys.d = true; break;
            case 'ArrowUp': keys.up = true; break;
            case 'ArrowDown': keys.down = true; break;
            case 'Space': 
                if (!keys.space) {
                    animationEnabled = !animationEnabled;
                    keys.space = true;
                }
                event.preventDefault();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                if (!keys.shift) {
                    lightRotationSpeed = lightRotationSpeed === 0.01 ? 0.05 : 0.01;
                    keys.shift = true;
                }
                break;
            case 'KeyN':
                if (!keys.n) {
                    dayNight = dayNight === 'day' ? 'night' : 'day';
                    updateDayNightUI();
                    keys.n = true;
                }
                break;
            case 'KeyC':
                if (!keys.c) {
                    cameraFollow = !cameraFollow;
                    keys.c = true;
                }
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch(event.code) {
            case 'KeyW': keys.w = false; break;
            case 'KeyA': keys.a = false; break;
            case 'KeyS': keys.s = false; break;
            case 'KeyD': keys.d = false; break;
            case 'ArrowUp': keys.up = false; break;
            case 'ArrowDown': keys.down = false; break;
            case 'Space': keys.space = false; break;
            case 'ShiftLeft':
            case 'ShiftRight': keys.shift = false; break;
            case 'KeyN': keys.n = false; break;
            case 'KeyC': keys.c = false; break;
        }
    });

    window.addEventListener('resize', onWindowResize);
}

function updateCameraPosition() {
    const x = Math.cos(cameraAngle) * cameraRadius;
    const z = Math.sin(cameraAngle) * cameraRadius;

    camera.position.set(x, cameraHeight, z);
    if (cameraFollow) {
        camera.lookAt(helicopter.position);
    } else {
        camera.lookAt(0, 3, 0);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleInput() {
    const speed = 0.02;

    if (keys.a) cameraAngle -= speed;
    if (keys.d) cameraAngle += speed;
    if (keys.w && cameraRadius > 5) cameraRadius -= speed * 10;
    if (keys.s && cameraRadius < 30) cameraRadius += speed * 10;
    if (keys.up && cameraHeight < 15) cameraHeight += speed * 10;
    if (keys.down && cameraHeight > -5) cameraHeight -= speed * 10;

    updateCameraPosition();
}