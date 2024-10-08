FROM node:alpine
RUN mkdir -p /var
RUN mkdir -p /var/www
RUN mkdir -p /var/www/coinflow
WORKDIR /var/www/coinflow
RUN npm install -g nodemon
COPY ./server/package.json /var/www/coinflow
RUN npm install
COPY ./server /var/www/coinflow
COPY ./client/coinflow/dist /var/www/coinflow/dist
EXPOSE 3000
CMD ["npm", "start"]
