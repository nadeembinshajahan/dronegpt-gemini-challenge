# DroneGPT - Gemini Live Agent Challenge
FROM node:20-slim

WORKDIR /app

# Copy backend
COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./
COPY frontend/ ./public/

# Cloud Run uses PORT env var
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
