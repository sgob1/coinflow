#!/bin/sh
set -e
set -x

command -v curl >/dev/null 2>&1 || { echo >&2 "curl required, but not installed. Aborting."; exit 1; }

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
EXPRESS_BASE_ADDR="http://localhost:3000"
EXPRESS_API_ADDR="/api"
COOKIESFILE="./cookies"
echo "" > $COOKIESFILE

curl_send() {
	curl --header "Content-Type: application/json" -c "$COOKIESFILE" -b "$COOKIESFILE" -X $1 --data "$2" "$EXPRESS_BASE_ADDR$EXPRESS_API_ADDR$3"
}
