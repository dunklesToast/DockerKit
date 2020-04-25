const Docker = require('dockerode');
const docker = new Docker();
exports.docker = docker;
const names = require('./names');
const storage = require('node-persist');
const {Bridge, uuid, Categories, AccessoryEventTypes} = require('hap-nodejs');
const Events = require('events').EventEmitter;
const EventEmitter = new Events();
exports.emitter = EventEmitter;
const SwitchAccessory = require('./SwitchAccessory');

storage.initSync();

const bridge = new Bridge('Docker', uuid.generate('Docker Bridge'));

bridge.publish({
    username: 'CC:22:3D:E3:CE:F6',
    port: 50045,
    pincode: '123-45-678',
    category: Categories.BRIDGE
});

for (let i in names) {
    if (!names.hasOwnProperty(i)) continue;
    const dev = new SwitchAccessory(names[i]);
    bridge.addBridgedAccessories({
        accessory: dev.getAccessory()
    });
}

async function sendUpdates() {
    const containerInfos = await docker.listContainers({
        all: true
    });
    for (let container in containerInfos) {
        const con = containerInfos[container];
        const name = con.Names[0];
        EventEmitter.emit('update', name.replace('/', ''), con.State)
    }
};

setInterval(sendUpdates, 5 * 1000);
