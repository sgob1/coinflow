<template>
  <button type="button" @click="onBackClick">Back</button>
  <BalanceComponent />
</template>

<script>
import BalanceComponent from '@/components/BalanceComponent.vue'
export default {
  components: {
    BalanceComponent
  },
  data() {
    return {}
  }
}
</script>

<style></style>
