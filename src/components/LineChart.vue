<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { Line } from 'vue-chartjs'; // Usa 'Line'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale, // Usaremos CategoryScale para as horas (0h, 1h, etc.)
  LinearScale,
} from 'chart.js';

import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(
  Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale
);

type TChartData = ChartData<'line'>;
type TChartOptions = ChartOptions<'line'>;

export default defineComponent({
  name: 'LineChart',
  components: { Line },
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

        layout: {
          padding: {
            bottom: 20,
          }
        },

        plugins: {
          legend: {
            position: 'top' as const,
            labels: { color: '#F8F8F8' }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.dataset.label}: ${context.parsed.y} km/h`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Velocidade Média (km/h)',
                color: '#F8F8F8',
            },
            ticks: {
              color: '#F8F8F8',
              callback: function(value: any) { return value + ' km/h'; }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
              drawBorder: false,
            }
          },
          x: {
            title: {
                display: true,
                text: 'Hora do Dia',
                color: '#F8F8F8',
            },
            ticks: { color: '#F8F8F8' },
            grid: { display: false }
          }
        },
        elements: {
            line: { tension: 0.3, borderWidth: 3 },
            point: { radius: 4 }
        }
      }),
    },
  },
});
</script>

