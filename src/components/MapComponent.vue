<template>
  <div class="map-container">
    <div v-if="isLoading" class="loading">
      Carregando mapa...
    </div>
    <div v-else ref="mapContainer" class="map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import type { MapRegion, LevelConfig } from '../types/map'

import 'leaflet/dist/leaflet.css'


interface Props {
  zoneLevels: Record<string, number>
  levelConfig?: LevelConfig
  center?: [number, number]
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [-23.200, -45.864],
  zoom: 11,
  levelConfig: () => ({
    min: 1,
    max: 5,
    colors: ['#00BF63', '#FCB100', '#F97316', '#EA580C', '#D91532']
  })
})

const regions = ref<MapRegion[]>([])
const isLoading = ref(true)


const loadRegionsData = async () => {
  try {
    const response = await fetch('/data/regions.geojson')
    const geojsonData = await response.json()

    regions.value = geojsonData.features.map((feature: GeoJSON.Feature, index: number) => ({
      id: `zone-${index + 1}`,
      name: feature.properties?.Name || `Zone ${index + 1}`,
      level: props.zoneLevels[feature.properties?.Name] || 1,
      geojson: feature
    }))
  } catch (err) {
    console.error('Error loading regions:', err)
  } finally {
    isLoading.value = false
  }
}

const mapContainer = ref<HTMLElement>()
let map: L.Map | null = null
let geoJsonLayer: L.GeoJSON | null = null

const getColorForLevel = (level: number): string => {
  const { colors } = props.levelConfig
  const colorIndex = Math.max(0, Math.min(level - 1, colors.length - 1))
  return colors[colorIndex] || colors[0]
}

const getFeatureStyle = (feature?: GeoJSON.Feature): L.PathOptions => {
  if (!feature?.properties) {
    return {
      fillColor: props.levelConfig.colors[0],
      weight: 1.5,
      opacity: 0.8,
      color: '#ffffff',
      fillOpacity: 0.85
    }
  }

  const region = regions.value.find(r => r.id === feature.properties?.id)
  const level = region?.level || 0

  return {
    fillColor: getColorForLevel(level),
    weight: 1.5,
    opacity: 0.8,
    color: '#ffffff',
    fillOpacity: 0.65
  }
}

const createPopupContent = (regionId: string): string => {
  const region = regions.value.find(r => r.id === regionId)
  if (!region) return 'Unknown region'

  return `
    <div style="background: rgba(30, 30, 30, 0.95); color: #ffffff; padding: 8px; border-radius: 6px; backdrop-filter: blur(10px);">
      <h3 style="margin: 0 0 8px 0; color: #ffffff; font-size: 14px;">${region.name}</h3>
      <p style="margin: 4px 0; font-size: 12px;"><strong>Nível:</strong> ${region.level}</p>
    </div>
  `
}

const initMap = async () => {
  await nextTick()

  if (!mapContainer.value) return

  // desativar interações com o mapa (zoom, scroll, drag)
  map = L.map(mapContainer.value, {
    center: props.center,
    zoom: props.zoom,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false,
    touchZoom: false,
    attributionControl: false
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: 'lucas mapas',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map)

  updateRegions()
}

const updateRegions = () => {
  if (!map || isLoading.value) return

  if (geoJsonLayer) {
    map.removeLayer(geoJsonLayer)
  }

  const geoJsonData = {
    type: 'FeatureCollection' as const,
    features: regions.value.map(region => ({
      ...region.geojson,
      properties: {
        ...region.geojson.properties,
        id: region.id,
        name: region.name,
        level: region.level
      }
    }))
  }

  geoJsonLayer = L.geoJSON(geoJsonData, {
    style: getFeatureStyle,
    onEachFeature: (feature, layer) => {
      if (feature.properties?.id) {
        layer.bindPopup(createPopupContent(feature.properties.id))
      }

      layer.on({
        mouseover: (e) => {
          const target = e.target
          target.setStyle({
            weight: 2.5,
            fillOpacity: 0.95,
            color: '#ffffff'
          })
        },
        mouseout: (e) => {
          geoJsonLayer?.resetStyle(e.target)
        }
      })
    }
  })

  geoJsonLayer.addTo(map)

}

watch(regions, updateRegions, { deep: true })
watch(() => props.levelConfig, updateRegions, { deep: true })
watch(() => props.zoneLevels, async () => {
  await loadRegionsData()
}, { deep: true })

onMounted(async () => {
  await loadRegionsData()
  initMap()
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(219, 24, 24, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  cursor: default;
  box-shadow: none;
}

.loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
}

:deep(.leaflet-popup-content-wrapper) {
  background: rgba(30, 30, 30, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.leaflet-popup-tip) {
  background: rgba(30, 30, 30, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.leaflet-popup-content) {
  margin: 0 !important;
  color: #ffffff !important;
}

:deep(.leaflet-popup-close-button) {
  color: #ffffff !important;
  padding: 4px 8px !important;
}
</style>
