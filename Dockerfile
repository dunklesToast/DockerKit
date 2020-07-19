FROM node:14-alpine

WORKDIR /usr/app

RUN apk --no-cache add dbus nodejs avahi avahi-compat-libdns_sd avahi-dev

COPY . .

RUN yarn

VOLUME [ "/usr/app/config.json", "/var/run/docker.sock" ]

ENTRYPOINT ["node", "src/DockerKit.js"]
