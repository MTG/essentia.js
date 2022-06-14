FROM node:14.18.1

WORKDIR /usr/src/app

# COPY . .

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

COPY ./server ./server
WORKDIR /usr/src/app/server
RUN npm ci --only=production
ENV PORT=8000

COPY ./views/dist/ ./public
# WORKDIR /usr/src/app/views
# RUN npm ci --only=production
# RUN npm run build

EXPOSE 8000

# WORKDIR /usr/src/app/server
CMD node server.js
