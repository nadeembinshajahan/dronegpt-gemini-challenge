# DroneGPT — Gemini Live Agent Challenge Submission

## 📝 Project Summary

**DroneGPT** is the first AI agent with a body. It controls a drone in 3D space, sees through its camera, and responds to natural voice commands in real-time.

### The Paradigm Shift
For the first time, AI isn't just text on a screen—it inhabits a physical space. DroneGPT sees, moves, and acts in a 3D world, demonstrating the future of embodied AI.

### Key Features
- **Voice Control**: Speak naturally—"Go check that corner", "What do you see?"
- **Real-time Vision**: Gemini processes the drone's camera feed
- **Spatial Reasoning**: AI understands and navigates 3D environments
- **Interruptible**: Full Live API support for natural conversation

---

## 🛠️ Technologies Used

| Component | Technology |
|-----------|------------|
| AI Model | Gemini 2.0 Flash (Live API) |
| SDK | Google GenAI SDK |
| Frontend | Three.js, WebRTC, Web Audio API |
| Backend | Node.js, Express, WebSockets |
| Deployment | Google Cloud Run |
| 3D Simulation | Three.js with custom drone physics |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         USER                                    │
│                    🎤 Voice + 👀 Screen                         │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                 BROWSER (Three.js)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ 3D Drone Sim │  │ FPV Camera   │  │ Voice Capture        │  │
│  │ + Controls   │  │ Feed         │  │ (Web Audio API)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────────┬───────────────────────────────────────┘
                         │ WebSocket
                         ▼
┌────────────────────────────────────────────────────────────────┐
│              GOOGLE CLOUD RUN (Backend)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Audio Processing → Gemini Transcription                  │  │
│  │  Camera Frame + Scene Context → Gemini Vision             │  │
│  │  Response Parsing → Drone Commands                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    GEMINI LIVE API                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐   │
│  │ Audio STT  │  │ Vision     │  │ Reasoning + Response   │   │
│  │            │  │ Analysis   │  │ Generation             │   │
│  └────────────┘  └────────────┘  └────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## 📹 Demo Video

[Link to YouTube/Loom video - 3 min max]

**Demo Script:**
1. Intro: "This is DroneGPT—an AI that has a body"
2. Show the 3D environment
3. Voice command: "Take off and look around"
4. Voice command: "Fly toward that building"
5. Voice command: "What do you see?"
6. Show AI describing the scene
7. Outro: "This is the future of embodied AI"

---

## 🚀 Deployment Proof

**Cloud Run URL:** [Insert deployed URL]

**Console Screenshot:** [Attach screenshot of Cloud Run console showing the service running]

---

## 🎯 Category

**Live Agents** 🗣️
- Real-time audio/vision interaction
- Uses Gemini Live API
- Handles interruptions naturally
- Hosted on Google Cloud

---

## 💡 What We Learned

1. **Gemini's multimodal capabilities are powerful** — Processing both audio and images in a single context enables truly intelligent agents
2. **Real-time is hard** — Optimizing latency for natural conversation required careful architecture
3. **Embodied AI changes everything** — When AI has a "body", the interaction paradigm shifts completely

---

## 👥 Team

**Nadeem M Shajahan**
- CEO, SF Autonomy (Physical AI for drones)
- Built perception systems deployed with Indian Armed Forces
- Winner, Mehar Baba Prize (IAF swarm drone competition)

---

## 🔗 Links

- **GitHub:** [Insert repo URL]
- **Live Demo:** [Insert Cloud Run URL]
- **Video:** [Insert video URL]

---

## ✅ Submission Checklist

- [ ] Text description (this document)
- [ ] Public GitHub repo with README
- [ ] GCP deployment proof (screenshot/recording)
- [ ] Architecture diagram (above)
- [ ] Demo video (< 3 min)
- [ ] Optional: Blog post with #GeminiLiveAgentChallenge
