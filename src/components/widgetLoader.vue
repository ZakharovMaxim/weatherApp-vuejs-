<template>
  <div class="loader">
    <div class="loader__animation">
      <span class="loader__icon"></span>
    </div>
    <div class="loader__text">
      Ищем погоду..
    </div>
  </div>
</template>
<script>
  export default {
      name: 'widgetLoader'
  }
</script>
<style scoped>
.loader {
  width: 200px;
  height: 60px;
  position: absolute;
  top: 60%;
  left: 50%;
  margin-left: -100px;
}
.loader__animation {
  width: 100%;
  height: 55px;
}
.loader__icon {
  margin: auto;
  display: block;
  width: 50px;
  height: 50px;
  background: url('../assets/loaders/sun.gif') no-repeat;
  animation: moving .5s linear infinite alternate, changeBg .5s ease-in-out infinite alternate;
}
.loader__text {
  width: 100%;
  text-align: center;
}
@keyframes moving {
  0% {
    transform: translateX(-150px) rotateZ(0);
  }
  100% {
    transform: translateX(150px) rotateZ(270deg);
  }
}
@keyframes changeBg {
  0% {
    background-image: url('../assets/loaders/sun.gif');
  }
  100% {
    background-image: url('../assets/loaders/moon.gif');
  }
}
</style>
