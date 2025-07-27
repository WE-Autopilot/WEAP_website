#!/bin/bash

echo "🚀 WEAP Website Enhanced Setup and Startup"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Create and set up environment
echo "📋 Setting up environment..."
node setup-environment.js

# Apply safe enhancements
echo -e "\n📋 Applying safe enhancements..."
node safe-enhance.js
node init-safe-enhancements.js

# Verify integration
echo -e "\n📋 Verifying integration..."
if node verify-integration.js; then
    echo -e "\n✅ Integration verified successfully!"
else
    echo -e "\n❌ Integration verification failed. Please fix the issues above and try again."
    echo "   You can manually run 'node verify-integration.js' to check for issues."
    exit 1
fi

# Install dependencies if needed
echo -e "\n📋 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo -e "\n🎉 Setup complete!"
echo "To start the application:"
echo "1. Start the server: cd server && npm run dev"
echo "2. In another terminal, start the client: cd client && npm run dev"
echo -e "\nFor more information, see INTEGRATION-GUIDE.md" 