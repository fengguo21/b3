<template>
  <div class="home">
    <el-container class="container">
      <!-- header start -->
      <el-header class="header">
        <el-row>
          <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
          <img src="../assets/images/logo-red.png" />{{collapsed?'':sysName}}会议订房管理系统
          </el-col>

          <el-col :span="10" class="userinfo">
            <el-dropdown trigger="hover">
              <span class="el-dropdown-link userinfo-inner"><img :src="sysUserAvatar" /> {{sysUserName}}</span>
              <el-dropdown-menu slot="dropdown">
                <!--<el-dropdown-item>我的消息</el-dropdown-item>-->
                <el-dropdown-item @click.native="handleUpdate">设置个人信息</el-dropdown-item>
                <el-dropdown-item @click.native="handleUpdateNotify">设置通知</el-dropdown-item>
                <el-dropdown-item @click.native="handleUpdatePassword">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </el-col>
        </el-row>
      </el-header>
      <!-- header end -->
      <!-- body start -->
      <el-container class="body">
        <!-- menu start -->
        <!-- 启动router模式 -->
        <el-aside class="aside">
          <el-menu
            class="menu"
            :default-active="$route.path"
            unique-opened
            router
            text-color="rgb(57, 73, 87)"
            active-text-color="rgb(57, 73, 87)"
          >
            <template v-for="(item,index) in menus" v-if="!item.hidden">
              <el-menu-item v-if="item.leaf&&!item.children" :index="'/menus/' + item.name" :key="index">
                <img :src="item.icon" /><span>{{item.meta.name}}</span><span v-if="item.path=='menus/page1004' && unread" @click="flushUnread" class="red-point">{{ unread }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>

        <!-- menu end -->
        <!-- main start -->
        <el-main class="main">
          <div class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
          <p class="main-footer">@2014-2017 小订房提供技术支持 &nbsp;&nbsp;&nbsp;&nbsp;客服电话：021-6786 6532</p>
        </el-main>
        <!-- main end -->
      </el-container>
      <!-- body end -->
    </el-container>

    <!-- 设置个人信息 start -->
    <el-dialog title="设置个人信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="editForm.tel" auto-complete="off"></el-input>
        </el-form-item>
        <!--
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        -->
        <el-form-item label="头像">
          <el-upload
          class="avatar-uploader"
          :action="avatarPath"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>
    <!-- 设置个人信息 end -->

    <!-- 设置密码界面 start -->
    <el-dialog title="修改密码" :visible.sync="editPasswordFormVisible" :close-on-click-modal="false" @close='initPSW'>
      <el-row>
      <el-col :span="12">
      <el-form :model="editPasswordForm" label-width="120px" :rules="editPasswordFormRules" ref="editPasswordForm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type='password' v-model="editPasswordForm.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type='password' v-model="editPasswordForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="rePassword">
          <el-input type='password' v-model="editPasswordForm.rePassword" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editPasswordFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editPasswordSubmit" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 设置密码界面 end -->

    <!-- 设置通知界面 start -->
    <el-dialog title="修改通知设置" :visible.sync="editNotifyFormVisible" :close-on-click-modal="false">
      <el-row>
      <el-col :span="24">
      <el-form :model="editNotifyForm" label-width="120px" :rules="editNotifyFormRules" ref="editNotifyForm">
        <el-form-item label="开启提示音">
          <el-switch
            v-model="editNotifyForm.audio"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item label="订房订单提示">
           <el-radio v-model="editNotifyForm.book" :label="1">新订单时提示</el-radio>
           <el-radio v-model="editNotifyForm.book" :label="2">订单支付时提示</el-radio>
           <el-radio v-model="editNotifyForm.book" :label="3">不提示</el-radio>
        </el-form-item>
        <el-form-item label="团餐订单提示">
          <el-radio v-model="editNotifyForm.groupon" :label="1">新订单时提示</el-radio>
           <el-radio v-model="editNotifyForm.groupon" :label="2">订单支付时提示</el-radio>
           <el-radio v-model="editNotifyForm.groupon" :label="3">不提示</el-radio>
        </el-form-item>

      </el-form>
      </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editNotifyFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editNotifySubmit" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>
    <!-- 设置通知界面 end -->
  </div>
</template>

<script>
  import * as store from '@/utils/sdk/store';
  import { avatarPath } from '@/utils/commonConfig';
  import { updatePeople, editPassword, getPeople } from '@/utils/api';

  const defaultSysAvatar = require('@/assets/images/user.png');

  export default {
    name: 'home',
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value !== this.editPasswordForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        menus: [],
        avatarPath,
        collapsed: false,
        sysName: '花茄',
        sysUserName: '未登录',
        sysUserAvatar: defaultSysAvatar,
        sysAppName: '未确认',

        unread: 0,

        // 新增界面数据
        editForm: {
          name: '',
          tel: '',
          avatar: '',
        },
        // 设置个人信息
        editFormVisible: false, // 新增界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
        },
        // 修改密码
        editPasswordFormVisible: false,
        editPasswordFormRules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
          ],
          rePassword: [
            { required: true, message: '请重复输入新密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' },
          ],
        },
        editPasswordForm: {
          oldPassword: '',
          password: '',
          rePassword: '',
        },
        // 修改通知设置
        editNotifyFormVisible: false,
        editNotifyFormRules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
          ],
          rePassword: [
            { required: true, message: '请重复输入新密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' },
          ],
        },
        editNotifyForm: {
          audio: true,
          book: 1,
          groupon: 1,
        },
      };
    },
    methods: {
// 修改个人信息相关
      // 改变弹窗状态
      handleUpdate() {
        console.log('change dialog status');
        this.editFormVisible = true;
      },
      // 头像上传之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPNG) && isLt2M;
      },
      // 头像上传成功
      handleAvatarSuccess(res) {
        if (res.code) {
          this.$message.error({
            message: res.message,
          });
          return;
        }
        this.editForm.avatar = res.data.url;
      },
      editUserMsg() {
        updatePeople({
          peopleId: store.get('user').peopleId,
          name: this.editForm.name,
          avatar: this.editForm.avatar,
          tel: this.editForm.tel,
        }).then((res) => {
          if (res) {
            this.$message.success({
              message: '个人信息修改成功',
            });
            const oldUser = store.get('user');
            oldUser.basic.name = this.editForm.name;
            oldUser.basic.avatar = this.editForm.avatar;
            oldUser.basic.tel = this.editForm.tel;
            store.set('user', oldUser);
            this.sysUserName = this.editForm.name;
            this.sysUserAvatar = this.editForm.avatar;
          }
        });
      },
      editSubmit() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确定要修改个人信息吗?', '提示', {
              type: 'warning',
            }).then(() => {
              this.editFormVisible = false;
              this.editUserMsg();
            }).catch(() => {
              this.$message({
                message: '已取消修改',
              });
            });
          } else {
            this.$message.error({
              message: '信息出错',
            });
          }
        });
      },
// 修改密码相关
      initPSW() {
        this.$refs.editPasswordForm.resetFields();
      },
      // 打开修改弹窗
      handleUpdatePassword() {
        this.editPasswordFormVisible = true;
      },
      // 打开修改通知弹窗
      handleUpdateNotify() {
        this.editNotifyFormVisible = true;
      },
      uploadPassword() {
        editPassword({
          oldPassword: this.editPasswordForm.oldPassword,
          password: this.editPasswordForm.password,
        }).then((res) => {
          if (res) {
            this.$message.success({
              message: '密码修改成功，请重新登陆',
            });
            store.remove('user');
            this.$router.push('/login');
          }
        });
      },
      editPasswordSubmit() {
        this.$refs.editPasswordForm.validate((valid) => {
          if (valid) {
            this.$confirm('确定要修改当前密码?', '提示', {
              type: 'warning',
            }).then((data) => {
              if (!data) {
                return;
              }
              this.editPasswordFormVisible = false;
              this.uploadPassword();
            }, () => {
              this.$message.info('取消修改密码');
            });
          } else {
            this.$message.warning('密码填写错误');
          }
        });
      },
      // 退出登录
      logout() {
        this.$confirm('确认退出吗?', '提示', {
          // type: 'warning'
        }).then(() => {
          store.remove('user');
          this.$router.push('/login');
        }).catch(() => {
          this.$message({
            message: '您取消了退出',
          });
        });
      },
      // 消息通知设置
      editNotifySubmit() {
        this.$refs.editNotifyForm.validate((valid) => {
          if (valid) {
            this.$confirm('确定要修改当前通知设置?', '提示', {
              type: 'warning',
            }).then((data) => {
              if (!data) {
                return;
              }
              this.editNotifyFormVisible = false;
              updatePeople({
                notify: {
                  audio: this.editNotifyForm.audio,
                  book: this.editNotifyForm.book,
                  groupon: this.editNotifyForm.groupon,
                },
              }).then((ret) => {
                if (!ret) {
                  return;
                }
                this.$message.success('通知设置成功');
                store.set('user', ret);
              });
            }, () => {
              this.$message.info('取消修改通知设置');
            });
          } else {
            this.$message.warning('通知设置填写错误');
          }
        });
      },
      // 清除消息未读数
      flushUnread() {
        updatePeople({
          unread: 0,
        }).then(() => {
          this.unread = 0;
        });
      },
    },
    created() {
      const user = store.get('user');
      const app = store.get('app');
      if (user && app) {
        this.sysUserName = user.basic.name || '未设置';
        this.sysUserAvatar = user.basic.avatar || defaultSysAvatar;
        this.sysAppName = app.basic.title || '未确认';
        this.sysName = app.title;
        this.editForm.name = user.basic.name;
        this.editForm.tel = user.basic.tel;
        this.editForm.avatar = user.basic.avatar;
        this.editNotifyForm = {
          audio: !user.basic.notify || user.basic.notify.audio,
          book: (user.basic.notify && user.basic.notify.book) || 1,
          groupon: (user.basic.notify && user.basic.notify.groupon) || 1,
        };
        this.menus = this.$router.options.routes[0].children;
      }
      this.$socket.on('connect', () => {
        console.log('socket连接成功');
      });
      this.$socket.on('data', (data) => {
        const d = JSON.parse(data);
        if (d.peopleId !== store.get('user').peopleId) {
          return;
        }
        this.unread += d.unread;
        if (d.unread > 0 && (!store.get('user').basic.notify || store.get('user').basic.notify.audio)) {
          const audio = new Audio('https://qbox.huaqie.com/FqFfhIHKwHRkxN6upBYkDFKPCLTD');
          audio.play();
        }
      });
      getPeople({
        peopleId: store.get('user').peopleId,
      }).then((data) => {
        if (!data) {
          return;
        }
        this.unread = ((n) => ((n > 999) ? 999 : n))(data.basic.unread || 0);
      });
    },
  };
</script>

<style lang="scss" scoped>
@import '../assets/css/_pub.scss';
.home {
  height: 100%;
  overflow: hidden;
}
.container {
  height: 100%;

  .header {
    line-height: 60px;
    background: $color-white;
    color: $color-black;
    overflow: hidden;
    border-bottom: 2px solid #fafafa;

    .logo {
      font-size: 17px;
      line-height: 58px;
    }

    .logo img {
      display: inline-block; 
      width: 30px; 
      height: 30px; 
      vertical-align: middle; 
      margin: -3px 26px 0 35px;
    }
    .logo-width{
      // width:230px;
    }
    .logo-collapse-width{
      width:60px
    }

    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;

      .userinfo-inner {
        cursor: pointer;
        font-size: $font-18;
        color: $color-black;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: 9px 0px 9px 15px;
          float: right;
          // border:2px solid white;
        }
      }
    }
  }

  .body {
    height: 100%;
    background: $color-body-bg;
    overflow: hidden;

    .aside {
      margin: 40px 34px 40px 40px;
      padding: 10px 0;
      overflow-x: hidden;
      overflow-y: hidden;

      .el-menu {
        border-right: 0 !important;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        box-shadow: 0 0 12px #cac6c6;
      }

      .menu {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: $color-white;

        .el-menu-item {
          height: 66px;
          line-height: 66px;
        }

        .el-menu-item:focus, .el-menu-item:hover {
          background-color: $color-menu-select;
        }

        img {
          display: inline-block;
          vertical-align: middle;
          width: $size-menu-icon;
          height: $size-menu-icon;
          margin-right: 32px;
          width: 21px;
          height: 21px;
        }
        span {
          vertical-align: middle;
        }
      }
    }
    .main {
      // overflow: hidden;
      padding: 0;
      padding-bottom: 30px;

      .content-wrapper {
        // height: 100%;
        // overflow: auto;
        margin: 40px 40px 40px 0;
        // height: 828px;
      }

      .main-footer {
        color: #bababa;
        font-size: 13px;
        text-align: center;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border:1px dashed gray;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.red-point{
  float: right;
  background: #e74c3c;
  width: 2em;
  border-radius: 50%;
  font-size: 0.75em;
  line-height: 2;
  margin-top: 23px;
  margin-right: 10px;
  color: white;
  text-align: center;
  animation: notificationpulse 0.5s infinite;
  -webkit-animation: notificationpulse 0.5s infinite;
  -moz-animation: notificationpulse 0.5s infinite;
}
/*the animations */
@keyframes notificationpulse {
  0% {
    box-shadow: 0 0 0 0.00em #c0392b;
  }
  25% {
    box-shadow: 0 0 0 0.25em #c0392b;
  }
  50% {
    box-shadow: 0 0 0 0.50em #c0392b;
  }
  75% {
    box-shadow: 0 0 0 0.25em #c0392b;
  }
  100% {
    box-shadow: 0 0 0 0.15em #c0392b;
  }
}
@-webkit-keyframes notificationpulse {
  0% {
    box-shadow: 0 0 0 0.00em #c0392b;
  }
  25% {
    box-shadow: 0 0 0 0.25em #c0392b;
  }
  50% {
    box-shadow: 0 0 0 0.50em #c0392b;
  }
  75% {
    box-shadow: 0 0 0 0.25em #c0392b;
  }
  100% {
    box-shadow: 0 0 0 0.15em #c0392b;
  }
}

@-moz-keyframes notificationpulse {
  0% {
    box-shadow: 0 0 0 0.00em #c0392b;
  }
  25% {
    box-shadow: 0 0 0 0.25em #c0392b;
  }
  50% {
    box-shadow: 0 0 0 0.50em #c0392b;
  }
  75% {
    box-shadow: 0 0 0 0.25em #c0392b;
  }
  100% {
    box-shadow: 0 0 0 0.15em #c0392b;
  }
}
</style>
