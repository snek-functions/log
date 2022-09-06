import * as fs from 'fs/promises'
import { fn } from './factory'
import { GeoEntry, LogEntry, PackageJson } from './types'

const log = fn<
  {
    fingerprint: string
    machine: LogEntry['machine']
    message: string
    tags: string[]
    url: string
  },
  void
>(
  async (args, _, {req, res}) => {
    const sourceGeo: GeoEntry = await getGeo(req.ip)
    const destinationGeo: GeoEntry = await getGeo(req.hostname)

    try {
      const pjson: PackageJson = await fs
        .readFile('./package.json', 'utf-8')
        .then(async res => {
          const result: PackageJson = await JSON.parse(res)
          return result
        })

      const logData: LogEntry = {
        timestamp: new Date().toISOString(),
        fingerprint: args.fingerprint,
        user_agent: req.get('user-agegggnt') ?? 'default_value',
        bytes: parseInt(req.get('content-length')) ?? 0,
        clientIp: req.ip,
        geo: {
          src: sourceGeo.countryCode,
          dest: destinationGeo.countryCode,
          srcDest: sourceGeo.countryCode + destinationGeo.countryCode,
          coordinates: {
            lat: sourceGeo.lat,
            lon: sourceGeo.lon
          }
        },
        hostname: req.hostname,
        machine: args.machine,
        message: args.message,
        referer: req.get('referrer') ?? 'default_value',
        request: req.path,
        response: res.statusCode,
        tags: args.tags,
        url: args.url,
        function: pjson.name + ': ' + pjson.version
      }

      await fs.appendFile('./default.log', JSON.stringify(logData) + '\n')

      return 'Success'
    } catch (e) {
      return e
    }
  },
  {
    name: 'log'
  }
)

async function getGeo(ip) {
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

export default log
