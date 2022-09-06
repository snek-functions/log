import * as fs from 'fs';
import { fn } from './factory';
import { GeoEntry, LogEntry, PackageJson } from './types';

const log = fn<{ fingerprint: string, machine: LogEntry["machine"], message: string, tags: string[], url: string }, void>(
    async (args, _, { req, res }) => {
        let response;
        if (req.ip === '127.0.0.1') {
            response = await fetch(`http://ip-api.com/json/8.8.4.4?fields=status,countryCode,lat,lon`);
        }
        else {
            response = await fetch(`http://ip-api.com/json/${req.ip}?fields=status,countryCode,lat,lon`);
        }
        const sourceGeo: GeoEntry = await response.json();

        if (req.hostname === 'localhost') {
            response = await fetch(`http://ip-api.com/json/8.8.8.8?fields=status,countryCode,lat,lon`);
        }
        else {
            response = await fetch(`http://ip-api.com/json/${req.hostname}?fields=status,countryCode,lat,lon`);
        }
        const destinationGeo: GeoEntry = await response.json();

        try {
            const pjson: PackageJson = await JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
            const logData: LogEntry = {
                timestamp: new Date().toISOString(),
                fingerprint: args.fingerprint,
                user_agent: req.get('user-agent'),
                bytes: parseInt(req.get('content-length')),
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
                referer: req.get('referrer'),
                request: req.path,
                response: res.statusCode,
                tags: args.tags,
                url: args.url,
                function: pjson.name + ": " + pjson.version
            };

            fs.appendFileSync('./default.log', JSON.stringify(logData) + '\n');

            return 'Success';
        }
        catch (e) {
            return e;
        }
    },
    {
        name: 'log'
    }
)

export default log
