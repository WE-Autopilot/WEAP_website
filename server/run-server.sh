#!/bin/bash
# Script to run the server with the specified environment configuration

# Default to development if no environment is specified
ENV=${1:-development}

# Check if the environment configuration file exists
ENV_FILE="config/environments/.env.$ENV"
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Environment file $ENV_FILE does not exist!"
  echo "Please create it first or use a valid environment (development, production, test)"
  exit 1
fi

echo "Starting server in $ENV environment..."
NODE_ENV=$ENV node server.js
