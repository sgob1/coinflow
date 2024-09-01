#!/bin/sh
set -e

cd client
echo "Installing client node packages..."
npm install
cd coinflow
npm install
echo "Building project..."
npm run format-build
echo ""
echo ""
echo "Successfully installed components."
