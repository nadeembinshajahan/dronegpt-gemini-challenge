#!/bin/bash
# STADO - Automated Cloud Run Deployment
# For Gemini Live Agent Challenge

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-gen-lang-client-0514339613}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="stado"

echo "🚁 STADO Deployment Script"
echo "=========================="

# Check for required tools
command -v gcloud >/dev/null 2>&1 || { echo "❌ gcloud CLI required"; exit 1; }

# Authenticate if needed
echo "📋 Checking GCP authentication..."
gcloud auth print-access-token >/dev/null 2>&1 || gcloud auth login

# Set project
echo "📁 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Build and deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --source . \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --timeout 300 \
    --set-env-vars "GEMINI_API_KEY=${GEMINI_API_KEY}" \
    --set-env-vars "PORT=8080"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "✅ Deployment complete!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "To view logs:"
echo "  gcloud run logs read --service $SERVICE_NAME --region $REGION"
