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
};
