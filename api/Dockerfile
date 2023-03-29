FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install
RUN npm install pm2 

COPY . /usr/src/app

EXPOSE 8000
CMD [ "pm2-runtime", "index.js" ]