# DroneGPT Multi-Robot Simulator 🤖

**AI with a Body** — Control multiple robots through natural voice commands using Gemini Live API.

## 🎮 Live Demo
**URL:** https://hood-freely-routers-bench.trycloudflare.com

## 🚀 Features

### Multiple Robot Types
| Robot | Icon | Description | Environments |
|-------|------|-------------|--------------|
| **Quadcopter Drone** | 🚁 | Flying drone with 4 propellers | All environments |
| **AUV/ROV** | 🤿 | Underwater submarine robot | Ocean only |
| **Ground Rover** | 🚗 | Wheeled exploration vehicle | Land only |
| **Quadruped** | 🐕 | Four-legged robot dog | Land only |

### Environments
- 🏭 **Warehouse** — Industrial complex with containers and cranes
- 🏙️ **Night City** — Cyberpunk cityscape with glowing buildings
- 🌲 **Forest** — Dense woodland with trees and clearings
- 🏜️ **Desert** — Sand dunes, pyramids, and ancient ruins
- 🌊 **Ocean** — Oil platform with underwater exploration

### Physics System
Each robot has unique physics:
- **Drone:** Thrust, gravity, air drag, tilt-based movement
- **AUV:** Buoyancy, water resistance, 6DOF underwater
- **Rover:** Wheel physics, friction, suspension
- **Quadruped:** Leg IK, trot gait animation, balance

### Additional Features
- 👁️ **FPV Camera** — First-person view from robot's perspective
- 📍 **Waypoints** — Mark and navigate to positions
- 🗺️ **Minimap** — Real-time position tracking
- 🔋 **Battery** — Simulated power consumption
- 🌧️ **Weather** — Rain, storms, sandstorms per environment
- 💬 **Voice Suggestions** — On-screen command hints

## 🎤 Voice Commands

### General
- "What do you see?"
- "Describe your surroundings"
- "Check battery level"

### Drone
- "Fly higher" / "Descend"
- "Turn left/right"
- "Go forward"
- "Land"

### AUV
- "Dive deeper"
- "Surface"
- "Scan the seabed"
- "Check depth"

### Rover
- "Drive forward"
- "Turn around"
- "Stop"

### Quadruped
- "Walk forward"
- "Run"
- "Sit"
- "Stand up"

## ⌨️ Keyboard Controls

### Flying (Drone/AUV)
- `W/S` — Forward/Back
- `A/D` — Strafe Left/Right
- `Q/E` — Up/Down (Dive/Surface for AUV)
- `←/→` — Turn

### Ground (Rover/Quadruped)
- `W/S` — Forward/Back
- `A/D` — Turn
- `Space` — Brake/Sit

## 🛠️ Local Development

```bash
cd ~/clawd/builds/gemini-drone-challenge

# Install dependencies
cd backend && npm install

# Start server
node server.js

# Open http://localhost:8080
```

## 📁 Project Structure
```
gemini-drone-challenge/
├── frontend/
│   └── index.html      # Complete multi-robot simulator
├── backend/
│   └── server.js       # Express server + Gemini proxy
└── README.md
```

## 🔧 Configuration

The Gemini API key is embedded in the frontend for the demo. For production:
1. Move API key to environment variable
2. Proxy through backend for security

## 🎯 Testing Checklist
- [x] Buttons click properly (fixed!)
- [x] Robot switching works
- [x] Environment switching works
- [x] Physics feel natural for each robot
- [x] FPV camera toggles
- [x] Waypoints can be added
- [x] Minimap updates
- [x] Voice control connects
- [x] Gemini responds to voice

## 🏆 Gemini Live Agent Challenge Entry

This project demonstrates **"AI with a Body"** — physical AI controlling robots in 3D environments via natural language. Built for the Gemini Live Agent Challenge.

### What Makes It Special
1. **Multiple Robot Types** — Not just drones, but submarines, rovers, and robot dogs
2. **Realistic Physics** — Each robot feels different to control
3. **Immersive Environments** — From warehouses to underwater exploration
4. **Voice First** — Natural language control via Gemini Live
5. **FPV Mode** — See through the robot's eyes

---

Built with ❤️ using Three.js and Gemini Live API
