<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container" style="margin: 30px auto 0; width: 100%; width: 460px;">
    <h3 class="title">账户登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" placeholder="账号">
        <template slot="prepend">
          <img class="my-icon" src="../../assets/images/icon-account.png" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" placeholder="密码">
        <template slot="prepend">
          <img class="my-icon" slot="prefix" src="../../assets/images/icon-password.png" />
        </template>
      </el-input>
    </el-form-item>
    <div class="check-wrap">
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-button class="out-password" type="text" @click.native.prevent="handleReset2">忘记密码？</el-button>
    </div>
    <el-form-item style="width:100%; margin: 0">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as store from '@/utils/sdk/store';
  import { requestLogin, getSessionId } from '@/utils/api';

  export default {
    name: 'login',
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
        },
        rules2: {
          // account: [
          //   { required: true, message: '请输入账号', trigger: 'blur' },
          // ],
          // checkPass: [
          //   { required: true, message: '请输入密码', trigger: 'blur' },
          // ],
        },
        checked: true,
      };
    },
    methods: {
      handleReset2() {
        this.$router.push({ name: 'resetPassword' });
      },
      handleSubmit2() {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            const loginParams = { appTitle: '上海富悦大酒店', customId: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            getSessionId({}).then((res) => {
              store.set('sessionId', res);
              requestLogin(loginParams).then((ret) => {
                this.logining = false;

                if (!ret) {
                  return;
                }

                if (!ret.app) {
                  this.$message.error({
                    message: '没找到授权应用',
                  });
                  return;
                }
                if (ret) {
                  store.set('user', ret.people);
                  store.set('app', ret.app);
                  this.$router.push({ path: '/' });
                }
              });
            });
          } else {
            console.log('error submit!!');
          }
        });
      },
    },
    mounted() {
    },
  };
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
}
.logo{
  height: 77px;
  margin: 10px auto;
}
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-top: 48px;
  width: 350px;
  padding: 44px 40px;
  background: #fff;
  border: 1px solid #eaeaea;
  -webkit-box-shadow: 0 !important;
  /*box-shadow: 0 0 25px #cac6c6;*/
  .check-wrap {
    display: flex;
    justify-content: space-between;
    margin: 24px 0px 40px;
  }
  .title {
    margin: 0 auto;
    text-align: center;
    font-size: 24px;
    color: rgb(51, 51, 51);
    font-weight: normal;
    line-height: 1;
  }
  .el-form-item {
    margin: 32px auto 0;

    .my-icon {
      display: inline-block;
      width: 12px;
      height: 18px;
    }
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
