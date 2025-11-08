import type { Feature, Geometry } from 'geojson'

export interface MapRegion {
  id: string
  name: string
  geojson: Feature<Geometry>
  level: number
}

export interface LevelConfig {
  min: number
  max: number
  colors: string[]
}

export interface MapData {
  regions: MapRegion[]
  levelConfig: LevelConfig
}

export interface Camera {
  id: string
  address: string
  latitude: number
  longitude: number
  averageSpeed: number
}

export interface ZoneLevel {
  id: string
  name: string
  level: number
  weatherCode: number
  cameras?: Camera[]
}

export interface MapProps {
  zoneLevels: ZoneLevel[]
  levelConfig?: LevelConfig
  center?: [number, number]
  zoom?: number
}
