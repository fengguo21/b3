<template>
  <div class="login">
    <c-waves>
      <div slot="center">
        <div class="sys-header">
          <img class="logo" src="../../assets/images/logo.png" />
          <div class='sys-title'>富悦大酒店会议订房系统</div>
        </div>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </c-waves>
  </div>
</template>

<script>
  import cWaves from '@/components/cWaves';
  import * as store from '@/utils/sdk/store';
  import { getSessionId } from '@/utils/api';

  export default {
    name: 'login',
    components: {
      cWaves,
    },
    data() {
      return {};
    },
    methods: {},
    mounted() {
      getSessionId({}).then((data) => {
        store.set('sessionId', data);
        // console.log(data)
      });
    },
  };
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
}
.sys-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  color: #fff;
}
.sys-title {
  font-size: 30px;
}
.logo{
  width: 46px;
  height: 50px;
  margin-right: 20px;
}
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 40px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  /*box-shadow: 0 0 25px #cac6c6;*/
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}

.full-screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.bg-purple-dark {
  background: #99a9bf;
}
.grid-content {
  border-radius: 4px;
  text-align: center;
  height: 36px;
  line-height: 36px;
}
.el-menu--horizontal .el-menu-item {
  float: right !important;
}
.el-menu{
  padding-right: 60px;
}
</style>
