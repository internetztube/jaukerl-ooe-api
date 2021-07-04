let stateArray = []
const timestamp = () => parseInt(new Date() / 1000)
const cacheDuration = 30 // seconds
const service = require('../services/proxy/index')

const main = async (req, res) => {
    let birthdate = req.query.birthdate || "1990-01-01"
    let state = stateArray[birthdate]

    if (!state) {
        state = {
            isFetching: false,
            fetchedAt: null,
            birthdate,
            data:  null
        }
        stateArray[birthdate] = state
    }

    if (state.isFetching) {
        // return old data
    } else if (!state.fetchedAt || state.fetchedAt + cacheDuration < timestamp()) {
        state.isFetching = true
        console.log(`fetch new data for ${birthdate}`)
        try {
            state.data = await service(birthdate)
            state.fetchedAt = timestamp()
        } catch (e) {
            console.log(e)
        }
        state.isFetching = false
    }

    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(state, null, 2));
}

const all = async (req, res) => {
    let birthdate = req.query.birthdate || "1990-01-01"
    const data = await service(birthdate, 100)
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(data, null, 2));
}

module.exports = {
    main,
    all,
}