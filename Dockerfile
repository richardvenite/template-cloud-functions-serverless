FROM node:14.17.6-stretch-slim

RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;

WORKDIR /app
COPY . /app

RUN npm install -g firebase-tools
RUN npm install -g serverless

CMD ["/bin/sh" "-c" "firebase emulators:start"]