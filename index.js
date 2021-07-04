const express = require('express')
const cors = require('cors')
const {
    main: proxyMainEndpoint,
    all: proxyAllEndpoint
} = require('./endpoints/proxy')
const {
    overview: overviewExpiredAppointmentsEndpoint,
    detail: detailExpiredAppointmentsEndpoint
} = require('./endpoints/expired-appointments')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.get('/', proxyMainEndpoint);
if (process.env.ENABLE_ALL_ENDPOINT) {
    app.get('/all', proxyAllEndpoint);
}
app.get('/expired-appointments/', overviewExpiredAppointmentsEndpoint)
app.get('/expired-appointments/detail', detailExpiredAppointmentsEndpoint)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
