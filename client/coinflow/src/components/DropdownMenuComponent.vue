<template>
  <button class="dropdownMenuButton" ref="menu" @click="toggleMenu">{{ menuTitle }}</button>
  <div class="dropdownMenu" v-if="isActive">
    <div class="menuArrow" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    menuTitle: String
  },
  data() {
    return {
      active: false
    }
  },
  methods: {
    toggleMenu() {
      var _this = this
      const closeListerner = (e) => {
        if (_this.catchOutsideClick(e, _this.$refs.menu))
          window.removeEventListener('click', closeListerner), (_this.isOpen = false)
      }
      window.addEventListener('click', closeListerner)
      this.active = !this.active
    },
    catchOutsideClick(event, dropdown) {
      if (dropdown == event.target) return false
      if (this.isActive && dropdown != event.target) return true
    }
  },
  computed: {
    isActive() {
      return this.active
    }
  }
}
</script>

<style>
.dropDownMenuButton {
  position: relative;
}

.dropdownMenu {
  position: absolute;
  top: 10px;
  border-radius: 8px;
  border: 1px solid #eee;
  box-shadow: 10px 10px 0 0 rgba(black, 0.03);
  background: white;
  padding: 10px 30px;
  animation: menu 0.3s ease forwards;
}
</style>
