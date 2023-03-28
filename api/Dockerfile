FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install
RUN npm install pm2 -g

EXPOSE 8000
CMD["pm2-runtime", "index.js"]