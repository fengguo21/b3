<template>
  <div id="app">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
@import './assets/css/_pub.scss';
@import './assets/css/style.scss';
@import './assets/css/my-el.scss';
@import './assets/css/position.scss';
@import './assets/css/page1003-el.scss';
@import './assets/css/page1006-el.scss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
}
.main-picker {
  // height: 100%;
  // overflow: auto;
  background: #fff;
  margin-top: 5px;
}
.aside.el-aside {
  width: 300px!important;

  .el-menu {
    width: 284px!important;
  }
}
@media screen and (max-width: 1700px) {
  @include fixWindow(1700);
}
@media screen and (max-width: 1500px) {
  @include fixWindow(1500);
}
@media screen and (max-width: 1300px) {
  @include fixWindow(1300);
}
@media screen and (max-width: 1100px) {
  @include fixWindow(1100);
}
@media screen and (max-width: 980px) {
  @include fixWindow(980);
}
</style>
