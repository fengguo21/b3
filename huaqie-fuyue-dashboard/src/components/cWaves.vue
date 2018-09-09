<template>
  <div id="waves_container" class="canvas-container">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="center position-y-center">
      <slot name="center"></slot>
    </div>
  </div>
</template>
<script>
  export default {
  };
</script>
<style scoped>
  .header {
    position: absolute;
    width: 100%;
    text-align: right;
    right: 0;
    top: 0;
    /*padding: 5px 120px;*/
  }
  .header a {
    color: #ffffff !important;
  }
  .center {
    text-align: center;
    color: #9cd7d1;
    overflow: hidden;
    right: 400px;
    left: inherit;
    top: 45%;
  }
  .canvas-container {
    height: 100%;
    width: 100%;
    position: relative;
    /*flex: 1;*/
    /*background-image: linear-gradient(70deg, #2061c2 0, #0d0525 100%);*/
    background: url('../assets/images/bg-golabl.png') no-repeat center left;
    background-size: 100% 100%;
  }
</style>
