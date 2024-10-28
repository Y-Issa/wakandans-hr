FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

COPY wait-for-postgres.sh ./

RUN chmod +x ./wait-for-postgres.sh

RUN npm install

RUN apk update && \
    apk add postgresql-client

RUN apk add dos2unix && \
    dos2unix ./wait-for-postgres.sh

RUN npm run build

EXPOSE 5000

CMD sh ./wait-for-postgres.sh && npm run dev
