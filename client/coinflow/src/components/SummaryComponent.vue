<script>
// import DoughnutChart from '@/components/DoughnutCategoryChartComponent.vue'
import Spectrum from '@/utils/colors/Spectrum.js'
import fetcher from '@/utils/fetch/fetcher.js'

export default {
  components: {
    // DoughnutChart
  },
  data() {
    return { totalBalance: {}, dataReady: false }
  },
  computed: {},
  methods: {
    async getBalance() {
      this.balance = await fetcher.balance()
    },
    async initBalance() {
      await this.getBalance()
    }
  },
  async mounted() {
    await this.initBalance()
    this.totalAmount = this.balance['_total']
    this.dataReady = true
  }
}
</script>

<template>
  <div class="summary" id="summary">
    <div v-if="dataReady">Your monthly balance is {{ totalAmount }}€</div>
  </div>
</template>

<style scoped>
.summary {
  margin: 20% 10%;
  display: flex;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
}
</style>
