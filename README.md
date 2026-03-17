# STADO — Voice-Controlled Drone Simulator

> **StratoFirma Tactical Autonomous Drone Orchestration**
>
> Speak to drones. They fly.

Voice-controlled multi-robot simulator where Gemini Live AI inhabits autonomous vehicles in 3D environments and photorealistic Google Maps cityscapes. The AI sees through the robot's camera, responds to voice commands, navigates autonomously, and describes its surroundings in real time.

**Built for the [Gemini Live Agent Challenge](https://ai.google.dev/competition).**

Powered by **Gemini 2.0 Live API** — real-time multimodal AI that sees, hears, and acts.

**Built by:** Stratofirma Autonomy Labs (SF Autonomy)

---

## Quick Start

### Prerequisites
- Node.js 20+
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- A [Google Maps API key](https://console.cloud.google.com/apis/credentials) with **Maps JavaScript API** and **Map Tiles API** enabled

### 1. Clone and install

```bash
git clone https://github.com/nadeembinshajahan/dronegpt-gemini-challenge.git
cd dronegpt-gemini-challenge/backend
npm install
```

### 2. Configure API keys

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
MAPS_API_KEY=your_maps_api_key
PORT=8080
```

You also need to set the keys in `frontend/index.html` — search for `GEMINI_API_KEY` and `MAPS_API_KEY` constants near the top of the script and replace them with your own keys.

### 3. Run locally

```bash
cd backend
node server.js
```

Open **http://localhost:8080**. Click **START VOICE CONTROL**, allow microphone access, and start talking to the AI.

---

## Deploy to GCP

### Create a VM

```bash
gcloud compute instances create dronegpt-server \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --image-family=ubuntu-2404-lts-amd64 \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB \
  --tags=http-server,https-server
```

### Open firewall

```bash
gcloud compute firewall-rules create allow-web \
  --allow=tcp:80,tcp:443 \
  --target-tags=http-server,https-server
```

### Install dependencies on the VM

```bash
# SSH in
gcloud compute ssh dronegpt-server --zone=us-central1-a

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# nginx + certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx

# pm2 (process manager)
sudo npm install -g pm2
```

### Upload and configure

```bash
# From your local machine — upload the project
gcloud compute scp --recurse backend frontend dronegpt-server:/opt/dronegpt/ --zone=us-central1-a

# SSH in and set up
gcloud compute ssh dronegpt-server --zone=us-central1-a

# Create .env
cat > /opt/dronegpt/backend/.env << 'EOF'
GEMINI_API_KEY=your_gemini_key
MAPS_API_KEY=your_maps_key
NODE_ENV=production
PORT=8080
EOF

# Install deps
cd /opt/dronegpt/backend
npm install

# Symlink frontend as public dir (server.js serves from ./public in production)
ln -sf /opt/dronegpt/frontend /opt/dronegpt/backend/public

# Start with pm2
pm2 start server.js --name dronegpt
pm2 save
pm2 startup
```

### Configure nginx

```bash
sudo tee /etc/nginx/sites-available/dronegpt << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
        client_max_body_size 50m;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/dronegpt /etc/nginx/sites-enabled/dronegpt
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

### SSL (after DNS is pointed)

```bash
sudo certbot --nginx -d your-domain.com
```

HTTPS is **required** for microphone and screen share permissions to work in the browser.

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Voice Input   │────>│  Gemini 2.0 Live │────>│  Drone Control  │
│   (WebRTC)      │     │  (Multimodal AI) │     │  (Three.js)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

```
frontend/
  index.html              Single-page app (~4700 lines, all inline)
  drone.glb               Animated drone model (PBR metallic-roughness)
  environments/
    london-city.glb       City environment
    tokyo.glb             Tokyo environment
    underwater.glb        Underwater scene (Draco compressed)
  hdri/
    urban.hdr, coastal.hdr, forest.hdr, warehouse.hdr, industrial.hdr
backend/
  server.js               Express server + WebSocket on port 8080
  package.json
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| 3D Engine | Three.js v0.170.0 (ES modules via importmap) |
| Maps | Google Maps 3D (`gmp-map-3d` custom element) |
| Voice AI | Gemini Live WebSocket API (`gemini-2.5-flash-native-audio-preview`) |
| Audio | PCM16 at 16kHz (mic) / 24kHz (playback), queued scheduling |
| Backend | Express.js + ws |
| Process Mgmt | pm2 |
| Reverse Proxy | nginx |

### How It Works

1. **Voice input**: Browser captures mic audio → PCM16 → base64 → sent over WebSocket to Gemini Live API
2. **AI processing**: Gemini receives audio + periodic camera frames (JPEG), responds with audio + tool calls
3. **Tool execution**: Tool calls like `move_robot`, `navigate_to`, `set_waypoints` are executed client-side to control the 3D robot
4. **Visual feedback**: FPV camera frames sent to Gemini every 2 seconds so it can see and describe the environment
5. **Autonomous navigation**: Gemini generates GPS waypoints from natural language ("fly me to Central Park"), autopilot follows them

---

## Robot Types

| Robot | Controls | Environments |
|-------|----------|-------------|
| **Quadcopter Drone** | WASD strafe, QE altitude, arrows yaw | All |
| **Submarine AUV** | WASD move, QE dive/surface | Ocean |
| **Ground Rover** | WS forward/back, AD steer, Space brake | Land |
| **Robot Dog** | WS walk, AD turn | Land |

## Environments

| Environment | Type | Description |
|------------|------|-------------|
| **Maps (NYC, SF, London)** | Google Maps 3D | Photorealistic real-world cities, default environment |
| **City** | GLB model | London city with buildings and streets |
| **Tokyo** | GLB model | Tokyo city environment |
| **Warehouse** | Procedural | Containers, crane, forklift, helipad |
| **Urban Sky** | Procedural | Night cityscape with lit windows, roads, cars |
| **Forest** | Procedural | 80 trees with varied foliage |
| **Desert** | Procedural | Dunes, pyramids, ruins |
| **Ocean** | Procedural | Coral reefs, kelp, fish, jellyfish, shipwreck, oil rig |

---

## Voice Commands

| Say This | Drone Does |
|----------|------------|
| "Fly higher" | Ascend |
| "Go forward" | Move forward |
| "Turn left/right" | Rotate yaw |
| "What do you see?" | Describe scene |
| "Land" | Descend to ground |
| "Stop" | Hover in place |
| "Fly me to Central Park" | Autonomous GPS navigation |
| "Give me a scenic tour of Manhattan" | Multi-waypoint autopilot |

## Gemini Live Tool Calling

The AI can invoke these tools to control the robot:

| Tool | Description |
|------|-------------|
| `move_robot` | Move in a direction for a duration |
| `rotate_robot` | Rotate by degrees |
| `set_speed` | slow / normal / fast |
| `stop` | Halt all movement |
| `get_status` | Position, altitude, speed, battery, heading |
| `navigate_to` | Fly to GPS coordinates |
| `set_waypoints` | Multi-stop autonomous route |
| `cancel_navigation` | Cancel autopilot |
| `set_altitude` | Change flight altitude |
| `switch_environment` | Change environment |
| `switch_robot` | Change robot type |

## Keyboard Controls

| Key | Drone / AUV | Rover / Quadruped |
|-----|------------|-------------------|
| W / S | Forward / Back | Forward / Back |
| A / D | Strafe Left / Right | Turn Left / Right |
| Q / E | Ascend / Descend | — |
| Arrow Left / Right | Yaw | — |
| Space | — | Brake |

---

## Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/library)
2. Enable **Maps JavaScript API**
3. Enable **Map Tiles API**
4. Create an API key and restrict it to these two APIs
5. Create a **Map ID** at [Map Management](https://console.cloud.google.com/google/maps-apis/studio/maps) with Vector type, tilt and rotation enabled

## Notes

- **HTTPS required in production** — mic and screen share only work over HTTPS (or localhost)
- **Screen share** — in Maps mode, the app requests screen share permission so Gemini can see the 3D map view
- The frontend is a single monolithic HTML file by design — no build step, no bundler, just serve and go
- All 3D assets (GLB models, HDRI skyboxes) are loaded at runtime from the `frontend/` directory
- The Gemini Live connection auto-reconnects on disconnect

## License

MIT

---

*"The best interface is no interface. Just say what you want."*
