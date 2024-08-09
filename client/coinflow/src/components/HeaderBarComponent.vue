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
  position: fixed;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  display: flex;
  justify-content: space-between;
}
</style>
