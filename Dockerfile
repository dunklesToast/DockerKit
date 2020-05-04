FROM    node:alpine

RUN     mkdir /app
WORKDIR /app

ADD     src ./src
ADD     package.json .
ADD     yarn.lock .
RUN     yarn install 

VOLUME [ "/app/config.json", "/var/run/docker.sock" ]

CMD     sh -c "yarn run dockerkit"
