const dayjs = require('dayjs')
const service = require('../services/expired-appointments/index')

const timestamp = () => parseInt(new Date() / 1000)
const cacheDuration = 60 // 1h
let fetchedAt = 0;
let currentData = null;
let isFetching = false

const cachedData = async () => {
    if (isFetching) {
        // return old data
    } else if (!fetchedAt || fetchedAt + cacheDuration < timestamp()) {
        isFetching = true
        try {
            currentData = await service()
            fetchedAt = timestamp()
        } catch (e) {
            console.log(e)
        }
        isFetching = false
    }
    return currentData;
}

const overview = async (req, res) => {
    const data = await cachedData()
    const result = {}
    if (data) {
        Object.keys(data).forEach((key) => {
            result[key] = {expiredSlots: data[key].expiredSlots,}
        })
    }
    res.json({fetchedAt: dayjs.unix(fetchedAt).toISOString(), isFetching, data: result})
}

const detail = async (req, res) => {
    const date = req.query.date
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