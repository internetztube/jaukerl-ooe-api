const fetch = require('node-fetch')

const getAuthorities = async (birthdate) => {
  const request = await fetch(`https://e-gov.ooe.gv.at/at.gv.ooe.cip/services/api/covid/authorities?adminUnitId=1&birthdate=${birthdate}`)
  return await request.json()
}

const getCategories = async () => {
  const request = await fetch(`https://e-gov.ooe.gv.at/at.gv.ooe.cip/services/api/v2.0/categories?adminUnitId=1&onlyPrimaryVaccination=true`)
  return await request.json()
}

const getAppointmentsPage = async (authority, birthdate, categories, pageIndex) => {
  const url = `https://e-gov.ooe.gv.at/at.gv.ooe.cip/services/api/covid/slots?page=${pageIndex}&size=20&orgUnitId=${authority.orgUnitId}&birthdate=${birthdate}`
  const request = await fetch(url)
  let appointments = await request.json()
  return appointments.map(o => {
    o.authority = authority
    o.category = categories.filter(c => c.id === o.categoryId)[0]
    o.startDateTimestamp = (new Date(o.startDate)).getTime()
    o.uid = `${o.startDate}__${o.authority.id}__${o.category.id}`
    return o
  })
}

const appointmentsByAuthority = async (authority, birthdate, categories, maxPages) => {
  maxPages = maxPages || 1
  let result = []
  for (let i = 1; i <= maxPages; i++) {
    const paged = await getAppointmentsPage(authority, birthdate, categories, i)
    if (!paged.length) break;
    result = [...result, ...paged]
  }
  return result
}

const main = async (birthdate, maxPages) => {
  const categories = await getCategories()
  const authorities = await getAuthorities(birthdate)
  let appointments = []
  for (let i = 0; i < authorities.length; i++) {
    const authority = authorities[i]
    const result = await appointmentsByAuthority(authority, birthdate, categories, maxPages)
    appointments = [].concat(appointments, result)
  }


  let appointmentsYo = {}
  appointments.forEach(a => appointmentsYo[a.uid] = a)
  appointments = Object.values(appointmentsYo)

  return {
    appointments,
    authorities,
    categories,
  }
}

module.exports = main
