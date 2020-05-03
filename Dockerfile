FROM    node:alpine

RUN     mkdir /app
WORKDIR /app

ADD     . .
RUN     npm install 

VOLUME [ "/app/config.json", "/var/run/docker.sock" ]


CMD     sh -c "npm run dockerkit"
