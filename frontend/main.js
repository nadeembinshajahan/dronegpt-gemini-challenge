import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// DroneGPT - Three.js Drone Simulation
// ============================================

class DroneSimulation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.drone = null;
        this.droneCamera = null;
        this.droneCameraRenderer = null;
        
        // Drone state
        this.dronePosition = new THREE.Vector3(0, 5, 0);
        this.droneRotation = new THREE.Euler(0, 0, 0);
        this.droneVelocity = new THREE.Vector3(0, 0, 0);
        this.targetPosition = new THREE.Vector3(0, 5, 0);
        
        // Commands queue
        this.commandQueue = [];
        this.isExecutingCommand = false;
        
        this.init();
        this.createScene();
        this.createDrone();
        this.setupDroneCamera();
        this.animate();
        
        // Hide loading after init
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 1500);
    }
    
    init() {
        // Main scene camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(20, 15, 20);
        this.camera.lookAt(0, 5, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 150);
        
        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.1;
        
        // Resize handler
        window.addEventListener('resize', () => this.onResize());
    }
    
    createScene() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x404060, 0.5);
        this.scene.add(ambient);
        
        // Main directional light (sun)
        const sun = new THREE.DirectionalLight(0xffffff, 1.5);
        sun.position.set(50, 100, 50);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        sun.shadow.camera.near = 10;
        sun.shadow.camera.far = 200;
        sun.shadow.camera.left = -50;
        sun.shadow.camera.right = 50;
        sun.shadow.camera.top = 50;
        sun.shadow.camera.bottom = -50;
        this.scene.add(sun);
        
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a4a3a,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Grid
        const grid = new THREE.GridHelper(100, 50, 0x00ff88, 0x004422);
        grid.position.y = 0.01;
        this.scene.add(grid);
        
        // Buildings (obstacles)
        this.createBuildings();
        
        // Trees
        this.createTrees();
        
        // Landing pad
        this.createLandingPad();
    }
    
    createBuildings() {
        const buildingPositions = [
            { x: -15, z: -15, w: 8, h: 12, d: 8 },
            { x: 20, z: -10, w: 6, h: 18, d: 6 },
            { x: -20, z: 15, w: 10, h: 8, d: 10 },
            { x: 15, z: 20, w: 7, h: 15, d: 7 },
            { x: 30, z: 5, w: 5, h: 10, d: 5 },
        ];
        
        buildingPositions.forEach(b => {
            const geometry = new THREE.BoxGeometry(b.w, b.h, b.d);
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x334455,
                roughness: 0.7,
                metalness: 0.3
            });
            const building = new THREE.Mesh(geometry, material);
            building.position.set(b.x, b.h / 2, b.z);
            building.castShadow = true;
            building.receiveShadow = true;
            building.userData.type = 'building';
            building.userData.name = `Building at (${b.x}, ${b.z})`;
            this.scene.add(building);
            
            // Windows
            this.addWindows(building, b.w, b.h, b.d);
        });
    }
    
    addWindows(building, w, h, d) {
        const windowGeometry = new THREE.PlaneGeometry(1, 1.5);
        const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff88,
            transparent: true,
            opacity: 0.8
        });
        
        const spacing = 3;
        for (let y = 2; y < h - 2; y += spacing) {
            for (let x = -w/2 + 2; x < w/2 - 1; x += spacing) {
                // Front
                const win1 = new THREE.Mesh(windowGeometry, windowMaterial);
                win1.position.set(x, y - h/2, d/2 + 0.01);
                building.add(win1);
                // Back
                const win2 = new THREE.Mesh(windowGeometry, windowMaterial);
                win2.position.set(x, y - h/2, -d/2 - 0.01);
                win2.rotation.y = Math.PI;
                building.add(win2);
            }
        }
    }
    
    createTrees() {
        const treePositions = [
            { x: -30, z: 0 }, { x: -25, z: 25 }, { x: 0, z: 30 },
            { x: 25, z: -25 }, { x: 35, z: 15 }, { x: -10, z: -30 },
        ];
        
        treePositions.forEach(pos => {
            // Trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
            const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3520 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.set(pos.x, 2, pos.z);
            trunk.castShadow = true;
            this.scene.add(trunk);
            
            // Foliage
            const foliageGeometry = new THREE.ConeGeometry(3, 6, 8);
            const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228833 });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.set(pos.x, 7, pos.z);
            foliage.castShadow = true;
            foliage.userData.type = 'tree';
            this.scene.add(foliage);
        });
    }
    
    createLandingPad() {
        const padGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
        const padMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const pad = new THREE.Mesh(padGeometry, padMaterial);
        pad.position.set(0, 0.1, 0);
        pad.receiveShadow = true;
        this.scene.add(pad);
        
        // H marking
        const hGeometry = new THREE.PlaneGeometry(2, 0.4);
        const hMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const h1 = new THREE.Mesh(hGeometry, hMaterial);
        h1.rotation.x = -Math.PI / 2;
        h1.position.set(0, 0.21, 0);
        this.scene.add(h1);
        const h2 = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2), hMaterial);
        h2.rotation.x = -Math.PI / 2;
        h2.position.set(0, 0.21, 0);
        this.scene.add(h2);
    }
    
    createDrone() {
        this.drone = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(1, 0.3, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            roughness: 0.3,
            metalness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.drone.add(body);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(2.5, 0.1, 0.15);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const arm1 = new THREE.Mesh(armGeometry, armMaterial);
        arm1.rotation.y = Math.PI / 4;
        this.drone.add(arm1);
        const arm2 = new THREE.Mesh(armGeometry, armMaterial);
        arm2.rotation.y = -Math.PI / 4;
        this.drone.add(arm2);
        
        // Motors & Propellers
        const motorPositions = [
            { x: 0.9, z: 0.9 }, { x: -0.9, z: 0.9 },
            { x: 0.9, z: -0.9 }, { x: -0.9, z: -0.9 }
        ];
        
        this.propellers = [];
        motorPositions.forEach(pos => {
            const motorGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
            const motorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
            const motor = new THREE.Mesh(motorGeometry, motorMaterial);
            motor.position.set(pos.x, 0.15, pos.z);
            this.drone.add(motor);
            
            const propGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.1);
            const propMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
            const prop = new THREE.Mesh(propGeometry, propMaterial);
            prop.position.set(pos.x, 0.3, pos.z);
            this.drone.add(prop);
            this.propellers.push(prop);
        });
        
        // Camera mount
        const camMountGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
        const camMountMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const camMount = new THREE.Mesh(camMountGeometry, camMountMaterial);
        camMount.position.set(0, -0.25, 0.3);
        this.drone.add(camMount);
        
        // LED light
        const ledGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const ledMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.droneLED = new THREE.Mesh(ledGeometry, ledMaterial);
        this.droneLED.position.set(0, 0.2, 0.5);
        this.drone.add(this.droneLED);
        
        this.drone.position.copy(this.dronePosition);
        this.drone.castShadow = true;
        this.scene.add(this.drone);
    }
    
    setupDroneCamera() {
        // Drone's FPV camera
        this.droneCamera = new THREE.PerspectiveCamera(90, 320/180, 0.1, 500);
        this.drone.add(this.droneCamera);
        this.droneCamera.position.set(0, -0.1, 0.4);
        this.droneCamera.rotation.x = -0.2;
        
        // Renderer for drone camera feed
        const feedContainer = document.getElementById('camera-feed');
        this.droneCameraRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.droneCameraRenderer.setSize(320, 180);
        feedContainer.appendChild(this.droneCameraRenderer.domElement);
    }
    
    // ============================================
    // DRONE COMMANDS (Called by Gemini)
    // ============================================
    
    executeCommand(command) {
        console.log('Executing command:', command);
        this.commandQueue.push(command);
        this.processCommandQueue();
    }
    
    processCommandQueue() {
        if (this.isExecutingCommand || this.commandQueue.length === 0) return;
        
        this.isExecutingCommand = true;
        const command = this.commandQueue.shift();
        
        const actions = {
            'forward': () => this.moveDrone(0, 0, -5),
            'backward': () => this.moveDrone(0, 0, 5),
            'left': () => this.moveDrone(-5, 0, 0),
            'right': () => this.moveDrone(5, 0, 0),
            'up': () => this.moveDrone(0, 3, 0),
            'down': () => this.moveDrone(0, -3, 0),
            'rotate_left': () => this.rotateDrone(Math.PI / 4),
            'rotate_right': () => this.rotateDrone(-Math.PI / 4),
            'land': () => this.land(),
            'takeoff': () => this.takeoff(),
        };
        
        const action = actions[command.action];
        if (action) {
            action();
        }
        
        // Command complete after animation
        setTimeout(() => {
            this.isExecutingCommand = false;
            this.processCommandQueue();
        }, 1000);
    }
    
    moveDrone(dx, dy, dz) {
        this.targetPosition.x += dx;
        this.targetPosition.y = Math.max(1, Math.min(30, this.targetPosition.y + dy));
        this.targetPosition.z += dz;
        document.getElementById('status').textContent = 'Moving...';
    }
    
    rotateDrone(angle) {
        this.droneRotation.y += angle;
        document.getElementById('status').textContent = 'Rotating...';
    }
    
    land() {
        this.targetPosition.y = 0.5;
        document.getElementById('status').textContent = 'Landing...';
    }
    
    takeoff() {
        this.targetPosition.y = 5;
        document.getElementById('status').textContent = 'Taking off...';
    }
    
    // Get scene description for Gemini
    getSceneDescription() {
        const pos = this.drone.position;
        const objects = [];
        
        this.scene.traverse((obj) => {
            if (obj.userData.type) {
                const distance = pos.distanceTo(obj.position);
                if (distance < 30) {
                    objects.push({
                        type: obj.userData.type,
                        name: obj.userData.name || obj.userData.type,
                        distance: distance.toFixed(1),
                        direction: this.getDirection(pos, obj.position)
                    });
                }
            }
        });
        
        return {
            altitude: pos.y.toFixed(1),
            position: { x: pos.x.toFixed(1), y: pos.y.toFixed(1), z: pos.z.toFixed(1) },
            nearbyObjects: objects
        };
    }
    
    getDirection(from, to) {
        const dx = to.x - from.x;
        const dz = to.z - from.z;
        const angle = Math.atan2(dx, dz) * 180 / Math.PI;
        if (angle > -45 && angle <= 45) return 'ahead';
        if (angle > 45 && angle <= 135) return 'to the right';
        if (angle > -135 && angle <= -45) return 'to the left';
        return 'behind';
    }
    
    // Get drone camera frame as base64
    getDroneCameraFrame() {
        return this.droneCameraRenderer.domElement.toDataURL('image/jpeg', 0.7);
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth drone movement
        this.drone.position.lerp(this.targetPosition, 0.05);
        this.drone.rotation.y += (this.droneRotation.y - this.drone.rotation.y) * 0.1;
        
        // Propeller spin
        this.propellers.forEach(prop => {
            prop.rotation.y += 0.5;
        });
        
        // Hover bob - very subtle
        const bob = Math.sin(Date.now() * 0.002) * 0.01;
        this.drone.position.y += bob;
        
        // Update HUD
        document.getElementById('altitude').textContent = this.drone.position.y.toFixed(1) + 'm';
        
        // LED blink
        this.droneLED.material.color.setHex(
            Math.sin(Date.now() * 0.01) > 0 ? 0x00ff00 : 0x003300
        );
        
        // Update status
        const dist = this.drone.position.distanceTo(this.targetPosition);
        if (dist < 0.1 && document.getElementById('status').textContent !== 'Ready') {
            document.getElementById('status').textContent = 'Ready';
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.droneCameraRenderer.render(this.scene, this.droneCamera);
    }
}

// ============================================
// Voice Control with Gemini Live API
// ============================================

class GeminiVoiceController {
    constructor(droneSimulation) {
        this.drone = droneSimulation;
        this.isListening = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.websocket = null;
        
        this.setupMicButton();
        this.connectWebSocket();
    }
    
    setupMicButton() {
        const btn = document.getElementById('mic-btn');
        btn.addEventListener('click', () => this.toggleListening());
    }
    
    async toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            await this.startListening();
        }
    }
    
    async startListening() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (e) => {
                this.audioChunks.push(e.data);
            };
            
            this.mediaRecorder.onstop = () => {
                this.processAudio();
            };
            
            this.mediaRecorder.start();
            this.isListening = true;
            document.getElementById('mic-btn').classList.add('active');
            document.getElementById('transcript').innerHTML = '<span class="user">Listening...</span>';
            
            // Auto-stop after 10 seconds
            setTimeout(() => {
                if (this.isListening) this.stopListening();
            }, 10000);
            
        } catch (err) {
            console.error('Mic error:', err);
            document.getElementById('transcript').textContent = 'Microphone access denied';
        }
    }
    
    stopListening() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        this.isListening = false;
        document.getElementById('mic-btn').classList.remove('active');
    }
    
    async processAudio() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Get drone camera frame
        const cameraFrame = this.drone.getDroneCameraFrame();
        
        // Get scene description
        const sceneInfo = this.drone.getSceneDescription();
        
        document.getElementById('transcript').innerHTML = '<span class="user">Processing...</span>';
        
        // Send to backend
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            const reader = new FileReader();
            reader.onload = () => {
                this.websocket.send(JSON.stringify({
                    type: 'voice_command',
                    audio: reader.result,
                    cameraFrame: cameraFrame,
                    sceneInfo: sceneInfo
                }));
            };
            reader.readAsDataURL(audioBlob);
        } else {
            // Fallback: simulate response
            this.simulateResponse();
        }
    }
    
    connectWebSocket() {
        // Connect to backend (Cloud Run)
        const wsUrl = window.location.hostname === 'localhost' 
            ? 'ws://localhost:8080/ws'
            : `wss://${window.location.host}/ws`;
        
        try {
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleResponse(data);
            };
            
            this.websocket.onerror = () => {
                console.log('WebSocket not available, using simulation mode');
            };
        } catch (e) {
            console.log('Running in demo mode');
        }
    }
    
    handleResponse(data) {
        // Display AI response
        document.getElementById('transcript').innerHTML = 
            `<span class="ai">${data.text}</span>`;
        
        // Execute drone commands
        if (data.commands) {
            data.commands.forEach(cmd => {
                this.drone.executeCommand(cmd);
            });
        }
        
        // Play audio response (TTS)
        if (data.audio) {
            const audio = new Audio(data.audio);
            audio.play();
        }
    }
    
    // Demo mode - simulate AI responses
    simulateResponse() {
        const responses = [
            { text: "Moving forward. I can see a tall building ahead.", commands: [{ action: 'forward' }] },
            { text: "Climbing to get a better view.", commands: [{ action: 'up' }] },
            { text: "Turning left to scan the area.", commands: [{ action: 'rotate_left' }] },
            { text: "I see trees to my left and buildings to my right.", commands: [] },
            { text: "Descending for a closer look.", commands: [{ action: 'down' }] },
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        setTimeout(() => {
            this.handleResponse(response);
        }, 1000);
    }
}

// ============================================
// Initialize
// ============================================

const drone = new DroneSimulation();
const voiceController = new GeminiVoiceController(drone);

// Expose for debugging
window.drone = drone;
window.voiceController = voiceController;

// Demo commands via keyboard
document.addEventListener('keydown', (e) => {
    const commands = {
        'ArrowUp': 'forward',
        'ArrowDown': 'backward',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'PageUp': 'up',
        'PageDown': 'down',
        'q': 'rotate_left',
        'e': 'rotate_right',
        'l': 'land',
        't': 'takeoff',
    };
    
    if (commands[e.key]) {
        drone.executeCommand({ action: commands[e.key] });
    }
});

console.log('🚁 DroneGPT initialized');
console.log('Use arrow keys to control drone, or click mic to speak');
