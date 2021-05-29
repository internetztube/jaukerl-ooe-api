const fetch = require('node-fetch')

const getAuthorities = async () => {
  const request = await fetch('https://e-gov.ooe.gv.at/at.gv.ooe.cip/services/api/covid/authorities?adminUnitId=1&birthdate=1990-01-01')
  return await request.json()
}

const appointmentsByAuthority = async (authority) => {
  const request = await fetch(`https://e-gov.ooe.gv.at/at.gv.ooe.cip/services/api/covid/slots?page=1&size=1000&orgUnitId=${authority.orgUnitId}&birthdate=1990-01-01`)
  let appointments = await request.json()
  appointments = appointments.map(o => {
    o.authority = authority
    o.startDateTimestamp = (new Date(o.startDate)).getTime()
    return o
  })
  return appointments
}

const main = async () => {
  const authorities = await getAuthorities()
  let appointments = []
  for (let i = 0; i < authorities.length; i++) {
    const authority = authorities[i]
    const result = await appointmentsByAuthority(authority)
    appointments = Object.assign(appointments, result)
  }
  return appointments
}

module.exports = main
