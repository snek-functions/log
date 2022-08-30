export interface Log {
    "timestamp": string,
    "fingerprint": string,
    "user_agent": string,
    "bytes": number,
    "clientIp": string,
    "extension": string,
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
    "ip": string,
    "machine": {
        "ram": number,
        "os": string,
    },
    "message": string,
    "referer": string,
    "request": string,
    "response": number,
    "tags": [string],
    "url": string,
};
