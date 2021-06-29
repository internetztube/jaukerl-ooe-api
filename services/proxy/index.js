const fetch = require('node-fetch')

const getAuthorities = async (birthdate) => {
  const request = await fetch(`https://e-gov.ooe.gv.at/at.gv.ooe.cip/services/api/covid/authorities?adminUnitId=1&birthdate=${birthdate}`)
  return await request.json()
}

const getCategories = async () => {
  const request = await fetch(`https://e-gov.ooe.gv.at/at.gv.ooe.cip/services/api/v2.0/categories?adminUnitId=1&onlyPrimaryVaccination=true`)
  return await request.json()
}

const appointmentsByAuthority = async (authority, birthdate, categories) => {
  const request = await fetch(`https://e-gov.ooe.gv.at/at.gv.ooe.cip/services/api/covid/slots?page=1&size=1000&orgUnitId=${authority.orgUnitId}&birthdate=${birthdate}`)
  let appointments = await request.json()
  appointments = appointments.map(o => {
    o.authority = authority
    o.category = categories.filter(c => c.id === o.categoryId)[0]
    o.startDateTimestamp = (new Date(o.startDate)).getTime()
    return o
  })
  return appointments
}

const main = async (birthdate) => {
  const categories = await getCategories()
  const authorities = await getAuthorities(birthdate)
  let appointments = []
  for (let i = 0; i < authorities.length; i++) {
    const authority = authorities[i]
    const result = await appointmentsByAuthority(authority, birthdate, categories)
    appointments = [].concat(appointments, result)
  }
  return {
    appointments,
    authorities,
    categories,
  }
}

module.exports = main
