const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec3 lightPosition;
    uniform vec3 lightColor;
    uniform vec3 ambientColor;
    uniform float metallic;
    uniform float roughness;
    uniform vec3 baseColor;
    uniform float time;
    uniform float noiseScale;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    // Simple noise function
    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(lightPosition - vWorldPosition);
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 halfDir = normalize(lightDir + viewDir);
        
        // Diffuse lighting
        float diff = max(dot(normal, lightDir), 0.0);
        
        // Specular lighting (Blinn-Phong)
        float spec = pow(max(dot(normal, halfDir), 0.0), 32.0 * (1.0 - roughness));
        
        // Fresnel effect
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);
        
        // Procedural texture with noise
        float n = noise(vUv * noiseScale + time * 0.1);
        vec3 texColor = baseColor + n * 0.1;
        
        // Combine lighting
        vec3 ambient = ambientColor * texColor;
        vec3 diffuse = lightColor * diff * texColor;
        vec3 specular = lightColor * spec * mix(vec3(0.04), texColor, metallic);
        
        // Add metallic reflection
        vec3 reflection = mix(diffuse, specular, metallic);
        
        // Final color with fresnel and noise
        vec3 finalColor = ambient + reflection + fresnel * lightColor * 0.1;
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

const skyVertexShader = `
    varying vec3 vWorldPosition;
    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const skyFragmentShader = `
    uniform float time;
    uniform float noiseScale;
    uniform float isNight;
    varying vec3 vWorldPosition;
    
    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    void main() {
        vec3 direction = normalize(vWorldPosition);
        float elevation = direction.y;
        
        vec3 dayColor = mix(
            vec3(0.1, 0.3, 0.6),
            vec3(0.05, 0.1, 0.3),
            elevation
        );
        
        vec3 nightColor = mix(
            vec3(0.0, 0.0, 0.1),
            vec3(0.0, 0.0, 0.0),
            elevation
        );
        
        vec3 skyColor = mix(dayColor, nightColor, isNight);
        
        float n = noise(direction.xz * noiseScale + time * 0.1);
        skyColor += vec3(n * 0.2 * (1.0 - isNight)); // Less noise at night for stars effect
        
        if (isNight > 0.5) {
            skyColor += vec3(n * 0.5); // Add twinkling stars effect in noise
        }
        
        gl_FragColor = vec4(skyColor, 1.0);
    }
`;