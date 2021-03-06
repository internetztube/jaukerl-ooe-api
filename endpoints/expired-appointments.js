const dayjs = require('dayjs')
const service = require('../services/expired-appointments/index')

const timestamp = () => parseInt(new Date() / 1000)
const cacheDuration = 60 * 60 * 6; // 6h
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

const expiredSlotsByLocation = (appointments) => {
    const result = {}
    appointments.forEach((appointment) => {
        const authorityId = appointment.authority.id
        if (!result[authorityId]) {
            result[authorityId] = {
                expiredSlots: 0,
                authority: appointment.authority
            }
        }
        result[authorityId].expiredSlots += appointment.freeSlots
    })
    return result
}

const overview = async (req, res) => {
    const data = await cachedData()
    const result = {}
    if (data) {
        Object.keys(data).forEach((key) => {
            result[key] = {
                expiredSlots: data[key].expiredSlots,
                byAuthority: expiredSlotsByLocation(data[key].appointments)
            }
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

    const response = {
        message: 'found',
        success: true,
        date,
        data: data[date]
    }

    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(response, null, 2));
}


module.exports = {
    detail,
    overview,
}