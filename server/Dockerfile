FROM node:alpine
WORKDIR /var/www/coinflow
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
