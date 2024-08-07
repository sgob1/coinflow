<template>
  <div id="headerbar">
    <img src="@/assets/magnifying-glass.png" alt="Search" class="icon" />
    <img src="@/assets/user.png" alt="Account" class="icon" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  }
}
</script>

<style scoped>
.icon {
  height: 50px;
  width: 50px;
}

#headerbar {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
