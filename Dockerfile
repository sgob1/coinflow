FROM node:alpine
WORKDIR /var/www/coinflow
COPY ./server .
COPY ./client/coinflow/dist ./dist
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
