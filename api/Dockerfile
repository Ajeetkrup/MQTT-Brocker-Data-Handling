FROM node:18

# RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm install pm2 

COPY . .

EXPOSE 8000
CMD [ "node", "index.js" ]