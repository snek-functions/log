import * as fs from 'fs';
import { fn } from './factory';
import { LogEntry } from './types';


const log = fn<{ fingerprint: string, machine: LogEntry["machine"], message: string, tags: string[], url: string }, void>(
    async (args, _, { req, res }) => {
        let sourceIp = req.ip;
        let response = await fetch(`http://ip-api.com/json/8.8.4.4?fields=status,countryCode,lat,lon`);
        //let response = await fetch(`http://ip-api.com/json/${sourceIp}?fields=status,countryCode,lat,lon`);
        let sourceGeo = await response.json();
        response = await fetch(`http://ip-api.com/json/8.8.8.8?fields=status,countryCode,lat,lon`);
        //let response = await fetch(`http://ip-api.com/json/${req.hostname}?fields=status,countryCode,lat,lon`);
        let destinationGeo = await response.json();

        let logData: LogEntry = {
            timestamp: new Date().toISOString(),
            fingerprint: args.fingerprint,
            user_agent: req.get('user-agent'),
            bytes: parseInt(req.get('content-length')),
            clientIp: sourceIp,
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
            referer: req.get('referrer'),
            request: req.path,
            response: res.statusCode,
            tags: args.tags,
            url: args.url
        };

        fs.appendFileSync('./default.log', JSON.stringify(logData) + '\n')
    },
    {
        name: 'log'
    }
)

export default log
