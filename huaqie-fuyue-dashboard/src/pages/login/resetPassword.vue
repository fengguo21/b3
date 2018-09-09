<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container" style="margin: 30px auto 0; width: 100%; width: 460px;">
    <h3 class="title">重置密码</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号">
        <template slot="prepend">
          <img class="my-icon" src="../../assets/images/icon-account.png" />
        </template>
      </el-input>
    </el-form-item>
    <el-button style="padding-top: 30px; padding-bottom: 0;" type="text" @click.native.prevent="sendCode">获取验证码</el-button>
    <el-form-item prop="code">
      <el-input type="text" v-model="ruleForm2.code" auto-complete="off" placeholder="验证码">
        <template slot="prepend">
          <img class="my-icon" slot="prefix" src="../../assets/images/icon-password.png" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="新密码">
        <template slot="prepend">
          <img class="my-icon" slot="prefix" src="../../assets/images/icon-password.png" />
        </template>
      </el-input>
    </el-form-item>
    <!--
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">确认重置</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      <el-button class="goLogin" style="margin-top:20px;" type="text" @click.native.prevent="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { requestResetPassword, sendCode } from '@/utils/api';

export default {
  name: 'reset-password',
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: '',
        code: '',
        checkPass: '',
      },
      rules2: {
        account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
        ],
        code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            //{ validator: validaePass2 }
        ],
        checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
        ],
      },
      checked: true,
    };
  },
  methods: {
    sendCode() {
      if (!this.ruleForm2.account) {
        this.$message.warning({
          message: '请输入账号',
        });
        return;
      }
      sendCode({
        customId: this.ruleForm2.account,
      }).then((res) => {
        if (res) {
          this.$message.success({
            message: '验证码已发送，请注意查收',
          });
        }
      });
    },
    handleLogin() {
      this.$router.push({ name: 'login' });
    },
    handleSubmit2() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.logining = true;

          const loginParams = {
            customId: this.ruleForm2.account,
            code: this.ruleForm2.code,
            password: this.ruleForm2.checkPass,
          };
          requestResetPassword(loginParams).then((ret) => {
            this.logining = false;
            if (ret) {
              this.$router.push({ name: 'login' });
            }
          });
        } else {
          console.log('error submit!!');
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../assets/css/_pub.scss';

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
.goLogin {
  color: $gray;
  margin: 0 auto;
}
</style>
