<template>
  <div class="page1008">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="page1">
        <div class="main-picker">
        <el-row>
          <el-col :span="12">
          <el-form ref="basicForm" :model="basicForm" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
          <el-form-item label="酒店ID">
        {{ appId }}
          </el-form-item>
          <el-form-item label="酒店图片">
          <el-upload
          class="avatar-uploader"
          :action="avatarPath"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar big">
          <i v-else class="el-icon-plus avatar-uploader-icon big"></i>
        </el-upload>
        </el-form-item>
          <el-form-item label="酒店名称">
            <el-input v-model="basicForm.title"></el-input>
          </el-form-item>
          <el-form-item label="酒店地址">
            <el-input v-model="basicForm.address"></el-input>
          </el-form-item>
          <el-form-item label="酒店位置">
            <el-input v-model="basicForm.position"></el-input>
          </el-form-item>
          <el-form-item label="客服电话">
            <el-input v-model="basicForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="酒店简介">
            <el-input type="textarea" v-model="basicForm.desc" :rows="5"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native.prevent="cancel">重置</el-button>
            <el-button type="primary" @click.native.prevent="save" :loading="saveLoading">保存</el-button>
          </el-form-item>
        </el-form>
        </el-col>
        </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="微信小程序设置" name="page2">
        <div class="main-picker">
        <el-row>
          <el-col :span="12">
          <el-form ref="basicForm" :model="weappForm" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
    <el-form-item label="appId">
      <el-input v-model="weappForm.appId"></el-input>
    </el-form-item>
    <el-form-item label="appSecret">
      <el-input v-model="weappForm.appSecret"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click.native.prevent="cancel">重置</el-button>
      <el-button type="primary" @click.native.prevent="saveWeapp" :loading="saveLoading">保存</el-button>
    </el-form-item>
  </el-form>
  </el-col>
        </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="微信支付设置" name="page3">
        <div class="main-picker">
        <el-row>
          <el-col :span="12">
           <el-form ref="basicForm" :model="wepayFacilitatorForm" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
          <el-form-item label="appId">
            <el-input v-model="wepayFacilitatorForm.appId"></el-input>
          </el-form-item>
          <el-form-item label="subAppId">
            <el-input v-model="wepayFacilitatorForm.subAppId"></el-input>
          </el-form-item>
          <el-form-item label="subMchId">
            <el-input v-model="wepayFacilitatorForm.subMchId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native.prevent="cancel">重置</el-button>
            <el-button type="primary" @click.native.prevent="saveWepayFacilitator" :loading="saveLoading">保存</el-button>
          </el-form-item>
        </el-form>
        </el-col>
        </el-row>
        </div>
      </el-tab-pane>
      <!--
      <el-tab-pane label="发票设置" name="page4">
        <div class="main-picker">
        <el-row>
          <el-col :span="12">
           <el-form ref="basicForm" :model="invoiceForm" label-width="120px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
          <el-form-item label="复核人">
            <el-input v-model="invoiceForm.Fhr"></el-input>
          </el-form-item>
          <el-form-item label="收款人">
            <el-input v-model="invoiceForm.Skr"></el-input>
          </el-form-item>
          <el-form-item label="商品编码版本号">
            <el-input v-model="invoiceForm.Spbmbbh"></el-input>
          </el-form-item>
          <el-form-item label="含税标志">
            <el-input v-model="invoiceForm.Hsbz"></el-input>
          </el-form-item>
          <el-form-item label="商品编码">
            <el-input v-model="invoiceForm.Spbm"></el-input>
          </el-form-item>
          <el-form-item label="企业商品编码">
            <el-input v-model="invoiceForm.Qyspbm"></el-input>
          </el-form-item>
          <el-form-item label="零税率标识">
            <el-input v-model="invoiceForm.Lslbz"></el-input>
          </el-form-item>
          <el-form-item label="扣除额">
            <el-input v-model="invoiceForm.Kce"></el-input>
          </el-form-item>
          <el-form-item label="优惠政策说明">
            <el-input v-model="invoiceForm.Yhzcsm"></el-input>
          </el-form-item>
          <el-form-item label="税率">
            <el-input v-model="invoiceForm.Slv"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native.prevent="cancel">重置</el-button>
            <el-button type="primary" @click.native.prevent="saveInvoice" :loading="saveLoading">保存</el-button>
          </el-form-item>
        </el-form>
        </el-col>
        </el-row>
        </div>
      </el-tab-pane>
      -->
    </el-tabs>
  </div>
</template>

<script>
import { getApp, editApp, editAppWeapp, editAppWepayFacilitator, editAppInvoice } from '@/utils/api';
import * as Session from '@/utils/sdk/store';
import { avatarPath } from '@/utils/commonConfig';

export default {
  name: 'page1009',
  data() {
    return {
      activeName: 'page1',
      avatarPath,
      appId: '',
      imageUrl: '',

      saveLoading: false,

      basicForm: {
        title: '',
        address: '',
        desc: '',
      },
      weappForm: {
        appId: '',
        appSecret: '',
      },
      wepayFacilitatorForm: {
        appId: '',
        subAppId: '',
        subMchId: '',
      },
      invoiceForm: {
        Fhr: '',
        Skr: '',
        Spbmbbh: '',
        Hsbz: '',
        Spbm: '',
        Qyspbm: '',
        Lslbz: '',
        Kce: '',
        Yhzcsm: '',
        Slv: '',
      },
    };
  },
  methods: {
    handleClick() {},
    handleAvatarSuccess(res) {
      if (res.code) {
        this.$message.error({
          message: res.message,
        });
        return;
      }
      this.imageUrl = res.data.url;
    },
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
    save() {
      this.saveLoading = true;
      editApp({
        title: this.basicForm.title,
        address: this.basicForm.address,
        desc: this.basicForm.desc,
        position: this.basicForm.position,
        tel: this.basicForm.tel,
        avatar: this.imageUrl,
      }).then((data) => {
        this.saveLoading = false;
        if (data) {
          this.$message.success('保存系统基本信息成功');
          Session.set('app', data);
        }
      });
    },
    saveWeapp() {
      this.saveLoading = true;
      editAppWeapp({
        config: {
          appId: this.weappForm.appId,
          appSecret: this.weappForm.appSecret,
        },
      }).then((data) => {
        this.saveLoading = false;
        if (data) {
          this.$message.success('保存微信小程序设置成功');
          Session.set('app', data);
        }
      });
    },
    saveWepayFacilitator() {
      this.saveLoading = true;
      editAppWepayFacilitator({
        config: {
          appId: this.wepayFacilitatorForm.appId,
          subAppId: this.wepayFacilitatorForm.subAppId,
          subMchId: this.wepayFacilitatorForm.subMchId,
        },
      }).then((data) => {
        this.saveLoading = false;
        if (data) {
          this.$message.success('保存微信支付设置成功');
          Session.set('app', data);
        }
      });
    },
    saveInvoice() {
      this.saveLoading = true;
      editAppInvoice({
        config: {
          Fhr: this.invoiceForm.Fhr,
          Skr: this.invoiceForm.Skr,
          Spbmbbh: this.invoiceForm.Spbmbbh,
          Hsbz: this.invoiceForm.Hsbz,
          Spbm: this.invoiceForm.Spbm,
          Qyspbm: this.invoiceForm.Qyspbm,
          Lslbz: this.invoiceForm.Lslbz,
          Kce: this.invoiceForm.Kce,
          Yhzcsm: this.invoiceForm.Yhzcsm,
          Slv: this.invoiceForm.Slv,
        },
      }).then((data) => {
        this.saveLoading = false;
        if (data) {
          this.$message.success('保存发票设置成功');
          Session.set('app', data);
        }
      });
    },
    cancel() {
      this.update();
    },
    update() {
      getApp({}).then((data) => {
        this.basicForm.title = data.title;
        this.basicForm.address = data.basic.address;
        this.basicForm.tel = data.basic.tel;
        this.basicForm.desc = data.basic.desc;
        this.basicForm.position = data.basic.position;
        this.imageUrl = data.basic.avatar;
        this.appId = data.appId;
        this.weappForm.appId = data.extra.weapp && data.extra.weapp.appId;
        this.weappForm.appSecret = data.extra.weapp && data.extra.weapp.appSecret;
        this.wepayFacilitatorForm.appId = data.extra.wepayFacilitator
         && data.extra.wepayFacilitator.appId;
        this.wepayFacilitatorForm.subAppId = data.extra.wepayFacilitator
         && data.extra.wepayFacilitator.subAppId;
        this.wepayFacilitatorForm.subMchId = data.extra.wepayFacilitator
         && data.extra.wepayFacilitator.subMchId;
        this.invoiceForm = data.extra.invoice;
      });
    },
  },
  mounted() {
    this.update();
  },
};
</script>

<style lang="css" scoped>
.main-picker {
  margin-top: 0;
  padding-top: 10px;
  padding-bottom: 5px;
}
.avatar{
  width: 296px;
}
</style>
