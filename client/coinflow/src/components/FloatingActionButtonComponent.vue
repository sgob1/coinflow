<template>
  <div class="floating-container">
    <div class="floating-button">+</div>
    <div class="element-container"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html,
body {
  background: #eaedf2;
  font-family: sans-serif;
}

.floating-container {
  position: fixed;
  width: 100px;
  height: 100px;
  bottom: 0;
  right: 0;
  margin: 40px 30px;
}

.floating-container:hover {
  height: 300px;
}

.floating-container:hover .floating-button {
  box-shadow: 0 10px 25px rgba(44, 179, 240, 0.6);
  -webkit-transform: translatey(5px);
  transform: translatey(5px);
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.floating-container .floating-button {
  position: absolute;
  width: 65px;
  height: 65px;
  background: #2cb3f0;
  bottom: 0;
  border-radius: 50%;
  left: 0;
  right: 0;
  margin: auto;
  color: white;
  line-height: 65px;
  text-align: center;
  font-size: 23px;
  z-index: 100;
  box-shadow: 0 10px 25px -5px rgba(44, 179, 240, 0.6);
  cursor: pointer;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.floating-button {
  font-weight: bold;
}
</style>
