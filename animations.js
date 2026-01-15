let frameCount = 0;
let lastTime = 0;
let lastAnimationEnabled = false;
let lastDayNight = 'day';
let rotorSound = document.getElementById('rotorSound');

function animate(currentTime) {
    requestAnimationFrame(animate);

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Update FPS
    frameCount++;
    if (frameCount % 60 === 0) {
        const fps = Math.round(1000 / (deltaTime || 16.67));
        document.getElementById('fps').textContent = fps;
    }

    handleInput();

    // Animate rotors and sound
    if (animationEnabled) {
        if (rotorMain) {
            rotorMain.rotation.y += 0.3;
        }
        if (rotorTail) {
            rotorTail.rotation.x += 0.5;
        }
        if (!lastAnimationEnabled) {
            rotorSound.play();
        }
    } else {
        if (lastAnimationEnabled) {
            rotorSound.pause();
        }
    }
    lastAnimationEnabled = animationEnabled;

    // Helicopter flight loop
    if (flightActive) {
        flightProgress += 0.005;
        if (flightProgress > 1) {
            flightActive = false;
            flightProgress = 0;
            helicopter.position.copy(originalHeliPosition);
        } else {
            const angle = 2 * Math.PI * flightProgress;
            helicopter.position.x = 10 * Math.sin(angle);
            helicopter.position.z = 10 * (Math.cos(angle) - 1);
            helicopter.position.y = originalHeliPosition.y + Math.sin(angle) * 2; // Slight height variation
        }
        if (cameraFollow) {
            updateCameraPosition();
        }
    }

    // Update day/night
    if (dayNight !== lastDayNight) {
        if (dayNight === 'day') {
            light.color.set(0xffffff);
            scene.fog.color.set(0x1e3c72);
            renderer.setClearColor(0x1e3c72, 1);
            sunMesh.visible = true;
            moonMesh.visible = false;
            stars.visible = false;
        } else {
            light.color.set(0xaaaaFF);
            scene.fog.color.set(0x000022);
            renderer.setClearColor(0x000022, 1);
            sunMesh.visible = false;
            moonMesh.visible = true;
            stars.visible = true;
        }
        // Update ambient in materials
        scene.traverse((child) => {
            if (child.material && child.material.uniforms && child.material.uniforms.ambientColor) {
                child.material.uniforms.ambientColor.value = dayNight === 'day' ? new THREE.Color(0x404040) : new THREE.Color(0x101010);
            }
        });
        lastDayNight = dayNight;
    }

    // Update sun/moon positions
    sunMesh.position.copy(light.position);
    moonMesh.position.set(-light.position.x, light.position.y, -light.position.z);

    // Update shader uniforms
    const time = currentTime * 0.001;
    if (helicopter) {
        helicopter.traverse((child) => {
            if (child.material && child.material.uniforms) {
                child.material.uniforms.time.value = time;
                child.material.uniforms.lightPosition.value = light.position;
            }
            if (child.geometry && child.geometry.attributes.velocity) {
                const positions = child.geometry.attributes.position.array;
                const velocities = child.geometry.attributes.velocity.array;
                for (let i = 0; i < positions.length / 3; i++) {
                    positions[i * 3] += velocities[i * 3];
                    positions[i * 3 + 1] += velocities[i * 3 + 1];
                    positions[i * 3 + 2] += velocities[i * 3 + 2];
                    if (positions[i * 3] < -6) {
                        positions[i * 3] = -4;
                        positions[i * 3 + 1] = 0;
                        positions[i * 3 + 2] = 0;
                    }
                }
                child.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    // Update environment shaders
    scene.traverse((child) => {
        if (child.material && child.material.uniforms && child.material.uniforms.time) {
            child.material.uniforms.time.value = time;
            if (child.material.uniforms.isNight) {
                child.material.uniforms.isNight.value = dayNight === 'night' ? 1.0 : 0.0;
            }
        }
    });

    // Helicopter hovering animation
    if (helicopter && animationEnabled && !flightActive) {
        helicopter.position.y = 3 + Math.sin(time * 2) * 0.2;
        helicopter.rotation.x = Math.sin(time * 1.5) * 0.02;
        helicopter.rotation.z = Math.cos(time * 1.8) * 0.03;
    }

    renderer.render(scene, camera);
}