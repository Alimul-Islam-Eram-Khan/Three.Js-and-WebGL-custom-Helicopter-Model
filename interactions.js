// interactions.js
let interactionEnabled = true;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let selectedObject = null;

function initInteractions() {
    // Add interaction info to HUD
    const infoDiv = document.getElementById('info');
    const interactionInfo = document.createElement('div');
    interactionInfo.id = 'interactionInfo';
    interactionInfo.style.display = 'none';
    interactionInfo.textContent = 'Selected: None';
    infoDiv.appendChild(interactionInfo);

    // Add interaction toggle to controls UI
    const controlsDiv = document.getElementById('controls');
    const interactionControl = document.createElement('div');
    interactionControl.className = 'control-item';
    interactionControl.textContent = 'I: Toggle interaction mode';
    controlsDiv.appendChild(interactionControl);

    // Mouse click for object selection
    document.addEventListener('mousedown', (event) => {
        if (!interactionEnabled) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (selectedObject) {
            selectedObject.traverse((child) => {
                if (child.material && child.material.emissive) {
                    child.material.emissive.set(0x000000);
                }
            });
            selectedObject = null;
            interactionInfo.textContent = 'Selected: None';
        }

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            const parent = obj.parent.isGroup ? obj.parent : obj;
            if (parent.geometry instanceof THREE.BoxGeometry || parent.children.some(c => c.geometry instanceof THREE.ConeGeometry)) {
                selectedObject = parent;
                selectedObject.traverse((child) => {
                    if (child.material && child.material.emissive) {
                        child.material.emissive.set(0xffff00); // Yellow glow
                    }
                });
                interactionInfo.textContent = `Selected: ${parent.geometry instanceof THREE.BoxGeometry ? 'Building' : 'Tree'}`;
                interactionInfo.style.display = 'block';
            }
        }
    });

    // Keyboard control for interaction toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyI') {
            interactionEnabled = !interactionEnabled;
            interactionInfo.style.display = interactionEnabled && selectedObject ? 'block' : 'none';
        }
    });

    console.log("Interactions initialized");
}

function updateInteractions() {
    // No dynamic updates needed; handled by mouse events
}