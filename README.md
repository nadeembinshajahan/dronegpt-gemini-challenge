# DroneGPT — Gemini Live Agent Challenge

**Pitch:** "For the first time, AI has a body."

Talk to an AI that controls a drone in 3D space. It sees through the camera, navigates, and responds in real-time.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Browser UI    │────▶│  Google Cloud   │────▶│  Gemini Live    │
│  (Three.js)     │◀────│    Run          │◀────│     API         │
│  Drone + Camera │     │  WebSocket      │     │  Audio + Video  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Tech Stack
- **Frontend:** Three.js, WebRTC, Web Audio API
- **Backend:** Node.js on Cloud Run
- **AI:** Gemini Live API (audio + vision)
- **Infra:** Google Cloud

## Demo Flow
1. User speaks: "Fly forward and tell me what you see"
2. Gemini hears → processes → sends drone command
3. Drone moves in Three.js scene
4. Camera view sent to Gemini
5. Gemini describes the scene in real-time

## Timeline (30 hours)
- [ ] Hour 0-4: Three.js drone scene + basic controls
- [ ] Hour 4-8: Gemini Live API integration
- [ ] Hour 8-12: Voice commands → drone actions
- [ ] Hour 12-16: Camera feed to Gemini vision
- [ ] Hour 16-20: Polish, edge cases, demo script
- [ ] Hour 20-24: GCP deployment + testing
- [ ] Hour 24-30: Video recording, submission

## Team
- Nadeem M Shajahan (SF Autonomy)
