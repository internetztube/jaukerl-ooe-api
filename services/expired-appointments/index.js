const getUrls = require('./urls')
const fetch = require('node-fetch')

const main = async () => {
    const result = {}
    const urls = getUrls()
    for (let i = 0; i < urls.length; i++) {
        const {url, folder} = urls[i]
        try {
            result[folder] = await (await fetch(url)).json()
        } catch (e) {}
        result[folder].url = url
    }
    return result;
}

module.exports = main;