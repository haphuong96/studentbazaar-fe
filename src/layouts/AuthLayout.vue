<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: linear-gradient(45deg, #cfdaff, #ffffff, #ffffff, #9796f0);
  overflow: hidden;
}

.color-drop {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #ffffff;
  mix-blend-mode: color-dodge;
  animation: colorDropAnimation 5s linear infinite alternate;
}

@keyframes colorDropAnimation {
  0% {
    transform: translateY(-100px) translateX(-50%);
    opacity: 0;
  }
  100% {
    transform: translateY(100vh) translateX(-50%);
    opacity: 1;
  }
}

.blur-effect {
  backdrop-filter: blur(10px);
}
</style>
