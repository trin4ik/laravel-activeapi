let config = {}

const loadConfig = async () => {
    config = await fetch('./api.json').then(res => res.json())
}

export {
    loadConfig,
    config
}
