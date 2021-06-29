const express = require('express')
const cors = require('cors')
const proxyEndpoint = require('./endpoints/proxy')
const {
    overview: overviewExpiredAppointmentsEndpoint,
    detail: detailExpiredAppointmentsEndpoint
} = require('./endpoints/expired-appointments')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.get('/', proxyEndpoint);
app.get('/expired-appointments/', overviewExpiredAppointmentsEndpoint)
app.get('/expired-appointments/detail', detailExpiredAppointmentsEndpoint)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
