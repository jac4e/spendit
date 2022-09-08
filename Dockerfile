FROM node:16-bullseye-slim
# ENV NODE_ENV=production

RUN mkdir /spendit
WORKDIR /spendit

RUN npm install -g @angular/cli@13.2.6

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN ng build

WORKDIR /spendit/server

RUN npm ci

CMD ["node", "index.js"]