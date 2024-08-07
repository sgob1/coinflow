<template>
  <canvas id="categoryChart" :options="chartOptions" :data="chartData"></canvas>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  name: 'DoughnutChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: undefined,
      chartOptions: {
        responsive: true
      }
    }
  },
  methods: {
    create() {
      const ctx = document.getElementById('categoryChart')
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: this.chartData,
        options: this.chartOptions
      })
    }
  },
  mounted() {
    this.create()
  }
}
</script>
