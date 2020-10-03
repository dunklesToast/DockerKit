import * as os from 'os';
import { Accessory, Bridge, Categories, uuid } from 'hap-nodejs';
import Dockerode from 'dockerode';
import Configuration from './helper/Configuration';
import Switch from './accessoires/Switch';

const docker = new Dockerode(Configuration.get('dockerode'));
const name = Configuration.get('bridge.deviceName').replace('$hostname', os.hostname()).replace(/\./, ' ');
const bridge = new Bridge(name, uuid.generate('Remote Bridge'));

bridge.publish({
    username: Configuration.get('bridge.mac'),
    pincode: Configuration.get('bridge.pincode'),
    port: Configuration.get('bridge.port'),
    category: Categories.BRIDGE,
});

(async function init() {
    const containers = await docker.listContainers({ all: true });
    const accessoires: Accessory[] = [];
    console.log(`Found ${containers.length} Containers.`);
    containers.forEach((container) => {
        const containerName = container.Names[0].replace('/', '');
        if (
            Configuration.get('containerNames').length === 0 ||
            Configuration.get('containerNames').includes(containerName)
        ) {
            console.log(`Publishing ${containerName}`);
            accessoires.push(new Switch(containerName).getAccessory());
        }
    });
    bridge.addBridgedAccessories(accessoires);
})();
