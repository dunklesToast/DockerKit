# DockerKit
#### Control your Docker Containers with HomeKit.

### Requirements

- NodeJS & npm / yarn

### Configuration
A very basic configuration is located in the config.json in the Repositories root-directory.

```json
{
  "dockerode": {
    <configuration for docker connector. head over to https://www.npmjs.com/package/dockerode for more info. If empty it uses the /var/run/docker.sock>
  },
  "containerNames": [
    <add some container names here and only them will be published as a homekit device. if this is empty, every container will be publishes>
  ],
  "bridge": {
    "deviceName": "The HomeKit Bridge Name. You can use $hostname as a variable for the device's hostname. This does not work everytime. If you can't find the bridge use a normal name like Docker",
    "mac": "Some MAC Address for the Bridge. If you have multiple DockerKit Instances, they need different MACs",
    "port": 50045,
    "pincode": "Setup PinCode. XXX-XX-XXX, numbers only"
  }
}
```

### Installation

1. Clone this repo
`git clone https://github.com/dunklesToast/DockerKit.git`
2. Go into it
`cd DockerKit`
3. Install Dependencies
`npm install` or `yarn`
4. Start the Service
`node src/DockerKit`

Then go into the HomeKit App on your mobile Device (Mac does not work for pairing) and add a new Accessory.
The default Setup Code is `123-45-678`

### Todo:

- ~~Fix 304 on first update~~
- ~~Enable a mode where every container is controllable~~
- Create and publish Docker Container for this module 
- Create a dimmable Light for Docker Swarm (idea by u/DuffMaaaann)
- Basic Server statistics (idea by u/DuffMaaaann)
- Fix issue with hostnames as Bridge Name

### Any cool ideas for this project?
Create an Issue or Pull Request ^^
