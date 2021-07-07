class Config {
	data = {}

	loadConfig = async () => {
		this.data = await fetch('./api.json').then(res => res.json())
	}

	groupList = () => {
		return Object.entries(this.data.api).map(item => item[0])
	}

	versionList = (group) => {
		return Object.entries(this.data.api[group].data).map(item => item[0])
	}

	controllerList = (group, version) => {
		return this.data.api[group].data[version].data
	}
}

const config = new Config()

const loadConfig = async () => {
	await config.loadConfig()
}


export default config
export {
	loadConfig
}
