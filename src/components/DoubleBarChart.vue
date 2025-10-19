<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

import type {
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

type TChartData = ChartData<'bar'>;
type TChartOptions = ChartOptions<'bar'>;

export default defineComponent({
  name: 'DoubleBarChart',
  components: { Bar },
  props: {
    chartData: {
      type: Object as PropType<TChartData>,
      required: true,
    },
    chartOptions: {
      type: Object as PropType<TChartOptions>,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,

        elements: {
          bar: {
            borderRadius: 15,
          }
        },

        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
                color: '#F8F8F8',
            }
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#F8F8F8',
              callback: function(value: any) {
                return value + ' km/h';
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
              borderDash: [5, 5],
              drawBorder: false,
            }
          },
          x: {
            ticks: {
              color: '#F8F8F8',
            },
            grid: {
              display: false,
            }
          }
        }
      }),
    },
  },
});
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
