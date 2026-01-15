# 🚁 3D Helicopter Visualization

## 📋 Project Overview
This project, titled **"3D Helicopter Visualization"**, was developed as the final project for **CSE4204 Computer Graphics Lab**. It delivers an immersive 3D helicopter simulation using **Three.js**, **WebGL**, and custom **GLSL shaders**, combining interactive controls, dynamic lighting, and realistic animations.

The visualization showcases a fully textured helicopter model, interactive camera and lighting controls, environmental elements, and multiple animations to create a visually stunning and engaging experience.

---

## 🎯 Project Requirements
1. **3D Objects**
   - Helicopter body with texture  
   - Helicopter wings (main and tail rotors) with texture  

2. **Keyboard Interaction**
   - Camera movement around the helicopter using **WASD** keys (horizontal navigation)  
   - Arrow keys for vertical adjustment  

3. **Mouse Interaction**
   - Light position rotation around the helicopter via mouse movement  
   - Mouse wheel for camera zoom  
   - Mouse click to initiate a flight loop  

4. **Animations**
   - Rotation of main and tail rotor blades  
   - Hovering animation  
   - Circular flight path animation  

5. **Core Technical Requirements**
   - Custom shaders (vertex & fragment)  
   - Dynamic lighting model with ambient effects  
   - Perspective projection for realistic 3D visualization  
   - Textures applied to all objects  
   - Animation for dynamic scene elements  
   - Mouse & keyboard interaction for user control  

6. **Additional Requirements**
   - Visually appealing, unique, plagiarism‑free design  
   - Emphasis on aesthetic quality  

---

## 🛠️ Software Platform
- **Three.js** – JavaScript library for 3D rendering in WebGL  
- **WebGL** – Browser‑based 3D graphics rendering  
- **GLSL** – Custom vertex & fragment shaders (`shaders.js`)  
- **HTML5/CSS3** – UI structure, HUD, styling (`index.html`, `styles.css`)  
- **JavaScript** – Interactivity, animations, scene management (`main.js`, `controls.js`, `animations.js`)  
- **Browser Environment** – Tested on Google Chrome with WebGL support  

---

## 🌟 Project Features

### 1. Helicopter Model with Textures
- Custom geometries: cylindrical body, spherical ends, semi‑spherical cockpit, tail boom, landing skids, rotors  
- Metallic reflections & noise‑based texturing via shaders  
- Realistic and aesthetically refined appearance  

### 2. Dynamic Lighting Model
- Directional light orbiting helicopter (sun/moon simulation)  
- Adjustable day/night colors  
- Point, ambient, fill, and spotlight illumination  
- Realistic shadows and transitions  

### 3. Perspective Projection
- **THREE.PerspectiveCamera** with orbital movement and zoom  
- Follow mode toggle (`C` key)  
- Natural depth perception  

### 4. Environment with Textured Objects
- Ground plane / procedural terrain (Perlin noise)  
- Buildings, trees, skybox, stars, clouds, helipad  
- Dynamic textures and shaders responsive to lighting  

### 5. Animations
- Rotor rotation (main & tail)  
- Hovering oscillation  
- Circular flight path (mouse click)  
- Cloud movement, tree sway, rain particles  
- Day/night transitions  

### 6. Mouse & Keyboard Interaction
- **Mouse**: light rotation, zoom, spotlight intensity, flight activation  
- **Keyboard**: WASD for camera, arrow keys for vertical movement, multiple toggles (`N` for night, `T` for terrain, `W` for wind, `R` for rain, `H` for HUD, `O` for spotlight)  

### 7. Heads‑Up Display (HUD)
- Displays speed, altitude, fuel, and mini‑map  
- Semi‑transparent design, toggle with `H` key  

### 8. Additional Features
- Exhaust particle system  
- Rotor sound effects  
- Loading screen & styled UI  
- Fog, sun/moon, procedural skybox  

---

## 📊 Feature Implementation Table

| SL No | Feature                                | Status       |
|-------|----------------------------------------|--------------|
| 1     | Helicopter Model with Textures         | Implemented  |
| 2     | Dynamic Lighting Model (incl. Spotlight)| Implemented |
| 3     | Perspective Projection                 | Implemented  |
| 4     | Environment with Textured Objects      | Implemented  |
| 5     | Rotor and Flight Animations            | Implemented  |
| 6     | Mouse and Keyboard Interaction         | Implemented  |
| 7     | Heads-Up Display (HUD) with Mini-Map   | Implemented  |
| 8     | Day/Night Cycle                        | Implemented  |
| 9     | Cloud System with Wind Animation       | Implemented  |
| 10    | Helipad with Procedural Texture        | Implemented  |
| 11    | Exhaust Particle System                | Implemented  |
| 12    | Rotor Sound Effects                    | Implemented  |
| 13    | Flight Path Visualization              | Implemented  |
| 14    | Dynamic Fog and Skybox                 | Implemented  |
| 15    | Shadow Casting                         | Implemented  |
| 16    | Wind Effects (Tree Sway, Rain Influence)| Implemented |
| 17    | Weather System (Rain Particles)        | Implemented  |
| 18    | Custom Shaders for All Materials       | Implemented  |
| 19    | UI Styling and Loading Screen          | Implemented  |

 
   ```bash
   git clone https://github.com/yourusername/3d-helicopter-visualization.git
   cd 3d-helicopter-visualization
