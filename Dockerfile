FROM node:19

WORKDIR /usr/src/app

Copy package*.json ./

RUN npm install

Run npm ci --only=production

COPY . .

ENV TODODODO_PORT 8080

EXPOSE ${TODODODO_PORT}

CMD [ "node", "app.js", "--production"]