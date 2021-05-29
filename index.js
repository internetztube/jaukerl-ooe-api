const express = require('express')
const cors = require('cors')
const service = require('./service')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

let fetchedAt = null
let fetchedAtDate = new Date()
const timestamp = () => parseInt(new Date() / 1000)
let data = null

app.get('/', async (req, res) => {
  if (!fetchedAt || fetchedAt + 10 < timestamp()) {
    console.log('fetch new')
    // data = await service()
    fetchedAt = timestamp()
  }
  res.json({fetchedAt, fetchedAtDate, data})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
