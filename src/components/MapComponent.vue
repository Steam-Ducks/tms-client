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


interface ZoneLevel {
  id: string
  name: string
  level: number
  weatherCode: number
  cameras?: Camera[]
}

interface Camera {
  id: string
  address: string
  latitude: number
  longitude: number
  averageSpeed: number
  maxSpeed: number
}

interface Props {
  zoneLevels: ZoneLevel[]
  levelConfig?: LevelConfig
  center?: [number, number]
  zoom?: number
}

interface Emits {
  regionClick: [regionId: string]
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  center: () => [-23.200, -45.864],
  zoom: 11,
  levelConfig: () => ({
    min: 1,
    max: 5,
    colors: ['#00BF63', '#FCB100', '#F97316', '#D91532', '#81358B']
  })
})

const regions = ref<MapRegion[]>([])
const isLoading = ref(true)
const selectedRegionId = ref<string | null>(null)
const isAnimating = ref(false)


const loadRegionsData = async () => {
  try {
    const response = await fetch('/data/regions.geojson')
    const geojsonData = await response.json()

    regions.value = geojsonData.features.map((feature: GeoJSON.Feature, index: number) => {
      const zoneLevelData = props.zoneLevels.find(zone => zone.name === feature.properties?.Name)

      return {
        id: zoneLevelData?.id || `zone-${index + 1}`,
        name: feature.properties?.Name || `Zone ${index + 1}`,
        level: zoneLevelData?.level || 1,
        geojson: feature
      }
    })
  } catch (err) {
    console.error('Error loading regions:', err)
  } finally {
    isLoading.value = false
  }
}

const mapContainer = ref<HTMLElement>()
let map: L.Map | null = null
let geoJsonLayer: L.GeoJSON | null = null
let cameraMarkersLayer: L.LayerGroup | null = null

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
  const isSelected = selectedRegionId.value === feature.properties?.id

  return {
    fillColor: getColorForLevel(level),
    weight: 1.5,
    opacity: 0.8,
    color: '#ffffff',
    fillOpacity: isSelected ? 0.1 : 0.65
  }
}

const createCameraPopup = (camera: Camera): string => {
  return `
    <div style="background: rgba(30, 30, 30, 0.95); color: #ffffff; padding: 8px; border-radius: 6px; backdrop-filter: blur(10px); max-width: 200px;">
      <h4 style="margin: 0 0 8px 0; color: #ffffff; font-size: 12px;">📍 ${camera.address}</h4>
      <p style="margin: 4px 0; font-size: 11px;"><strong>Velocidade média:</strong> ${camera.averageSpeed} km/h</p>
      <p style="margin: 4px 0; font-size: 11px;"><strong>Velocidade máxima:</strong> ${camera.maxSpeed} km/h</p>
    </div>
  `
}

const showCamerasForRegion = (regionId: string) => {
  if (!map) return

  if (cameraMarkersLayer) {
    map.removeLayer(cameraMarkersLayer)
  }

  const selectedZone = props.zoneLevels.find(zone => zone.id === regionId)
  if (!selectedZone || !selectedZone.cameras) return

  cameraMarkersLayer = L.layerGroup()

  selectedZone.cameras.forEach(camera => {
    const cameraIcon = L.divIcon({
      html: `<div style="
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      className: 'camera-marker',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    })

    const marker = L.marker([camera.latitude, camera.longitude], {
      icon: cameraIcon
    })

    const popup = L.popup({
      closeButton: false,
      autoClose: false,
      closeOnEscapeKey: false,
      autoPan: false,
      offset: [0, -6]
    }).setContent(createCameraPopup(camera))

    marker.on({
      mouseover: () => {
        popup.setLatLng([camera.latitude, camera.longitude]).openOn(map!)
      },
      mouseout: () => {
        map!.closePopup(popup)
      }
    })

    cameraMarkersLayer!.addLayer(marker)
  })

  cameraMarkersLayer.addTo(map)
}

const hideCameras = () => {
  if (map && cameraMarkersLayer) {
    map.removeLayer(cameraMarkersLayer)
    cameraMarkersLayer = null
  }
}

const initMap = async () => {
  await nextTick()

  if (!mapContainer.value) return

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
  map.setView([props.center[0] + 0.03, props.center[1]], 11)

  map.on('dblclick', () => {
    // Block clicks during animation
    if (isAnimating.value) return

    isAnimating.value = true
    selectedRegionId.value = null
    hideCameras()  // Hide cameras when zooming out
    map!.flyTo([props.center[0] + 0.03, props.center[1]], 11, {
      animate: true,
      duration: 1.0
    })

    setTimeout(() => {
      isAnimating.value = false
    }, 1000)

    updateRegions()
  })

  map.on('click', () => {
    if (isAnimating.value) return

    if (selectedRegionId.value !== null) {
      isAnimating.value = true
      selectedRegionId.value = null
      hideCameras()
      map!.flyTo([props.center[0] + 0.03, props.center[1]], 11, {
        animate: true,
        duration: 1.0
      })

      setTimeout(() => {
        isAnimating.value = false
      }, 1000)

      updateRegions()
    }
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: 'lucas mapas',
    subdomains: 'abcd',
    opacity: 0.9
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
        layer.on({
          click: (e) => {
            if (isAnimating.value) return

            L.DomEvent.stopPropagation(e)

            const region = regions.value.find(r => r.id === feature.properties?.id)
            if (region) {
              isAnimating.value = true

              selectedRegionId.value = region.id

              const geoJsonLayer = layer as L.GeoJSON
              const bounds = geoJsonLayer.getBounds()
              const center = bounds.getCenter()

              map!.flyTo([center.lat, center.lng], 12, {
                animate: true,
                duration: 1.0
              })

              setTimeout(() => {
                isAnimating.value = false
                // Show cameras after zoom animation completes
                showCamerasForRegion(region.id)
              }, 1000)

              updateRegions()

              emit('regionClick', region.id)
            }
          },
          mouseover: (e) => {
            if (selectedRegionId.value !== null) return

            const target = e.target
            target.setStyle({
              weight: 2.5,
              fillOpacity: 0.95,
              color: '#ffffff'
            })
          },
          mouseout: (e) => {
            if (selectedRegionId.value !== null) return

            const target = e.target
            geoJsonLayer?.resetStyle(target)
          }
        })
      }
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
  position: static;
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
