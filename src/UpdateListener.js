async function sendUpdates(docker, emitter) {
    const containerInfo = await docker.listContainers({
        all: true
    });
    for(let container in containerInfo) {
        const con = containerInfo[container];
        const name = con.Names[0];
        emitter.emit('update', name.replace('/', ''), con.State)
    }
}

module.exports = sendUpdates;
