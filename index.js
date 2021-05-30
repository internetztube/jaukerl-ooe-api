const express = require('express')
const cors = require('cors')
const service = require('./service')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

let fetchedAt = null
const timestamp = () => parseInt(new Date() / 1000)
let data = null
let isFetching = false
const cacheDuration = 10 // seconds

app.get('/', async (req, res) => {
  if (isFetching) {
    // return old data
  } else if (!fetchedAt || fetchedAt + cacheDuration < timestamp()) {
    isFetching = true
    console.log('fetch new data')
    try {
      data = await service()
      fetchedAt = timestamp()
    } catch (e) {}
    isFetching = false
  }
  res.json({isFetching, fetchedAt, data})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
