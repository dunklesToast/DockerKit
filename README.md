# DockerKit
#### Control your Docker Containers with HomeKit.


### Requirements

- NodeJS & npm / yarn
- Docker running via `sock` file.

### Installation

1. Clone this repo
`git clone https://github.com/dunklesToast/DockerKit.git`
2. Go into it
`cd DockerKit`
3. Install Dependencies
`npm install` or `yarn`
4. Fill the names.json with all the Container Names you want to control
5. Start the Service
`node src/Remote`

Then go into the HomeKit App on your mobile Device (Mac does not work for pairing) and add a new Accessory.
The default Setup Code is `123-45-678`

### Todo:

- Fix 304 on first update
- Enable a mode where every container is controllable
- Create and publish Docker Container for this module


### Any cool ideas for this project?
Create an Issue or Pull Request ^^
