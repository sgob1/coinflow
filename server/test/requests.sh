#!/bin/sh
set -e
set -x

source ./test-header.sh

echo -e "${BLUE}Beginning tests...${NC}"
echo -e "${BLUE}Signup of user luke...${NC}"
result=$(curl_send "POST" '{"username": "luke", "password": "notapass", "name": "Luca", "surname": "Guadagnini"}' "/auth/signup")
if [ "$result" != "{\"msg\":\"User successfully registered\"}" ]; then
	echo -e "${RED}TEST FAILED${NC}"
	exit 1;
fi
echo -e "${GREEN}/api/auth/signup passed${NC}"


echo -e "${BLUE}Signin of user luke...${NC}"
result=$(curl_send "POST" '{"username": "luke", "password": "notapass"}' "/auth/signin")
if [ "$result" != '{"msg":"User has been successfully authenticated"}' ]; then
	echo -e "${RED}TEST FAILED${NC}"
	exit 1;
fi
echo -e "${GREEN}/api/auth/signin passed${NC}"

echo -e "${BLUE}Empty budget...${NC}"
result=$(curl_send "GET" "" "/budget")
if [ "$result" != '[]' ]; then
	echo -e "${RED}TEST FAILED${NC}"
	exit 1;
fi
echo -e "${GREEN}/api/budget passed${NC}"

echo -e "${BLUE}whoami...${NC}"
result=$(curl_send "GET" "" "/budget/whoami")
if [ "$result" != '[]' ]; then
	echo -e "${RED}TEST FAILED${NC}"
	exit 1;
fi
echo -e "${GREEN}/api/budget passed${NC}"
