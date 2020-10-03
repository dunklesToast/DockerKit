import * as fs from 'fs';
import * as path from 'path';
import get from 'lodash.get';

const configPath = path.join(__dirname, '../../config.json');

class Configuration {
    private readonly configuration: Record<string, any>;

    constructor() {
        if (fs.existsSync(configPath)) {
            const config = fs.readFileSync(configPath).toString();
            this.configuration = JSON.parse(config);
        } else {
            throw new Error(`No Configuration found. File "${configPath}" does not exist.`);
        }
    }

    get(key: string) {
        return get(this.configuration, key);
    }
}

export default new Configuration();
