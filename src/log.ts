import * as fs from 'fs/promises'
import {fn} from './factory'
import {getGeo} from './helper/geo.js'
import {GeoEntry, LogEntry, PackageJson} from './types'

const log = fn<
  {
    fingerprint: string
    machine: LogEntry['machine']
    message: string
    tags: string[]
    url: string
  },
  'ERROR' | 'SUCCESS'
>(
  async (args, _, {req, res}) => {
    try {
      const sourceGeo: GeoEntry = await getGeo(req.ip)
      const destinationGeo: GeoEntry = await getGeo(req.hostname)
      const pjson: PackageJson = await fs
        .readFile('./package.json', 'utf-8')
        .then(async res => {
          const result: PackageJson = await JSON.parse(res)
          return result
        })

      const logData: LogEntry = {
        timestamp: new Date().toISOString(),
        fingerprint: args.fingerprint,
        user_agent: req.get('user-agent') ?? 'default_value',
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
      
      return 'SUCCESS'
    } catch (e) {
      const logData: LogEntry = {
        timestamp: new Date().toISOString(),
        fingerprint: null,
        user_agent: null,
        bytes: null,
        clientIp: null,
        geo: {
          src: null,
          dest: null,
          srcDest: null,
          coordinates: {
            lat: null,
            lon: null
          }
        },
        hostname: null,
        machine: null,
        message: e.message,
        referer: null,
        request: null,
        response: null,
        tags: ['ERROR', 'CRITICAL'],
        url: null,
        function: null
      }
      
      await fs.appendFile('./default.log', JSON.stringify(logData) + '\n')
      
      return 'ERROR'
    }
  },
  {
    name: 'log'
  }
)

export default log
