const fetch = require('node-fetch')

Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
  }
});

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
    return o
  })
}

const appointmentsByAuthority = async (authority, birthdate, categories, maxPages) => {
  maxPages = maxPages || 1
  const promises = []
  for (let i = 0; i < maxPages; i++) {
    promises.push(getAppointmentsPage(authority, birthdate, categories, i))
  }
  return (await Promise.all(promises)).flat(1).map(o => {
    o.uid = `${o.startDate}__${o.authority.id}__${o.category.id}`
    return o
  })
}

const main = async (birthdate, maxPages) => {
  const categories = await getCategories()
  const authorities = await getAuthorities(birthdate)

  const promises = []
  for (let i = 0; i < authorities.length; i++) {
    const authority = authorities[i]
    promises.push(appointmentsByAuthority(authority, birthdate, categories, maxPages))
  }
  let appointments = {}
  (await Promise.all(promises)).flat(1).forEach(a => { appointments[a.uid] = a })
  appointments = Object.values(appointments)
  return {
    appointments,
    authorities,
    categories,
  }
}

module.exports = main
