# STADO — DevPost Submission

## Project Story

### Inspiration

Every drone operator today faces the same problem: a wall of complexity between intent and action. You want the drone to "check the roof for damage" — but first you need to plot waypoints, set altitudes, configure camera angles, and babysit the flight.

We asked: **What if you could just *tell* the drone what you want?**

The release of Gemini's Live API was the catalyst. Real-time multimodal AI that can see, hear, and respond instantly — this was the missing piece. We could finally build what we'd been imagining: an AI copilot that understands natural language commands and translates them into robotic action.

STADO was born from our work at SF Autonomy, where we're building Physical AI for drones. This hackathon was the perfect forcing function to prove the concept works.

### What it does

STADO (StratoFirma Tactical Autonomous Drone Orchestration) is a voice-controlled autonomous drone system powered by Gemini 2.0 Live API.

**Core capabilities:**
- 🎤 **Voice commands** — "Fly higher," "Scout the building," "What do you see?"
- 👁️ **Scene understanding** — Gemini analyzes the 3D environment and reasons about spatial relationships
- 🚁 **Realistic physics** — Acceleration-based flight model with auto-hover and stabilization
- 🌍 **Immersive environments** — World Labs AI-generated 3D scenes with photorealistic HDRI lighting
- 🔄 **Real-time feedback** — Live telemetry, position tracking, and conversational responses

**The key insight:** We're not just transcribing speech to commands. Gemini *understands intent* and figures out how to accomplish goals. "Check the perimeter" becomes a multi-step mission the AI plans and executes.

### How we built it

**Architecture:**
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Voice Input   │────▶│  Gemini 2.0 Live │────▶│  Drone Control  │
│   (WebRTC)      │     │  (Multimodal AI) │     │  (Three.js)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        │                        ▼                        │
        │               ┌──────────────────┐              │
        └──────────────▶│  Scene Context   │◀─────────────┘
                        │  (3D State)      │
                        └──────────────────┘
```

**Tech stack:**
- **AI:** Gemini 2.0 Flash Live API (real-time multimodal)
- **Frontend:** Three.js (WebGL 3D rendering)
- **Audio:** WebRTC / Web Audio API
- **Environments:** World Labs GLB exports + Polyhaven HDRI
- **Backend:** Node.js WebSocket relay
- **Deployment:** Google Cloud Run + Cloudflare Tunnel

**Development timeline:**
1. Day 1: Core Three.js simulator with keyboard controls
2. Day 2: Gemini Live API integration for voice
3. Day 3: World Labs environments, HDRI lighting, physics overhaul
4. Day 4: Polish, documentation, submission prep

### Challenges we ran into

1. **World Labs iframe blocked** — X-Frame-Options denied embedding. Solution: Export GLB meshes and load directly into Three.js.

2. **Drone scale mismatch** — World Labs models were huge (1500+ units). Initial scaling made the drone microscopic. Solution: Load GLBs at native scale, position drone appropriately.

3. **Physics felt "floaty"** — Direct velocity control felt game-like, not realistic. Solution: Implemented acceleration-based physics with auto-hover compensation and smooth tilt stabilization.

4. **Voice latency** — Initial implementation had noticeable delay. Solution: Streaming audio via WebRTC, reduced buffer sizes.

### Accomplishments that we're proud of

- **True voice-first UX** — No buttons needed. Just talk.
- **Spatial reasoning works** — "Go to the red container" actually works because Gemini understands the scene.
- **Physical AI proof of concept** — This architecture maps directly to real drone systems.
- **Shipped in 4 days** — From idea to working demo under deadline pressure.

### What we learned

1. **Gemini Live is fast** — Real-time multimodal AI is here. The latency is low enough for interactive robotics.

2. **Intent > Commands** — Users don't want to specify HOW. They want to specify WHAT. Let AI figure out the how.

3. **3D environments matter** — Immersive visuals dramatically improve the experience. World Labs + HDRI was a game-changer.

4. **Physical AI is the next frontier** — LLMs that can ACT, not just respond. This is where the industry is heading.

### What's next for STADO

- **Multi-drone swarms** — "Send two drones to flank the building"
- **Real hardware integration** — MAVLink bridge to PX4 flight controllers
- **Edge deployment** — Run on Jetson/Qualcomm for real drones
- **Mission memory** — "Remember this spot as Home"
- **Commercial pilots** — Airport/port security, search & rescue, infrastructure inspection

---

## Built With

- Gemini 2.0 Flash Live API
- Google Cloud Run
- Google GenAI SDK
- JavaScript
- Node.js
- Three.js
- WebGL
- WebRTC
- World Labs
- Polyhaven HDRI

---

## Try It Out Links

1. **Live Demo:** https://hood-freely-routers-bench.trycloudflare.com
2. **GitHub:** https://github.com/nadeembinshajahan/dronegpt-gemini-challenge

---

## Submitter Info

- **Type:** Individual
- **Country:** India
