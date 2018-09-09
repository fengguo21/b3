<template>
  <div class="page1004">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
      <el-input clearable class="mg-r-15" placeholder="订单号" v-model="filters.orderNo"></el-input>
    <el-input clearable class="mg-r-15" placeholder="会议号" v-model="filters.conferenceNo"></el-input>
    <el-input clearable class="mg-r-15" placeholder="团餐号" v-model="filters.grouponNo"></el-input>
      <el-input clearable class="mg-r-15" placeholder="客户手机号" v-model="filters.tel"></el-input>
      <el-input clearable class="mg-r-15" placeholder="订单标题" v-model="filters.title"></el-input>
      <el-select class="mg-r-15" v-model="filters.typehood" placeholder="订单类型" :clearable="true">
        <el-option
          v-for="item in typehoodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select class="mg-r-15" v-model="filters.step" placeholder="订单状态" :clearable="true">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
      v-model="filters.dates"
      type="datetimerange"
       class="mg-r-15"
      range-separator="至"
      style="height:46px;"
      start-placeholder="下单开始时间"
      end-placeholder="下单结束时间">
    </el-date-picker>
    <el-date-picker
      v-model="filters.dates2"
      type="daterange"
       class="mg-r-15"
      range-separator="至"
      style="height:46px;"
      value-format="yyyy-MM-dd"
      start-placeholder="预订开始日期"
      end-placeholder="预订结束日期">
    </el-date-picker>
      <el-button class="mg-r-15" type="" @click="query">查询订单</el-button>
      <el-button type="primary" :loading="exportLoading" @click="exportExcel">导出Excel表</el-button>
      <!--<el-button type="primary" @click="handleInvoiceShow">获取发票数据</el-button>-->
    </div>
    <div class="main-picker">
      <!--列表-->
    <el-table :data="orders" stripe highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column label="客户" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.people.avatar" class="avatar small"/>
        </template>
      </el-table-column>
      <el-table-column prop="basic.orderNo" label="订单号" width="150" >
      </el-table-column>
      <el-table-column prop="title" label="标题" width="200" >
      </el-table-column>
      <el-table-column prop="typehood" label="订单类型" width="100" :formatter="formatTypehood">
      </el-table-column>
      <el-table-column prop="basic.special" label="房间类型" width="100">
        <template slot-scope='scope'>
          <el-tag type="warning" v-if="scope.row.typehood==1
&&scope.row.basic.special">拼房</el-tag>
          <el-tag type="primary" v-if="scope.row.typehood==1
&&!scope.row.basic.special">普通</el-tag>
          <!-- <el-tag type="info" v-if="scope.row.typehood==2">团餐</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="订单金额" width="100" >
      </el-table-column>
      <el-table-column prop="extra.refundAmount" label="退款金额" width="100" >
      </el-table-column>
      <el-table-column prop="channel" label="支付方式" :formatter="formatChannel" width="120" >
      </el-table-column>
      <el-table-column label='订单状态' width="100">
        <template slot-scope='scope'>
          <el-tag type="primary" v-if="scope.row.step==1">待付款</el-tag>
          <el-tag type="success" v-if="scope.row.step==2">已付款</el-tag>
          <el-tag type="warning" v-if="scope.row.step==3">待收货</el-tag>
          <el-tag type="warning" v-if="scope.row.step==4">已确认</el-tag>
          <el-tag type="info" v-if="scope.row.step==6">已取消</el-tag>
        </template>
      </el-table-column>
      <!--
      <el-table-column prop="extra.invoice.title" label="发票" width="100" :formatter="formatInvoice">
      </el-table-column>
      -->
      <el-table-column prop="created" label="创建时间" :formatter="formatDate"  >
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
        <el-button size="small" @click="handleShow(scope.$index, scope.row)">详情</el-button>
          <el-button v-if="scope.row.step==2 && (!scope.row.extra.refund || scope.row.extra.refund < scope.row.amount)" size="small" type="warning" @click="handleRefundShow(scope.$index, scope.row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
    <el-button @click="finishOrders" :loading="finishOrderLoading" type="primary" :disabled="multipleSelection.length == 0">客房确认</el-button>
      <el-pagination :current-page="page" layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    </div>
    <!--显示详情-->
    <el-dialog title="订单详情" :visible.sync="showFormVisible" :close-on-click-modal="false">
      <el-row>
      <el-col :span="6">
        订单号:
      </el-col>
      <el-col :span="6">
        <h1 class="order-no">{{ showForm.basic && showForm.basic.orderNo }}</h1>
      </el-col>
      <el-col :span="6">
        会议号:
      </el-col>
      <el-col :span="6">
        {{ showForm.basic && showForm.basic.conferenceNo }}
      </el-col>
      </el-row>
      <el-row v-if="showForm.typehood==2">
      <el-col :span="6">
        团餐号:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.grouponNo }}
      </el-col>
      </el-row>
      <el-row style="margin-top:5px;">
      <el-col :span="6">
        订单标题:
      </el-col>
      <el-col :span="6">
        {{ showForm.title }}
      </el-col>
      <el-col :span="6">
        订单金额:
      </el-col>
      <el-col :span="6">
        ¥{{ showForm.extra && showForm.extra.totalAmount }}
      </el-col>
      </el-row>
      <el-row style="margin-top:5px;">
      <el-col :span="6">
        支付金额:
      </el-col>
      <el-col :span="6">
        ¥{{ showForm.amount }}
      </el-col>
      <el-col :span="6">
        退款金额:
      </el-col>
      <el-col :span="6">
        ¥{{ showForm.extra && showForm.extra.refundAmount || 0 }}
      </el-col>
      </el-row>
      <el-row style="margin-top:5px;">
      <el-col :span="6">
        提交时间:
      </el-col>
      <el-col :span="18">
        {{ formatTime(showForm.created) }}
      </el-col>
      </el-row>
      <el-row style="margin-top:5px;">
      <el-col :span="6">
        身份信息:
      </el-col>
      <el-col :span="18">
        <el-row style="background:#e8e8e8;padding-left:10px;">
        <el-col :span="6">
        姓名
        </el-col>
        <el-col :span="6">
        性别
        </el-col>
        <el-col :span="6">
        手机号
        </el-col>
        <el-col :span="6">
        身份证号
        </el-col>
        </el-row>
        <el-row style="padding-left:10px;">
        <el-col :span="6">
        {{ showForm.basic && showForm.basic.name }}
        </el-col>
        <el-col :span="6">
        {{ formatSex(showForm.basic && showForm.basic.sex) }}
        </el-col>
        <el-col :span="6">
        {{ showForm.basic && showForm.basic.tel }}
        </el-col>
        <el-col :span="6">
        {{ showForm.basic && showForm.basic.identityId }}
        </el-col>
        </el-row>
      </el-col>
      </el-row>
      <el-row style="margin-top:5px;">
      <el-col :span="6">
        {{ showForm.typehood == 1 ? '入住时间' : '团餐时间' }}:
      </el-col>
      <el-col :span="18">
      <el-row v-for="(item, index) in showForm.basic && showForm.basic.dates" :key="item">
      <el-col :span="6">
        <el-row>
         {{ item }}<span v-if="showForm.typehood === 1 && showForm.basic && showForm.basic.special" style="background:#e6a23c;color:white;border-radius:3px;margin-left: 10px;font-size:11px;padding:1px;">拼</span>
         </el-row>
      </el-col>
      <el-col :span="18" v-if="showForm.basic.special">
      <el-row style="color:#e6a23c;">
        <el-col :span="4">
        {{ (showFormPairs.length > index) && showFormPairs[index].name || '无' }}
        </el-col>
        <el-col :span="4">
        {{ (showFormPairs.length > index) && formatSex(showFormPairs[index].sex) || '无' }}
        </el-col>
        <el-col :span="6">
        {{ (showFormPairs.length > index) && showFormPairs[index].tel || '无' }}
        </el-col>
        <el-col :span="6">
        {{ (showFormPairs.length > index) && showFormPairs[index].identityId || '无' }}
        </el-col>
        </el-row>
      <!--
         <el-button type="primary" plain @click="showPair(showForm.conferenceId, showForm.orderId, showForm.basic.sex, item)">拼房同伴</el-button>
         -->
      </el-col>
      </el-row>
      </el-col>
      </el-row>
      <el-row>
          <el-col :span="6">
          备注:
          </el-col>
          <el-col :span="18">
          {{showForm.basic && showForm.basic.text || '无'}}
          </el-col>
      </el-row>
      <el-row style="margin-top:5px;" v-if="showForm.step >= 2">
      <el-col :span="6">
        支付信息:
      </el-col>
      <el-col :span="18">
        <p v-if="showForm.payment && showForm.payment.created">支付金额：¥{{ showForm.payment && showForm.payment.amount || 0 }}</p>
        <p v-if="showForm.payment && showForm.payment.created">支付时间：{{ showForm.payment.updated && formatTime(showForm.payment.updated) }}</p>
        <p v-if="!showForm.payment || !showForm.payment.created">未支付</p>
      </el-col>
      </el-row>
      <!--
      <el-row style="margin-top:5px;" v-if="showForm.step >= 2">
      <el-col :span="6">
        发票信息:
      </el-col>
      <el-col :span="18">
        <p v-if="showForm.extra && showForm.extra.invoice">名称：{{ showForm.extra.invoice.title }}</p>
        <p v-if="showForm.extra && showForm.extra.invoice">税号：{{ showForm.extra.invoice.taxNo }}</p>
        <p v-if="showForm.extra && showForm.extra.invoice">单位地址：{{ showForm.extra.invoice.address }}</p>
        <p v-if="showForm.extra && showForm.extra.invoice">电话号码：{{ showForm.extra.invoice.tel }}</p>
        <p v-if="showForm.extra && showForm.extra.invoice">开户银行：{{ showForm.extra.invoice.bank }}</p>
        <p v-if="showForm.extra && showForm.extra.invoice">银行账户：{{ showForm.extra.invoice.account }}</p>
      </el-col>
      </el-row>
      -->
      
      <el-row style="margin-top:5px;">
      <el-col :span="6">
        订单状态:
      </el-col>
      <el-col :span="18">
        <el-tag type="primary" v-if="showForm.step==1">待付款</el-tag>
        <el-tag type="success" v-if="showForm.step==2">已付款</el-tag>
        <el-tag type="warning" v-if="showForm.step==4">已确认</el-tag>
        <el-tag type="info" v-if="showForm.step==6">已取消</el-tag>
      </el-col>
      </el-row>
      <el-row style="margin-top:5px;" v-if="showForm.typehood === 1 && showForm.step === 4">
      <el-col :span="6">
        确认时间:
      </el-col>
      <el-col :span="18">
        {{ formatTime(showForm.updated) }}
      </el-col>
      </el-row>
      <el-row style="margin-top:5px;">
      <el-col :span="6">
        下单人:
      </el-col>
      <el-col :span="6">
        <p><img v-if="showForm.people && showForm.people.avatar" :src="showForm.people && showForm.people.avatar" class="avatar" /></p>
        <p>昵称：{{ showForm.people && showForm.people.name }}</p>

      </el-col>
      <el-col :span="6">
        付款人:
      </el-col>
      <el-col :span="6">
        <p><img v-if="showForm.paymentPeople && showForm.paymentPeople.avatar" :src="showForm.paymentPeople && showForm.paymentPeople.avatar" class="avatar" /></p>
        <p>昵称：{{ showForm.paymentPeople && showForm.paymentPeople.name }}</p>

      </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
      <el-button :loading="finishOrderLoading" type="primary" v-if="showForm.step===2 && showForm.typehood===1" @click.native="finishOrder" style="float: left;">客房确认</el-button>
        <el-button @click.native="showFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--退款对话框-->
    <el-dialog title="订单退款" :visible.sync="refundFormVisible">
      <el-form :model="refundForm">
        <el-form-item label="订单标题" label-width="80">
         {{ refundForm.title }}
        </el-form-item>
        <el-form-item label="总金额" label-width="80">
         {{ refundForm.amount }}
        </el-form-item>
        <el-form-item label="已退金额" label-width="80">
         {{ refundForm.extra && refundForm.extra.refundAmount }}
        </el-form-item>
        <el-form-item label="退款金额" label-width="80">
          <el-input-number v-model="refundForm.refund" :min="0" :max="100000" auto-complete="off"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundCancel">取消</el-button>
        <el-button type="primary" @click="refundSubmit" :loading="refundLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--发票对话框-->
    <el-dialog title="获取发票数据" :visible.sync="invoiceFormVisible">
      <el-form :model="invoiceForm">
        <el-form-item label="订单类型" label-width="80">
          <el-radio v-model="invoiceForm.typehood" label="1">订房</el-radio>
          <el-radio v-model="invoiceForm.typehood" label="2">团餐</el-radio>
        </el-form-item>
        <el-form-item label="订单日期" label-width="80">
          <el-date-picker
            v-model="invoiceForm.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议名称" label-width="80">
        <el-input v-model="invoiceForm.conferenceTitle" class="mini-input" placeholder="会议名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="invoiceFormVisible = false">取消</el-button>
        <el-button type="primary" @click="invoiceSubmit" :loading="invoiceLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--下载地址对话框-->
    <el-dialog
      title="小提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span><a :href="dialogUrl" target="blank">{{ dialogText }}</a></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!--同伴信息-->
    <el-dialog
      title="同伴信息"
      :visible.sync="pairDialogVisible"
      width="30%">
      <img :src="pairDialogData.basic && pairDialogData.basic.avatar" style="width:96px;height:96px"/>
      <span>{{ pairDialogData.extra && pairDialogData.extra.profile && pairDialogData.extra.profile.name }}</span>
      <p>{{ pairDialogData.extra && pairDialogData.extra.profile && pairDialogData.extra.profile.tel }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pairDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getOrders, getOrder, refundOrder, getOrderInvoiceXML, getPair, finishOrder, exportOrderExcel } from '@/utils/api';
  import moment from 'moment';

  export default {
    name: 'page1004',
    data() {
      return {
        filters: {
          orderNo: '',
          conferenceNo: '',
          grouponNo: '',
          title: '',
          step: '',
          tel: '',
          typehood: '',
          dates: [],
          dates2: [],
        },
        typehoodOptions: [{
          label: '订房',
          value: 1,
        }, {
          label: '团餐',
          value: 2,
        }],
        options: [{
          label: '待付款',
          value: 1,
        }, {
          label: '已付款',
          value: 2,
        }, {
          label: '已确认',
          value: 4,
        }, {
          label: '已取消',
          value: 6,
        }],
        orders: [],
        total: 0,
        page: 1,
        size: 10,

        listLoading: false,
        refundLoading: false,

        showFormVisible: false,
        showForm: {
          pairs: [],
        },
        showFormPairs: [],

        refundFormVisible: false,
        refundForm: {
          refund: 0,
        },

        invoiceFormVisible: false,
        invoiceLoading: false,
        invoiceForm: {
          name: '',
        },

        dialogVisible: false,
        dialogUrl: '',
        dialogText: '',

        pairDialogVisible: false,
        pairDialogData: {

        },

        multipleSelection: [],
        finishOrderLoading: false,

        exportLoading: false,

      };
    },
    methods: {
      formatDate(row) {
        return moment(row.created).format('YYYY-MM-DD HH:mm:ss');
      },
      formatTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
      },
      formatSex(sex) {
        return (sex === 'M') ? '男' : '女';
      },
      formatStep(step) {
        const steps = ['待支付', '已付款', '已发货', '已完成', '已退款', '已取消'];
        return steps[step - 1];
      },
      formatInvoice(row) {
        if (row.extra.invoice && row.extra.invoice.title && row.extra.invoice.downloadCount) {
          return '已开';
        } else if (row.extra.invoice && row.extra.invoice.title) {
          return '需开';
        }
        return '';
      },
      formatTypehood(row) {
        const typehoods = ['订房', '团餐'];
        return typehoods[row.typehood - 1];
      },
      formatChannel(row) {
        const channels = {
          WEPAY: '微信支付',
          WIDGET: '小程序支付',
        };
        return (row.channel in channels) ? channels[row.channel] : '未知';
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getOrders();
      },
      handleRefundShow(index, row) {
        this.refundFormVisible = true;
        this.refundForm = row;
        this.refundForm.refund = 0;
      },
      handleInvoiceShow() {
        this.invoiceFormVisible = true;
      },
      // 显示同伴
      showPair(conferenceId, orderId, sex, dates) {
        getPair({
          conferenceId,
          orderId,
          sex,
          dates,
        }).then((data) => {
          if (!data) {
            this.$message.info('没有同伴');
            return;
          }
          this.showFormPairs = data;
        });
      },
      // 显示查看界面
      handleShow(index, row) {
        this.showFormVisible = true;
        getOrder({
          orderId: row.orderId,
        }).then((data) => {
          if (!data) {
            return;
          }
          this.showForm = data;
          this.showPair(data.conferenceId, data.orderId, data.basic.sex, data.basic.dates);
        });
      },
      getOrders() {
        this.listLoading = true;
        getOrders({
          orderNo: this.filters.orderNo,
          conferenceNo: this.filters.conferenceNo,
          grouponNo: this.filters.grouponNo,
          tel: this.filters.tel,
          title: this.filters.title,
          typehood: this.filters.typehood,
          step: this.filters.step,
          startTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[0]).valueOf() : '',
          endTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[1]).valueOf() : '',
          startDate: (this.filters.dates2 && this.filters.dates2.length > 1) ? this.filters.dates2[0] : '',
          endDate: (this.filters.dates2 && this.filters.dates2.length > 1) ? this.filters.dates2[1] : '',
          page: this.page,
          size: this.size,
        }).then((data) => {
          this.listLoading = false;
          this.total = data.total;
          this.orders = data.list;
        });
      },
      refundCancel() {
        this.$message.info('取消退款');
        this.refundFormVisible = false;
      },
      // 退款
      refundSubmit() {
        if (this.refundForm.refund > (this.refundForm.amount - this.refundForm.extra.refundAmount)) {
          this.$message.warning('退款金额不够');
          return;
        } else if (this.refundForm.refund === 0) {
          this.$message.warning('退款金额不能为0');
          return;
        }
        this.$confirm(`确认对该订单：${this.refundForm.title} 退款 ${this.refundForm.refund} 吗?`, '提示', {
          type: 'warning',
        }).then(() => {
          this.refundLoading = true;
          const para = { orderId: this.refundForm.orderId, amount: this.refundForm.refund };
          refundOrder(para).then((data) => {
            this.refundLoading = false;
            if (!data) {
              return;
            }
            this.refundFormVisible = false;
            this.$message.success('退款成功');
            this.getOrders();
          });
        }).catch(() => {
          this.$message.info('取消退款');
        });
      },
      exportExcel() {
        const para = {
          orderNo: this.filters.orderNo,
          conferenceNo: this.filters.conferenceNo,
          grouponNo: this.filters.grouponNo,
          tel: this.filters.tel,
          title: this.filters.title,
          typehood: this.filters.typehood,
          step: this.filters.step,
          startTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[0]).valueOf() : '',
          endTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[1]).valueOf() : '',
          startDate: (this.filters.dates2 && this.filters.dates2.length > 1) ? this.filters.dates2[0] : '',
          endDate: (this.filters.dates2 && this.filters.dates2.length > 1) ? this.filters.dates2[1] : '',
        };
        if (Object.values(para).join('') === '') {
          this.$message.warning('至少需要填写一个条件才能导出');
          return;
        }
        this.exportLoading = true;
        exportOrderExcel(para).then((data) => {
          this.exportLoading = false;
          if (!data) {
            return;
          }
          this.dialogVisible = true;
          this.dialogText = '订单Excel表';
          this.dialogUrl = data.url;
        });
      },
      // 开发票
      invoiceSubmit() {
        const para = {
          typehood: this.invoiceForm.typehood,
          startDate: this.invoiceForm.date && this.invoiceForm.date[0],
          endDate: this.invoiceForm.date && this.invoiceForm.date[1],
        };
        if (!para.typehood) {
          this.$message.warning('请选择订单类型');
          return;
        } else if (!para.startDate || !para.endDate) {
          this.$message.warning('请选择订单日期');
          return;
        }
  
        this.invoiceLoading = true;
        getOrderInvoiceXML(para).then((data) => {
          this.invoiceLoading = false;
          if (!data) {
            return;
          }
          this.invoiceFormVisible = false;
          this.$message.success('获取发票数据成功');
          this.dialogUrl = data.url;
          this.dialogText = '发票XML文件下载地址';
          this.dialogVisible = true;
        });
      },
      // 客房批量确认
      finishOrders() {
        this.finishOrderLoading = true;
        finishOrder({
          idList: this.multipleSelection.map((e) => e.orderId),
        }).then((data) => {
          this.finishOrderLoading = false;
          if (!data) {
            return;
          }
          this.getOrders();
          this.$message.success('客房确认成功');
        });
      },
      // 客房确认
      finishOrder() {
        this.finishOrderLoading = true;
        finishOrder({
          idList: [this.showForm.orderId],
        }).then((data) => {
          this.finishOrderLoading = false;
          if (!data) {
            return;
          }
          this.getOrders();
          this.showFormVisible = false;
          this.$message.success('客房确认成功');
        });
      },
      // 搜索
      query() {
        this.page = 1;
        this.getOrders();
      },
      // 获取发票数据
      getInvoices() {

      },
    },
    mounted() {
      this.getOrders();
    },
  };
</script>

<style lang="scss" scoped>
.avatar {
  width: 48px;
  height: 48px;
}
.avatar.small {
  width: 36px;
  height: 36px;
}
.mini-input {
  width: 300px;
}
.order-no {
  font-size: 19px;
}
</style>
