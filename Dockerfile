FROM node:19

WORKDIR /usr/src/app

Copy package*.json ./

RUN npm install

Run npm ci --only=production

COPY . .

EXPOSE 8080/tcp

CMD [ "node", "app.js", "--production"]