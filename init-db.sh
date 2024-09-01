#!/bin/sh
set -e
set -x

cd ./server
npm run resetdb;
echo ""
echo ""
echo "Successfully performed database reset."
