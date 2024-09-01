#!/bin/sh
set -e

cd ./server
echo "Installing server node packages..."
npm install
cd ..
cd client/coinflow
echo "Installing client node packages..."
npm install
echo "Building project..."
npm run format-build
echo ""
echo ""
echo "Successfully installed components."
