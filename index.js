const express = require('express')
const cors = require('cors')
const service = require('./service')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

let stateArray = []
const timestamp = () => parseInt(new Date() / 1000)
const cacheDuration = 60 // seconds

app.get('/', async (req, res) => {
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
    } catch (e) {}
    state.isFetching = false
  }
  res.json(state)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
