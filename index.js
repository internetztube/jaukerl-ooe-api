const express = require('express')
const index = express()
const port = process.env.PORT || 3000;
const service = require('./service')

let fetchedAt = null
const timestamp = () => parseInt(new Date() / 1000)
let data = null

index.get('/data.json', async (req, res) => {
  if (!fetchedAt || fetchedAt + 60 < timestamp()) {
    data = await service()
    fetchedAt = timestamp()
  }
  res.json({fetchedAt, data})
})

index.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
