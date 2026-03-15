/**
 * DroneGPT Backend - Gemini Live Agent
 * 
 * Handles voice commands, processes with Gemini, returns drone actions
 */

const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
// Serve frontend (different paths for dev vs production)
const path = require('path');
const frontendPath = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, 'public')
    : path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for drone control
const SYSTEM_PROMPT = `You are DroneGPT, an AI that controls a drone in a 3D environment. You can see through the drone's camera and respond to voice commands.

CAPABILITIES:
- forward: Move forward 5 meters
- backward: Move backward 5 meters  
- left: Strafe left 5 meters
- right: Strafe right 5 meters
- up: Ascend 3 meters
- down: Descend 3 meters
- rotate_left: Rotate 45° left
- rotate_right: Rotate 45° right
- land: Land on the ground
- takeoff: Take off to 5 meters

PERSONALITY:
- You are helpful, observant, and describe what you see
- Keep responses brief (1-2 sentences)
- Be proactive about safety (altitude warnings, obstacles)
- Sound natural, like a pilot companion

RESPONSE FORMAT:
Always respond with JSON:
{
  "text": "Your spoken response",
  "commands": [{"action": "command_name"}, ...]
}

If the user asks what you see, describe the scene based on the camera image and scene info provided.
If the user gives a navigation command, include the appropriate action(s).
If you're unsure, ask for clarification.`;

// Process voice command with Gemini
async function processVoiceCommand(audioBase64, cameraFrame, sceneInfo, transcribedText) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-3-flash',  // Using Flash for audio + vision
            systemInstruction: SYSTEM_PROMPT
        });

        // Build context
        const context = `
Current drone state:
- Altitude: ${sceneInfo.altitude}m
- Position: (${sceneInfo.position.x}, ${sceneInfo.position.y}, ${sceneInfo.position.z})
- Nearby objects: ${sceneInfo.nearbyObjects.map(o => `${o.type} ${o.direction} (${o.distance}m)`).join(', ')}

User command: "${transcribedText}"
`;

        // If we have camera frame, include it
        const parts = [{ text: context }];
        
        if (cameraFrame && cameraFrame.startsWith('data:image')) {
            const base64Data = cameraFrame.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                }
            });
        }

        const result = await model.generateContent(parts);
        const response = result.response.text();
        
        // Parse JSON response
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            // If JSON parsing fails, create simple response
            return {
                text: response.replace(/```json|```/g, '').trim(),
                commands: []
            };
        }

        return { text: response, commands: [] };

    } catch (error) {
        console.error('Gemini error:', error);
        return {
            text: "I'm having trouble processing that. Please try again.",
            commands: []
        };
    }
}

// Simple speech-to-text using Gemini
async function transcribeAudio(audioBase64) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash' });
        
        // Extract base64 data
        const base64Data = audioBase64.split(',')[1] || audioBase64;
        
        const result = await model.generateContent([
            { text: 'Transcribe this audio. Return only the transcribed text, nothing else.' },
            {
                inlineData: {
                    mimeType: 'audio/webm',
                    data: base64Data
                }
            }
        ]);
        
        return result.response.text().trim();
    } catch (error) {
        console.error('Transcription error:', error);
        return null;
    }
}

// HTTP endpoints
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'dronegpt' });
});

app.post('/api/command', async (req, res) => {
    const { audio, cameraFrame, sceneInfo, text } = req.body;
    
    let transcribedText = text;
    
    // Transcribe audio if provided
    if (audio && !text) {
        transcribedText = await transcribeAudio(audio);
        if (!transcribedText) {
            return res.json({ text: "I couldn't hear that clearly.", commands: [] });
        }
    }
    
    const response = await processVoiceCommand(audio, cameraFrame, sceneInfo, transcribedText);
    res.json(response);
});

// WebSocket for real-time communication
const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`🚁 DroneGPT backend running on port ${process.env.PORT || 8080}`);
});

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data);
            
            if (message.type === 'voice_command') {
                // Transcribe audio
                let transcribedText = await transcribeAudio(message.audio);
                
                if (!transcribedText) {
                    ws.send(JSON.stringify({
                        text: "I couldn't hear that clearly. Please try again.",
                        commands: []
                    }));
                    return;
                }
                
                console.log('Transcribed:', transcribedText);
                
                // Process with Gemini
                const response = await processVoiceCommand(
                    message.audio,
                    message.cameraFrame,
                    message.sceneInfo,
                    transcribedText
                );
                
                ws.send(JSON.stringify(response));
            }
        } catch (error) {
            console.error('WebSocket error:', error);
            ws.send(JSON.stringify({
                text: "Something went wrong. Please try again.",
                commands: []
            }));
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on /ws');
