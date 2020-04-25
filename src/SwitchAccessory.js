const {Accessory, Service, Characteristic, uuid, Categories} = require('hap-nodejs');
const {emitter, docker} = require('./Remote');

module.exports = class SwitchAccessory {
    constructor(name, id) {
        this.Switch = {
            name,
            model: 'Docker Container',
            category: Categories.SWITCH,
            container: docker.getContainer(name),
            setState: async function (state) {
                try {
                    if (state) await this.container.start();
                    else await this.container.stop();
                } catch (e) {
                    console.log(e.message)
                }
                console.log('Changing State from ' + name + ' to ' + state);
                this.state = state;
            },
            state: false,
            getState: async function () {
                console.log('[' + name + '] Getting ' + this.state);
                return this.state;
            },
            uuid: uuid.generate('hap-nodejs:accessoires:switch:docker:' + name),
            accessory: null
        };
        const that = this;
        emitter.on('update', async function (updateName, state) {
            if (name === updateName) {
                const newState = state === 'running';
                if(that.Switch.state !== newState) {
                    await that.Switch.setState(state === 'running');
                    console.log(updateName + ' state is now ' + that.Switch.state);
                    that.getAccessory().getService(Service.Switch).getCharacteristic(Characteristic.On).updateValue(that.Switch.state);
                }
            }
        })
    }

    getAccessory() {
        if (!this.Switch.accessory) {
            let acc;
            acc = new Accessory(this.Switch.name, this.Switch.uuid);
            acc.username = this.Switch.username;
            acc.pincode = this.Switch.pincode;
            acc
                .addService(Service.Switch, this.Switch.name)
                .getCharacteristic(Characteristic.On)
                .on('set', async (value, cb) => {
                    await this.Switch.setState(value);
                    cb();
                })
                .on('get', async (cb) => {
                    cb(null, await this.Switch.getState());
                });
            this.Switch.accessory = acc;
            return acc;
        } else return this.Switch.accessory;
    }
};
