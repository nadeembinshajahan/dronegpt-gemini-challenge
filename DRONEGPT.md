# DroneGPT — AI with a Body

> *"Fly higher." "Scout the perimeter." "What do you see?"*
> 
> DroneGPT is a voice-controlled autonomous drone simulator powered by Google's Gemini 2.0 Live API. It bridges the gap between natural language and robotic action — giving AI a physical presence in 3D space.

---

## 🎯 The Vision

**The Problem:** Today's drones require specialized training, complex interfaces, and precise manual control. Operators need to learn waypoint programming, understand flight modes, and interpret sensor data. This creates a barrier between human intent and robotic action.

**Our Solution:** DroneGPT lets you *talk* to a drone like you'd talk to a colleague. Say what you want to happen, and the AI figures out how to make it happen. No joysticks. No waypoints. Just natural conversation.

This is **Physical AI** — artificial intelligence that doesn't just process information, but acts in the world.

---

## 🚁 What It Does

### Voice-First Control
- **Real-time speech recognition** via Gemini 2.0 Live API
- **Conversational commands:** "Go forward slowly," "Turn around and hover," "Fly to the red container"
- **Context-aware responses:** The AI remembers what you asked and builds on previous commands

### Spatial Understanding
- **Environment awareness:** Gemini analyzes the 3D scene and understands spatial relationships
- **Object recognition:** "Fly toward the building on the left" — the AI knows what "left" means
- **Situational descriptions:** Ask "What do you see?" and get a detailed scene analysis

### Multi-Robot Support
- 🚁 **Quadcopter** — Full 3D flight with realistic physics
- 🤿 **Submarine ROV** — Underwater exploration with buoyancy simulation
- 🚗 **Ground Rover** — Wheeled navigation with terrain constraints
- 🐕 **Robot Dog** — Quadruped locomotion with gait animation

### Photorealistic Environments
- **World Labs 3D scenes** — AI-generated environments with realistic geometry
- **HDRI lighting** — Photorealistic skyboxes and image-based illumination
- **Multiple locations:** Urban cityscapes, industrial facilities, natural terrain

---

## 🧠 How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Voice Input │  │  3D Scene   │  │  Telemetry Dashboard   │  │
│  │ (WebRTC)    │  │ (Three.js)  │  │  (Position, Speed, Alt) │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────────────────┬─┘  │
└─────────┼────────────────┼─────────────────────────────────┼────┘
          │                │                                 │
          ▼                ▼                                 ▲
┌─────────────────────────────────────────────────────────────────┐
│                      GEMINI LIVE API                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Multimodal Understanding                                │   │
│  │  • Speech → Text transcription                           │   │
│  │  • Natural language → Intent extraction                  │   │
│  │  • Scene analysis → Spatial reasoning                    │   │
│  │  • Context memory → Conversational continuity            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Command Translation                                     │   │
│  │  • "Fly higher" → { action: "ascend", magnitude: 1.0 }   │   │
│  │  • "Turn left slowly" → { action: "yaw", rate: -0.3 }    │   │
│  │  • "What's that?" → { action: "describe", target: scene }│   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PHYSICS ENGINE                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Realistic Drone Simulation                              │   │
│  │  • Acceleration-based movement (not instant velocity)    │   │
│  │  • Gravity + auto-hover compensation                     │   │
│  │  • Quadratic air drag                                    │   │
│  │  • Tilt stabilization (pitch/roll from velocity)         │   │
│  │  • Yaw momentum with rotational drag                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **AI Model** | Gemini 2.0 Flash Live (multimodal, real-time) |
| **Frontend** | Three.js (WebGL 3D rendering) |
| **Audio** | WebRTC / Web Audio API |
| **Environments** | World Labs GLB exports + Polyhaven HDRI |
| **Backend** | Node.js (WebSocket relay) |
| **Deployment** | Google Cloud Run + Cloudflare Tunnel |

---

## 🎮 Controls

### Voice Commands (Primary)
| Say This | Drone Does |
|----------|------------|
| "Fly higher" / "Go up" | Ascend |
| "Land" / "Come down" | Descend |
| "Go forward" / "Move ahead" | Fly forward |
| "Turn left" / "Turn right" | Rotate yaw |
| "Stop" / "Hover" | Hold position |
| "What do you see?" | Describe surroundings |
| "Go to the [object]" | Navigate to target |

### Keyboard (Backup)
| Key | Action |
|-----|--------|
| W/S | Forward / Back |
| A/D | Strafe Left / Right |
| Q/E | Ascend / Descend |
| ←/→ | Turn Left / Right |

### Mobile
- **Left joystick:** Movement
- **Right joystick:** Camera / Rotation
- **Buttons:** Up / Down thrust

---

## 🌍 Environments

### World Labs AI-Generated Scenes
1. **London City** — Urban streets with buildings, vehicles, street furniture
2. **Industrial Zone** — Warehouses, containers, machinery, infrastructure

### HDRI Skyboxes
- Photorealistic sky lighting from Polyhaven
- Dynamic environment mapping for reflections
- Atmospheric depth with exponential fog

---

## 🔬 The Science: Physical AI

DroneGPT is a proof-of-concept for **Physical AI** — the emerging field where AI systems don't just process information, but take action in physical (or simulated) environments.

### Why This Matters

**Traditional AI:**
```
Input → Model → Output (text/image)
```

**Physical AI:**
```
Intent → Model → Action → Feedback → Refined Action
```

The key difference is the **closed loop**. Physical AI must:
1. Understand spatial relationships ("left of," "above," "near")
2. Plan multi-step actions ("fly to X, then scan, then return")
3. React to environmental feedback (obstacles, wind, battery)
4. Maintain context across time (remember where it's been)

DroneGPT demonstrates all four capabilities using Gemini's multimodal reasoning.

### From Simulation to Reality

This architecture directly maps to real-world drone systems:

| Simulation | Real World |
|------------|------------|
| Three.js physics | PX4/ArduPilot flight controller |
| Voice WebSocket | MAVLink/ROS2 command interface |
| Gemini analysis | Onboard VLM (edge deployment) |
| GLB environments | LiDAR/camera SLAM mapping |

The same "intent → action" pipeline we demonstrate here is what SF Autonomy is building for GPS-denied autonomous drones.

---

## 🚀 Future Roadmap

### Near-term
- [ ] Multi-drone swarm coordination ("Send two drones to flank the building")
- [ ] Waypoint memory ("Remember this spot as Home")
- [ ] Obstacle avoidance with visual feedback
- [ ] Mission recording and replay

### Long-term Vision
- **Edge deployment:** Run Gemini-class models on Jetson/Qualcomm for real drones
- **Real hardware integration:** MAVLink bridge to PX4 flight controllers
- **Multi-modal sensing:** Thermal, LiDAR, multispectral camera support
- **Autonomous missions:** "Inspect the solar farm and report anomalies"

---

## 👥 Team

**Stratofirma Autonomy Labs (SF Autonomy)**
- Building the future of autonomous drones with Physical AI
- Focus: GPS-denied navigation, confined space operations, defense/enterprise

**Nadeem M Shajahan** — CEO
- Created perception systems deployed with Indian Army, Navy, Air Force
- Core team member, Mehar Baba Prize (IAF swarm drone competition)
- Expertise: VLMs, edge AI, perception systems

**Thomas Kuruvila** — CTO  
- Former CTO at Andromeida Maritime (underwater drones)
- ROSCon and Viva Tech presenter
- Expertise: ROS2, robotics systems, embedded development

---

## 🔗 Links

- **Live Demo:** https://hood-freely-routers-bench.trycloudflare.com
- **GitHub:** https://github.com/nadeembinshajahan/dronegpt-gemini-challenge
- **Company:** https://sfautonomy.com (coming soon)

---

## 📜 License

MIT License — Built for the Gemini Live Agent Challenge 2026

---

*"The best interface is no interface. Just say what you want."*
