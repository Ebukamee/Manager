<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { 
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, 
  CategoryScale, LinearScale 
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  completed: number
  pending: number
  expired: number
}>()

const chartData = computed(() => ({
  labels: ['Current Progress'],
  datasets: [
    { label: 'Completed', backgroundColor: '#0ea5e9', data: [props.completed], borderRadius: 0 },
    { label: 'Pending', backgroundColor: '#cbd5e1', data: [props.pending], borderRadius: 0 },
    { label: 'Expired', backgroundColor: '#f43f5e', data: [props.expired], borderRadius: 0 }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { 
      beginAtZero: true, 
      display: true, 
      ticks: { stepSize: 1, font: { size: 10, weight: 'bold' } },
      grid: { color: '#f1f5f9' } 
    },
    x: { grid: { display: false } }
  },
  plugins: {
    legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 10, weight: 'bold' } } }
  }
}
</script>

<template>
  <div class="h-full w-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>