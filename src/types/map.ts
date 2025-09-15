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

export interface ZoneLevel {
  id: string
  name: string
  level: number
}

export interface MapProps {
  zoneLevels: ZoneLevel[]
  levelConfig?: LevelConfig
  center?: [number, number]
  zoom?: number
}
