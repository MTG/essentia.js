FROM node:14.18.1 as fe-builder

WORKDIR /usr/src/app
COPY views/package.json .
RUN npm install

COPY views/ .
RUN npm run build

FROM node:14.18.1

RUN apt-get -y update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY server/package.json .

RUN npm install

COPY ./server/ ./
COPY --from=fe-builder /usr/src/app/dist/ ./public

EXPOSE 8000
ENV PORT=8000

WORKDIR /usr/src/app
CMD node server.js
