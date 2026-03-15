#!/bin/bash
# Deploy DroneGPT to Google Cloud Run

set -e

PROJECT_ID="sf-autonomy"  # Update with your project
REGION="asia-south1"
SERVICE_NAME="dronegpt"

echo "🚁 Deploying DroneGPT to Cloud Run..."

# Build and push container
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY" \
  --memory 512Mi \
  --timeout 300

echo "✅ Deployed!"
echo "URL: https://$SERVICE_NAME-xxxxx-$REGION.a.run.app"
