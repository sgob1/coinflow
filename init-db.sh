#!/bin/sh
set -e
set -x

cd ./server
echo "Installing server node packages..."
npm install
npm run resetdb;
echo ""
echo ""
echo "Successfully performed database reset."
rm -rf ./node_modules
echo "Cleaning directory..."
