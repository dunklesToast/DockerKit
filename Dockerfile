FROM node:14-alpine

WORKDIR /usr/app

RUN apk --no-cache add dbus nodejs avahi avahi-compat-libdns_sd avahi-dev

COPY ["./package.json", "./yarn.lock", "./"]

RUN yarn

COPY ["tsconfig.json", "./"]
COPY src src

RUN yarn tsc

VOLUME [ "/usr/app/config.json", "/var/run/docker.sock" ]

ENTRYPOINT ["node", "dist/DockerKit.js"]
