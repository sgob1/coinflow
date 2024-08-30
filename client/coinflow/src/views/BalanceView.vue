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
  },
  methods: {
    onBackClick() {
      this.$router.replace({ name: 'main' })
    }
  }
}
</script>

<style></style>
