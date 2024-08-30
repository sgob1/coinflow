<template>
  <h2>{{ title }}</h2>
  <canvas :id="chartID" :options="chartOptions" :data="chartData"></canvas>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  props: {
    chartID: String,
    title: String,
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
      const ctx = document.getElementById(this.chartID)
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
