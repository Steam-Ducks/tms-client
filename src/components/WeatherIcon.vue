<template>
  <div class="weather-icon">
    <div class="icon-container">
      <video
        ref="videoRef"
        :src="weatherData.video"
        @mouseenter="playVideo"
        @mouseleave="pauseAndReset"
        @loadeddata="resetToFirstFrame"
        class="weather-video"
        muted
        playsinline
        preload="metadata"
        :loop="false"
      />
    </div>
    <p class="weather-description">{{ weatherData.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  weatherCode: number
}

const props = defineProps<Props>()
const videoRef = ref<HTMLVideoElement>()

const playVideo = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0 // Reset to start
    videoRef.value.play()
  }
}

const pauseAndReset = () => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0 // Back to first frame
  }
}

const resetToFirstFrame = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0
  }
}

const weatherData = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  const isNightTime = hour < 6 || hour >= 18 // Night between 6 PM and 6 AM

  // Weather code mapping to available videos
  const getWeatherData = (code: number) => {
    // Clear sky (0-1) - time-based sun/moon
    if (code >= 0 && code <= 1) {
      if (isNightTime) {
        return {
          video: '/src/assets/weather/night.mp4',
          description: 'Noite Clara'
        }
      } else {
        return {
          video: '/src/assets/weather/sun.mp4',
          description: 'Ensolarado'
        }
      }
    }

    // Partly cloudy to overcast (2-3, 45-48)
    if (code >= 2 && code <= 3 || code >= 45 && code <= 48) {
      return {
        video: '/src/assets/weather/clouds.mp4',
        description: 'Nublado'
      }
    }

    // Light to heavy rain (51-65)
    if (code >= 51 && code <= 65) {
      return {
        video: '/src/assets/weather/rain.mp4',
        description: 'Chuva'
      }
    }

    // Snow (71-75) - map to rain as closest available
    if (code >= 71 && code <= 75) {
      return {
        video: '/src/assets/weather/rain.mp4',
        description: 'Precipitação'
      }
    }

    // Thunderstorm (80-82, 95-99)
    if ((code >= 80 && code <= 82) || (code >= 95 && code <= 99)) {
      return {
        video: '/src/assets/weather/storm.mp4',
        description: 'Tempestade'
      }
    }

    // Default fallback to sunny during day, night during night
    if (isNightTime) {
      return {
        video: '/src/assets/weather/night.mp4',
        description: 'Noite'
      }
    } else {
      return {
        video: '/src/assets/weather/sun.mp4',
        description: 'Tempo Bom'
      }
    }
  }

  return getWeatherData(props.weatherCode)
})
</script>

<style scoped>
.weather-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.icon-container {
  width: 200px;
  height: 200px;
  border-radius: 50%;

  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.icon-container:hover {
  transform: scale(1.05);
}

.weather-video {
  border-radius: 100%;
  width: 200px;
  height: 200px;
  object-fit: contain;
  cursor: pointer;
}

.weather-description {
  margin-top: 12px;
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  font-family: 'Figtree', sans-serif;
}

/* Responsive sizing */
@media (max-width: 768px) {
  .icon-container {
    width: 60px;
    height: 60px;
  }

  .weather-video {
    width: 45px;
    height: 45px;
  }

  .weather-description {
    font-size: 12px;
  }
}
</style>
