import {GeoEntry} from '../types'

export async function getGeo(ip) {
  let geo: GeoEntry = {
    countryCode: 'FAIL',
    lat: 99,
    lon: 99
  }

  await fetch(
    `http://ip-api.com/json/${ip}?fields=status,countryCode,lat,lon`
  ).then(async res => {
    let response = await res.json()
    if (response.status !== 'fail') {
      geo = {...response}
    }
  })

  return geo
}