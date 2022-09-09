FROM node:16-bullseye-slim

ENV CI=1

RUN apt-get update && apt-get install -y gettext

RUN mkdir /spendit
WORKDIR /spendit

RUN npm install -g @angular/cli@14.2.1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# How to get the password..
RUN ./setup.sh production

RUN ng build --progress

ENV NODE_ENV=production

WORKDIR /spendit/server

RUN npm ci

CMD ["node", "index.js"]