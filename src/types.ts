export interface LogEntry {
    "timestamp": string,
    "fingerprint": string,
    "user_agent": string,
    "bytes": number,
    "clientIp": string,
    "geo": {
        "srcDest": string,
        "src": string,
        "dest": string,
        "coordinates": {
            "lat": number,
            "lon": number
        }
    },
    "hostname": string,
    "machine": {
        "ram": number,
        "os": string,
    },
    "message": string,
    "referer": string,
    "request": string,
    "response": number,
    "tags": string[],
    "url": string,
    "function": string
};

export interface GeoEntry {
    "countryCode": string,
    "lat": number,
    "lon": number
}

export interface PackageJson {
    "name": string,
    "version": string,
    "main": string,
    "private": boolean,
    "type": string,
    "description": string,
    "author": string,
    "dependencies": object,
    "devDependencies": object,
    "scripts": object,
    "sfDependencies": object
}
