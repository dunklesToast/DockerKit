import Dockerode, { Container } from 'dockerode';
import { Accessory, Service, Characteristic, uuid, Categories, CharacteristicValue } from 'hap-nodejs';
import Configuration from '../helper/Configuration';

const docker = new Dockerode(Configuration.get('dockerode'));

export default class Switch {
    private Switch: Record<string, any>;

    private Container: Container;

    private State = false;

    constructor(name: string) {
        this.Container = docker.getContainer(name);
        this.Switch = {
            name,
            model: 'Docker Container',
            category: Categories.SWITCH,
            setState: async (state: boolean) => {
                const currentState = await this.Container.inspect();
                const isRunning = currentState.State.Running;
                if (isRunning !== state) {
                    try {
                        if (state) await this.Container.start();
                        else await this.Container.stop();
                        this.State = state;
                    } catch (e) {
                        console.error(`Unable to set new state for "${name}"`);
                        console.error(e);
                    }
                }
            },
            getState: () => this.State,
            uuid: uuid.generate(`hap-nodejs:accessoires:switch:docker:${name}`),
            accessory: null,
        };
        setInterval(async () => {
            const currentState = await this.Container.inspect();
            const isRunning = currentState.State.Running;
            if (isRunning !== this.Switch.getState) {
                this.getAccessory()
                    .getService(Service.Switch)
                    ?.getCharacteristic(Characteristic.On)
                    .updateValue(isRunning);
            }
        }, Configuration.get('updateInterval') * 1000);
    }

    getAccessory(): Accessory {
        if (this.Switch.accessory) return this.Switch.accessory;
        const accessory = new Accessory(this.Switch.name, this.Switch.uuid);
        accessory
            .addService(Service.Switch, this.Switch.name)
            .getCharacteristic(Characteristic.On)
            .on('set', async (value: CharacteristicValue, cb: () => void) => {
                this.Switch.setState(value);
                cb();
            })
            .on('get', async (cb: (arg0: any) => void) => {
                cb(this.Switch.getState());
            });
        this.Switch.accessory = accessory;
        return accessory;
    }
}
