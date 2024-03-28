FROM node:16.20.2-alpine
WORKDIR /usr/src/app

COPY . .

RUN npm install
EXPOSE 3000

CMD [ "node", "index.js" ]