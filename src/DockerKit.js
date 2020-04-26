const config = require('../config');
const Docker = require('dockerode');
const UpdateListener = require('./UpdateListener');
const docker = new Docker(config.dockerode);
exports.docker = docker;
const storage = require('node-persist');
const os = require('os');
storage.initSync();
const {Bridge, uuid, Categories} = require('hap-nodejs');
const Events = require('events').EventEmitter;
const emitter = new Events();
exports.emitter = emitter;
const SwitchAccessory = require('./SwitchAccessory');
var ListAllContainers = false

// Creates the Bridge. $hostname can be used as a variable for the Device's hostname
const name = config.bridge.deviceName.replace('$hostname', os.hostname()).replace(/\./, ' ');
const bridge = new Bridge(name, uuid.generate('Remote Bridge'));

bridge.publish({
    username: config.bridge.mac,
    port: config.bridge.port,
    pincode: config.bridge.pincode,
    category: Categories.BRIDGE
});

// This function publishes all the Services defined in the config.containerNames. If it is empty, "all" will be true.
// If "all" is true the Service publishes every container that is available at start of the software.
// TODO Re Publish Devices every x minutes

async function publishServices(all) {
    const containerInfos = await docker.listContainers({all: config.bridge.listStoppedContainers});
    for (let i in containerInfos) {
        if (!containerInfos.hasOwnProperty(i)) continue;
        const containerName = containerInfos[i].Names[0].replace('/', '');
        if (all) {
            const dev = new SwitchAccessory(containerName);
            bridge.addBridgedAccessories({
                accessory: dev.getAccessory()
            });
            console.log('[BRIDGE] Added Accessory ' + containerName)
        } else if (config.containerNames.includes(containerName)) {
            const dev = new SwitchAccessory(containerName);
            bridge.addBridgedAccessories({
                accessory: dev.getAccessory()
            });
            console.log('[BRIDGE] Added Accessory ' + containerName)
        }
    }
}

setInterval(async function f() {
    await UpdateListener(docker, emitter);
}, 5 * 1000);

publishServices(config.containerNames.length === 0);

