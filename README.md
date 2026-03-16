# STADO — Voice-Controlled Drone Simulator 🚁

> **StratoFirma Tactical Autonomous Drone Orchestration**
> 
> Speak to drones. They fly.

Powered by **Gemini 2.0 Live API** — real-time multimodal AI that sees, hears, and acts.

## 🎮 Live Demo

**URL:** https://hood-freely-routers-bench.trycloudflare.com

---

## 🧪 Reproducible Testing Instructions (For Judges)

### Option 1: Use Live Demo (Fastest)
1. Open https://hood-freely-routers-bench.trycloudflare.com
2. Click the microphone button
3. Say: "Fly higher" or "Turn left" or "What do you see?"
4. Use keyboard (WASD + QE) as backup controls

### Option 2: Run Locally

```bash
# Clone the repo
git clone https://github.com/nadeembinshajahan/dronegpt-gemini-challenge.git
cd dronegpt-gemini-challenge

# Install dependencies
cd backend
npm install

# Set environment variables (optional - demo uses embedded key)
export GEMINI_API_KEY=your_key_here

# Start the server
node server.js

# Open browser
# http://localhost:8080
```

### Option 3: Deploy to Cloud Run

```bash
# Build and deploy
gcloud run deploy stado \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY
```

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Voice Input   │────▶│  Gemini 2.0 Live │────▶│  Drone Control  │
│   (WebRTC)      │     │  (Multimodal AI) │     │  (Three.js)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**Tech Stack:**
- **AI:** Gemini 2.0 Flash Live API
- **Frontend:** Three.js (WebGL)
- **Backend:** Node.js + Express
- **Environments:** World Labs GLB + Polyhaven HDRI
- **Deployment:** Google Cloud Run

---

## 🎤 Voice Commands

| Say This | Drone Does |
|----------|------------|
| "Fly higher" | Ascend |
| "Go forward" | Move forward |
| "Turn left/right" | Rotate yaw |
| "What do you see?" | Describe scene |
| "Land" | Descend |
| "Stop" | Hover |

---

## ⌨️ Keyboard Controls

| Key | Action |
|-----|--------|
| W/S | Forward / Back |
| A/D | Strafe Left / Right |
| Q/E | Ascend / Descend |
| ←/→ | Turn Left / Right |

---

## 🚁 Features

- **Voice-First Control** — Talk to the drone naturally
- **Realistic Physics** — Acceleration, drag, auto-hover, tilt stabilization
- **World Labs Environments** — AI-generated 3D scenes (London, Industrial)
- **HDRI Lighting** — Photorealistic skyboxes
- **Multi-Robot Support** — Drone, AUV, Rover, Quadruped
- **FPV Camera** — First-person view
- **Live Telemetry** — Position, speed, altitude HUD

---

## 📁 Project Structure

```
stado/
├── frontend/
│   ├── index.html          # Main app (Three.js + Gemini)
│   ├── environments/       # GLB models (World Labs)
│   └── hdri/              # Skybox HDRIs (Polyhaven)
├── backend/
│   ├── server.js          # Express + WebSocket
│   └── .env               # API keys
├── DRONEGPT.md            # Full project description
├── DEVPOST_SUBMISSION.md  # Submission content
└── README.md              # This file
```

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI API key |
| `PORT` | Server port (default: 8080) |

---

## 🌍 Environments

| Name | Source | Description |
|------|--------|-------------|
| London City | World Labs | Urban streets, buildings |
| Industrial | World Labs | Warehouse, containers |
| Tokyo | GLB | City scene |

---

## 🎯 Gemini Live Agent Challenge

**Category:** Live Agents 🗣️

**What it demonstrates:**
- Real-time voice interaction with Gemini Live API
- Multimodal AI (audio → intent → action)
- Physical AI — giving language models a body

**Built by:** Stratofirma Autonomy Labs (SF Autonomy)

---

## 📄 License

MIT License

---

*"The best interface is no interface. Just say what you want."*
