// helipad.js
let helipadMesh, helipadEnabled = true;

function initHelipad() {
    // Create helipad geometry (circular platform)
    const helipadGeometry = new THREE.CircleGeometry(5, 32); // 5-unit radius
    helipadGeometry.rotateX(-Math.PI / 2); // Align with ground

    // Procedural texture for helipad
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // Background: dark gray with radial gradient
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, '#555555');
    gradient.addColorStop(1, '#333333');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    // White "H" marking
    context.fillStyle = '#ffffff';
    context.font = 'bold 150px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('H', 128, 128);

    // Outer ring
    context.strokeStyle = '#ffffff';
    context.lineWidth = 10;
    context.beginPath();
    context.arc(128, 128, 120, 0, Math.PI * 2);
    context.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    // Helipad material with slight emissive glow for night
    const helipadMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: light.position },
            lightColor: { value: new THREE.Color(0xffffff) },
            ambientColor: { value: new THREE.Color(0x404040) },
            baseColor: { value: new THREE.Color(0x555555) },
            emissiveColor: { value: new THREE.Color(0x222222) }, // Subtle glow
            textureMap: { value: texture },
            isNight: { value: dayNight === 'night' ? 1.0 : 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 lightPosition;
            uniform vec3 lightColor;
            uniform vec3 ambientColor;
            uniform vec3 baseColor;
            uniform vec3 emissiveColor;
            uniform sampler2D textureMap;
            uniform float isNight;
            varying vec2 vUv;
            void main() {
                vec4 texColor = texture2D(textureMap, vUv);
                vec3 color = texColor.rgb * baseColor;
                vec3 lighting = ambientColor + lightColor * max(0.0, dot(normalize(lightPosition), vec3(0, 1, 0)));
                vec3 finalColor = color * lighting + emissiveColor * isNight;
                gl_FragColor = vec4(finalColor, texColor.a);
            }
        `
    });

    helipadMesh = new THREE.Mesh(helipadGeometry, helipadMaterial);
    helipadMesh.position.set(0, 0.01, 0); // Slightly above ground to avoid z-fighting
    helipadMesh.receiveShadow = true;
    helipadMesh.visible = helipadEnabled;
    scene.add(helipadMesh);

    // Add helipad toggle to controls UI
    const controlsDiv = document.getElementById('controls');
    const helipadControl = document.createElement('div');
    helipadControl.className = 'control-item';
    helipadControl.textContent = 'J: Toggle helipad';
    controlsDiv.appendChild(helipadControl);

    // Keyboard control for helipad toggle
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyJ') {
            helipadEnabled = !helipadEnabled;
            helipadMesh.visible = helipadEnabled;
        }
    });

    console.log("Helipad initialized");
}

function updateHelipad(currentTime) {
    if (!helipadEnabled) return;
    helipadMesh.material.uniforms.lightPosition.value = light.position;
    helipadMesh.material.uniforms.isNight.value = dayNight === 'night' ? 1.0 : 0.0;
    helipadMesh.material.uniforms.ambientColor.value = dayNight === 'day' ? new THREE.Color(0x404040) : new THREE.Color(0x101010);
}