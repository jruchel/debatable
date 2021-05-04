FROM node:lts-alpine
RUN npm install -g http-server

WORKDIR /jazzarno

COPY package*.json ./

RUN npm install

RUN npm add vuetify

COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]