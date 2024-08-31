<template>
  <div id="balance-view" class="column-container">
    <button type="button" @click="onBackClick">Back</button>
    <BalanceComponent />
  </div>
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
