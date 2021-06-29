const timestamp = () => parseInt(new Date() / 1000)
const cacheDuration = 60 * 60 // 1h
const service = require('../services/expired-appointments/index')
let fetchedAt = 0;
let currentData = null;
let isFetching = false

const cachedData = async () => {
    if (isFetching) {
        // return old data
    } else if (!fetchedAt || fetchedAt + cacheDuration < timestamp()) {
        isFetching = true
        currentData = await service()
        fetchedAt = timestamp()
        isFetching = false
    }
    return currentData;

}

const overview = async (req, res) => {
    // let birthdate = req.query.birthdate || "1990-01-01"
    const data = await cachedData()
    const result = {}
    Object.keys(data).forEach((key) => {
        result[key] = {
            expiredSlots: data[key].expiredSlots,
        }
    })
    res.json(result)
}

const detail = async (req, res) => {
    const date = req.query.date
    console.log(date)
    const data = await cachedData()
    if (!data[date]) {
        return res.json({message: 'not found', success: false})
    }
    res.json({
        message: 'found',
        success: true,
        date,
        data: data[date]
    })
}


module.exports = {
    detail,
    overview,
}