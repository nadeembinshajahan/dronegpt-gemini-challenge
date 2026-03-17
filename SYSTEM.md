# DroneGPT — AI with a Body

## Overview
DroneGPT is a voice-controlled multi-robot simulator where Google Gemini Live AI inhabits and controls autonomous vehicles in both virtual 3D environments and real-world photorealistic Google Maps 3D cityscapes. The AI can see through the robot's camera, respond to voice commands, navigate autonomously, and describe its surroundings.

## Architecture
- **Frontend**: Single-page monolithic HTML/JS app (`frontend/index.html`)
- **Backend**: Express.js server on port 8080 (`backend/server.js`)
- **3D Engine**: Three.js (v0.170.0) loaded as ES modules from esm.sh
- **Maps**: Google 3D Tiles API via `3d-tiles-renderer` (v0.4.22) with `GoogleCloudAuthPlugin`
- **Voice AI**: Gemini Live WebSocket API with bidirectional audio streaming + tool/function calling
- **Coordinate System**: WGS84 ECEF for maps mode, standard Three.js Y-up for simulation environments

## Robot Types

### Quadcopter Drone
- 6DOF flight: forward/back, strafe left/right, ascend/descend, yaw
- Pitch control via arrow keys
- Realistic tilt physics based on velocity
- FOV projection cone showing camera footprint on ground
- Animated GLB model with propeller spin and nav lights

### Submarine AUV (Autonomous Underwater Vehicle)
- Neutral buoyancy — holds depth when no input
- Forward/back, strafe, dive/surface, yaw
- Constrained to ocean bounds (200m radius, 1-28m depth)
- Bioluminescent lighting effects

### Ground Rover
- Car-like steering (turn only effective when moving)
- Forward/back, turn left/right, brake (spacebar)
- Camera mast at front with forward-facing FPV
- Cannot fly — up/down commands rejected

### Robot Dog (Quadruped)
- Walk forward/back, turn
- Trot gait animation with procedural leg movement
- Ground-level camera perspective

## Environments

### Simulation Environments (Three.js)
- **City**: GLB-loaded city model with buildings, streets. Vertex-weighted centering, grid raycasting for ground detection.
- **Tokyo**: GLB city environment
- **Underwater**: Procedural ocean with coral reefs (80 pieces), kelp forests (40 swaying strands), fish schools (5 circling), jellyfish (6 bobbing), shipwreck, underwater pipeline, bioluminescent lights, oil rig platform
- **Warehouse**: Containers, crane, forklift, pallets, barrier cones, fuel tanks, helipad
- **Urban Sky**: Night cityscape with lit-window buildings, roads, lane markings, parked cars, traffic lights, street lights, park benches
- **Forest**: 80 procedural trees with varied trunk/foliage
- **Desert**: Dune terrain, pyramids, ruins

### Google Maps 3D (Photorealistic Tiles)
- Real-world 3D city models loaded via Google Map Tiles API
- Rendered directly in Three.js scene using `3d-tiles-renderer` + `GoogleCloudAuthPlugin`
- ECEF coordinate system with WGS84 ellipsoid positioning
- Cities: New York, San Francisco, London
- Drone operates in the same 3D space as buildings — enables collision detection, proper FPV camera, direct frame capture

## Gemini Live Voice AI Integration

### Connection
- Direct WebSocket to `wss://generativelanguage.googleapis.com` Gemini Live API
- Model: `gemini-2.5-flash-native-audio-preview`
- Bidirectional: PCM16 audio in (16kHz mic) → PCM audio out (24kHz playback)
- Auto-reconnect on disconnect
- Queued audio playback (back-to-back scheduling, no overlap)

### Tool/Function Calling
Gemini can invoke these tools to control the robot:

| Tool | Description |
|------|-------------|
| `move_robot` | Move in a direction (forward/back/left/right/up/down) for a duration. Robot-aware: rover left = turn+drive, drone left = strafe |
| `rotate_robot` | Rotate by degrees. Smooth animated rotation, capped at 360 degrees |
| `set_speed` | Change thrust: slow/normal/fast |
| `stop` | Halt all movement, cancel autopilot |
| `get_status` | Returns position, GPS, altitude, speed, battery, heading, nav progress |
| `switch_environment` | Change to any environment |
| `switch_robot` | Change robot type |
| `navigate_to` | Fly to GPS coordinates (auto-switches to maps mode) |
| `set_waypoints` | Set multi-stop route with GPS waypoints for autonomous navigation |
| `cancel_navigation` | Cancel autopilot, return to manual control |
| `set_altitude` | Set flight altitude (direct Y positioning in maps, key hold in 3D) |

### Visual Awareness
- FPV camera frames captured every 10 seconds via `fpvRenderer.toDataURL()`
- Sent to Gemini as JPEG via `realtimeInput.mediaChunks`
- During autopilot: narration prompts sent with GPS context every 10 seconds
- Gemini describes what it sees and navigation progress

### System Prompt
- Robot-specific personality and controls
- Environment description
- GPS coordinates and autopilot status (maps mode)
- Instructions to use geographic knowledge for navigation planning

## Autonomous Navigation (Autopilot)

### Waypoint System
- Gemini generates GPS waypoints from natural language ("fly me a scenic route to Central Park")
- Autopilot steers drone: compute bearing → yaw toward target → fly forward
- Two-phase: climb to safe altitude first (120m minimum), then navigate laterally
- Arrival detection at ~30m threshold
- Speed settings: slow (0.4x), normal (0.7x), fast (1.0x)
- Loop mode for continuous tours
- Manual key override cancels autopilot instantly

### Altitude Control
- Minimum cruise altitude: 120m (above most buildings)
- Default navigation altitude: 150m
- Direct robot Y positioning in maps mode (instant, not key-simulated)
- Smooth animated altitude changes via `set_altitude` tool

## UI Design (Palantir-style)
- Dark military-grade aesthetic: `#0a0c10` backgrounds, `#388bfd` accent
- JetBrains Mono for data/labels, Inter for body text
- Sharp 3-4px radius corners, thin 1px borders
- No emojis — clean uppercase monospace button labels
- Full-width top control bar with grouped selectors
- Monospace telemetry display (ALT, SPD, LAT, LNG)
- Attitude indicator (artificial horizon canvas)
- Compass heading strip
- Battery indicator with gradient fill
- Toast notifications with left-border accent
- FPV Picture-in-Picture (280x180, Three.js renderer)
- Voice indicator with square pulse animation
- Mobile responsive with touch joysticks

## Camera System

### Chase Camera (3rd Person)
- Follows behind drone's yaw in all modes
- Smooth lerp follow (8% per frame)
- Adjustable distance via scroll wheel
- In maps/ECEF mode: positioned in local tangent plane behind drone

### FPV Camera
- Drone/AUV: 45 degrees downward from front, 110 degree FOV
- Rover/Quadruped: straight ahead from camera mast, 110 degree FOV
- Used for frame capture sent to Gemini AI

### Maps Mode Camera
- ECEF positioning with WGS84 surface normal as up vector
- Chase camera offset: 150m behind, 80m above in local tangent plane
- Near plane: 10m, Far plane: 20,000km

## Technical Details

### Three.js Configuration
- Version: 0.170.0 (ES modules from esm.sh)
- Renderer: WebGL with ACES filmic tone mapping, SRGB color space
- Shadow maps: 2048x2048 for directional lights
- Draco compression support for GLB models
- Animated GLB models (drone propellers via AnimationMixer)

### Google Maps Integration
- Map Tiles API with `GoogleCloudAuthPlugin` for authentication
- Session-based tile loading with automatic management
- Tiles group rotation: -PI/2 around X (ECEF Z-up → Three.js Y-up)
- Error target: 2 (high detail)
- ECEF coordinate conversion: lat/lng/alt → (x, z, -y) scene coordinates

### Audio Pipeline
- Input: MediaStream → ScriptProcessorNode (8192 buffer) → PCM16 → base64 → WebSocket
- Output: base64 → PCM16 → Float32 → AudioBuffer → scheduled playback at 24kHz
- Back-pressure: skip sending if WebSocket bufferedAmount > 64KB
- Audio queue reset between turns

### Physics
- Drone: gravity 0.02, drag 0.97, thrust 0.06, max speed 1.5, hover thrust = gravity
- AUV: neutral buoyancy, drag 0.95, thrust 0.08
- Rover: car-like steering, gravity 0.5, drag 0.94, brake 0.85x
- Wind model (disabled): sinusoidal wind with configurable strength

## File Structure
```
frontend/
  index.html          — Main application (single monolithic file)
  test-tiles.html     — Standalone 3D tiles test page
  drone.glb           — Animated drone model
  environments/
    london-city.glb   — City GLB model
    tokyo.glb         — Tokyo GLB model
    underwater.glb    — Underwater GLB (Draco compressed)
  hdri/
    urban.hdr, coastal.hdr, forest.hdr, warehouse.hdr, industrial.hdr
backend/
  server.js           — Express server + WebSocket
```

## API Keys Required
- `GEMINI_API_KEY` — Google Gemini API (for voice AI)
- `MAPS_API_KEY` — Google Maps Platform (requires Map Tiles API enabled)
