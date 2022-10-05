export interface LogEntry {
  timestamp: string
  fingerprint: string | null
  user_agent: string | null
  bytes: number | null
  clientIp: string | null
  geo: {
    srcDest: string | null
    src: string | null
    dest: string | null
    coordinates: {
      lat: number | null
      lon: number | null
    }
  }
  hostname: string | null
  machine: {
    ram: number | null
    os: string | null
  } | null
  message: string | null
  referer: string | null
  request: string | null
  response: number | null
  tags: string[]
  url: string | null
  function: string | null
}

export interface GeoEntry {
  countryCode: string
  lat: number
  lon: number
}

export interface PackageJson {
  name: string
  version: string
  main: string
  private: boolean
  type: string
  description: string
  author: string
  dependencies: object
  devDependencies: object
  scripts: object
  sfDependencies: object
}
