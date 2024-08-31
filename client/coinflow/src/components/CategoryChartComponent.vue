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
      chart: undefined
    }
  },
  computed: {
    borderColor() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return '#ffffff'
      } else {
        return '#000000'
      }
    },
    hoverBorderColor() {
      return '#65c5ff'
    },
    chartOptions() {
      return {
        responsive: true,
        borderColor: this.borderColor,
        hoverBorderColor: this.hoverBorderColor,
        borderRadius: 1,
        borderWidth: 4,
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 21
              }
            }
          }
        }
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
