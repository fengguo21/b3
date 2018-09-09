<template>
  <div class="page1006">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
      <el-input clearable class="mg-r-15" placeholder="订单号" v-model="filters.orderNo"></el-input>
      <el-input clearable class="mg-r-15" placeholder="会议号" v-model="filters.conferenceNo"></el-input>
      <el-input clearable class="mg-r-15" placeholder="付款人姓名" v-model="filters.name"></el-input>
      <el-input clearable class="mg-r-15" placeholder="付款人手机号" v-model="filters.tel"></el-input>
      <el-select clearable class="mg-r-15" v-model="filters.typehood" placeholder="订单类型">
        <el-option
          v-for="item in typehoodOptions"
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
      start-placeholder="开始时间"
      end-placeholder="结束时间">
    </el-date-picker>
      <el-button type="" @click="query">查询明细</el-button>
      <el-button type="primary" :loading="exportLoading" @click="exportExcel">{{ exportTitle }}</el-button>
    </div>

    <el-tabs v-model="activeTab" @tab-click="onChangeTab">
      <el-tab-pane label="概览" name="tab1">
        <!-- 概览 -->
        <div class="main-picker">
        <!--
          <el-row>
      <el-col :span="6"><p class="total-title">今日</p><p class="total-count">{{ report.date }}</p></el-col>
      <el-col :span="6"><p class="total-title">本月</p><p class="total-count">{{ report.month }}</p></el-col>
      <el-col :span="6"><p class="total-title">本年</p><p class="total-count">{{ report.year }}</p></el-col>
      <el-col :span="6"><p class="total-title">总计</p><p class="total-count">{{ report.total }}</p></el-col>
      </el-row>
      -->
      <el-row style="border-bottom:1px solid #f3f3f3;padding: 15px;margin: 0 20px;">
      <el-col :span="6"><p class="total-title">今日</p><p class="total-count">{{ report.today.total }}</p></el-col>
      <el-col :span="6"><p class="total-title">订房</p><p class="total-count">{{ report.today.books }}</p></el-col>
      <el-col :span="6"><p class="total-title">团餐</p><p class="total-count">{{ report.today.groupons }}</p></el-col>
      <el-col :span="6"><p class="total-title">退款</p><p class="total-count">{{ report.today.refunds }}</p></el-col>
      </el-row>
      <el-row style="border-bottom:1px solid #f3f3f3;padding: 15px;margin: 0 20px;">
      <el-col :span="6"><p class="total-title">本月</p><p class="total-count">{{ report.month.total }}</p></el-col>
      <el-col :span="6"><p class="total-title">订房</p><p class="total-count">{{ report.month.books }}</p></el-col>
      <el-col :span="6"><p class="total-title">团餐</p><p class="total-count">{{ report.month.groupons }}</p></el-col>
      <el-col :span="6"><p class="total-title">退款</p><p class="total-count">{{ report.month.refunds }}</p></el-col>
      </el-row>
      <el-row style="border-bottom:1px solid #f3f3f3;padding: 15px;margin: 0 20px;">
      <el-col :span="6"><p class="total-title">本年</p><p class="total-count">{{ report.year.total }}</p></el-col>
      <el-col :span="6"><p class="total-title">订房</p><p class="total-count">{{ report.year.books }}</p></el-col>
      <el-col :span="6"><p class="total-title">团餐</p><p class="total-count">{{ report.year.groupons }}</p></el-col>
      <el-col :span="6"><p class="total-title">退款</p><p class="total-count">{{ report.year.refunds }}</p></el-col>
      </el-row>
      <el-row style="border-bottom:1px solid #f3f3f3;padding: 15px;margin: 0 20px;">
      <el-col :span="6"><p class="total-title">总计</p><p class="total-count">{{ report.total.total }}</p></el-col>
      <el-col :span="6"><p class="total-title">订房</p><p class="total-count">{{ report.total.books }}</p></el-col>
      <el-col :span="6"><p class="total-title">团餐</p><p class="total-count">{{ report.total.groupons }}</p></el-col>
      <el-col :span="6"><p class="total-title">退款</p><p class="total-count">{{ report.total.refunds }}</p></el-col>
      </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收入明细" name="tab2">
        <!-- 收入明细 -->
        <div class="main-picker">
          <!--列表-->
      		<el-table :data="incomes" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
      			<el-table-column type="index" width="60">
      			</el-table-column>
      			<el-table-column prop="amount" label="收入金额" width="150">
      			</el-table-column>
      			<el-table-column prop="channel" label="收款渠道" width="150" :formatter="formatChannel">
      			</el-table-column>
            <el-table-column prop="basic.typehood" label="订单类型" width="150" :formatter="formatTypehood">
            </el-table-column>
      			<el-table-column prop="basic.orderNo" label="订单号" width="150">
      			</el-table-column>
            <el-table-column prop="basic.conferenceNo" label="会议号" width="150">
            </el-table-column>
      			<el-table-column prop="basic.name" label="付款人姓名" width="150">
      			</el-table-column>
            <el-table-column prop="basic.tel" label="付款人手机号" width="150">
            </el-table-column>
      			<el-table-column prop="created" label="收款时间" min-width="180" :formatter="formatDate">
      			</el-table-column>
      			<el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="small" @click="handleShow(scope.$index, scope.row)">详情</el-button>
              </template>
            </el-table-column>
      		</el-table>

          <!--工具条-->
      		<el-col :span="24" class="toolbar">
          <p style="float:left;margin:0;padding:0;padding-top:5px;padding-left:5px;">收入金额合计：{{ sum }}</p>
      			<el-pagination :current-page="page" layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
      			</el-pagination>
      		</el-col>
        </div>
      </el-tab-pane>
      <el-tab-pane label="退款明细" name="tab3">
      <!-- 退款明细 -->
        <div class="main-picker">
          <!--列表-->
          <el-table :data="refunds" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="amount" label="退款金额" width="150">
            </el-table-column>
            <el-table-column prop="basic.typehood" label="订单类型" width="150" :formatter="formatTypehood">
            </el-table-column>
            <el-table-column prop="basic.orderNo" label="订单号" width="150">
            </el-table-column>
            <el-table-column prop="basic.conferenceNo" label="会议号" width="150">
            </el-table-column>
            <el-table-column prop="basic.name" label="付款人姓名" width="150">
            </el-table-column>
            <el-table-column prop="basic.tel" label="付款人手机号" width="150">
            </el-table-column>
            <el-table-column prop="handlePeople.name" label="处理人" width="150">
            </el-table-column>
            <el-table-column prop="created" label="退款时间" min-width="180" :formatter="formatDate">
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="small" @click="handleShowRefund(scope.$index, scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--工具条-->
          <el-col :span="24" class="toolbar">
          <p style="float:left;margin:0;padding:0;padding-top:5px;padding-left:5px;">退款金额合计：{{ sumRefund }}</p>
            <el-pagination :current-page="pageRefund" layout="total, prev, pager, next" @current-change="handleCurrentChangeRefund" :page-size="sizeRefund" :total="totalRefund" style="float:right;">
            </el-pagination>
          </el-col>
        </div>
      </el-tab-pane>
    </el-tabs>
      <!--显示详情-->
        <el-dialog title="收入详情" :visible.sync="showFormVisible" :close-on-click-modal="false">
          <el-row>
            <el-col :span="6">
              订单号:
            </el-col>
            <el-col :span="18">
              {{ showForm.basic && showForm.basic.orderNo }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              会议号:
            </el-col>
            <el-col :span="18">
              {{ showForm.basic && showForm.basic.conferenceNo }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              收入金额:
            </el-col>
            <el-col :span="18">
              {{ showForm.amount }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              支付方式:
            </el-col>
            <el-col :span="18">
              {{ formatChannel(showForm) }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              付款人:
            </el-col>
            <el-col :span="18">
              {{ showForm.basic&&showForm.basic.name }}
            </el-col>
            
          </el-row>
          <el-row>
            <el-col :span="6">
              联系方式:
            </el-col>
            <el-col :span="18">
              {{ showForm.basic&&showForm.basic.tel }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              支付时间:
            </el-col>
            <el-col :span="18">
              {{ formatDate(showForm) }}
            </el-col>
          </el-row>
          
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="showFormVisible = false">关闭</el-button>
          </div>
        </el-dialog>
        <!--显示详情-->
        <el-dialog title="退款详情" :visible.sync="showRefundFormVisible" :close-on-click-modal="false">
          <el-row>
            <el-col :span="6">
              退款订单号:
            </el-col>
            <el-col :span="18">
              {{ showRefundForm.basic && showRefundForm.basic.orderNo }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              退款订单会议号:
            </el-col>
            <el-col :span="18">
              {{ showRefundForm.basic && showRefundForm.basic.conferenceNo }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              退款金额:
            </el-col>
            <el-col :span="18">
              {{ showRefundForm.amount }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              退款时间:
            </el-col>
            <el-col :span="18">
              {{ formatDate(showRefundForm) }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              付款人:
            </el-col>
            <el-col :span="18">
              <p>姓名：{{ showRefundForm.basic&&showRefundForm.basic.name }}</p>
              <p>性别： {{ showRefundForm.basic&&showRefundForm.basic.sex == 'M' ? '男' : '女' }}</p>
              <p>手机号：{{ showRefundForm.basic&&showRefundForm.basic.tel }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              处理人:
            </el-col>
            <el-col :span="18">
              <p>
                <img style="width: 60px; height: 60px;" :src="showRefundForm.handlePeople&&showRefundForm.handlePeople.avatar" />
              </p>
              <p>工号： {{ showRefundForm.handlePeople&&showRefundForm.handlePeople.customId}}</p>
              <p>姓名：{{ showRefundForm.handlePeople&&showRefundForm.handlePeople.name }}</p>
              <p>职务：{{ showRefundForm.handlePeople&&showRefundForm.handlePeople.title }}</p>
              <p>手机号：{{ showRefundForm.handlePeople&&showRefundForm.handlePeople.tel }}</p>
            </el-col>
          </el-row>
          
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="showRefundFormVisible = false">关闭</el-button>
          </div>
        </el-dialog>
        <!--下载提示对话框-->
        <el-dialog
        title="小提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span><a :href="dialogUrl" target="blank">{{ dialogText }}</a></span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { getIncomes, getRefunds, findTotalReport, findPeriodReport, exportIncomeExcel, exportRefundExcel } from '@/utils/api';
import moment from 'moment';

export default {
  name: 'page1006',
  data() {
    return {
      filters: {
        title: '',
        orderNo: '',
        conferenceNo: '',
        dates: [],
      },

      typehoodOptions: [{
        value: '1',
        label: '订房',
      }, {
        value: '2',
        label: '团餐',
      }],

      report: {
        today: {
          total: 0,
          books: 0,
          groupons: 0,
          refunds: 0,
        },
        month: {
          total: 0,
          books: 0,
          groupons: 0,
          refunds: 0,
        },
        year: {
          total: 0,
          books: 0,
          groupons: 0,
          refunds: 0,
        },
        total: {
          total: 0,
          books: 0,
          groupons: 0,
          refunds: 0,
        },
      },

      incomes: [],
      total: 0,
      sum: 0,
      size: 10,
      page: 1,

      refunds: [],
      totalRefund: 0,
      sizeRefund: 10,
      pageRefund: 1,
      sumRefund: 0,

      listLoading: false,
      activeTab: 'tab1',

      showFormVisible: false,
      showForm: {

      },
      showRefundFormVisible: false,
      showRefundForm: {

      },
      exportTitle: '导出收入明细Excel表',
      dialogVisible: false,
      dialogUrl: '',
      dialogText: '',
      exportLoading: false,
    };
  },
  methods: {
    onChangeTab() {
      switch (this.activeTab) {
        case 'tab1':
          this.exportTitle = '导出收入明细Excel表';
          this.getBrief();
          break;
        case 'tab2':
          this.exportTitle = '导出收入明细Excel表';
          this.getIncomes();
          break;
        case 'tab3':
          this.exportTitle = '导出退款明细Excel表';
          this.getRefunds();
          break;
        default:
          break;
      }
    },
    getIncomes() {
      getIncomes({
        name: this.filters.name,
        tel: this.filters.tel,
        orderNo: this.filters.orderNo,
        conferenceNo: this.filters.conferenceNo,
        typehood: this.filters.typehood,
        startTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[0]).valueOf() : '',
        endTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[1]).valueOf() : '',
        page: this.page,
        size: this.size,
      }).then((data) => {
        if (!data) {
          return;
        }
        this.incomes = data.list;
        this.total = data.total;
        this.sum = data.sum.toFixed(2);
      });
    },
    getRefunds() {
      getRefunds({
        name: this.filters.name,
        tel: this.filters.tel,
        orderNo: this.filters.orderNo,
        conferenceNo: this.filters.conferenceNo,
        typehood: this.filters.typehood,
        startTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[0]).valueOf() : '',
        endTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[1]).valueOf() : '',
        page: this.page,
        size: this.size,
      }).then((data) => {
        if (!data) {
          return;
        }
        this.refunds = data.list;
        this.totalRefund = data.total;
        this.sumRefund = data.sum.toFixed(2);
      });
    },
    getBrief() {
      findPeriodReport({
        keys: 'PAYMENT_AMOUNTS,CONFERENCE_ROOM_PAYMENT_AMOUNTS,GROUPON_PAYMENT_AMOUNTS,REFUND_AMOUNTS',
        channel: 'DATE',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      }).then((data) => {
        if (!data) {
          return;
        }
        data.forEach((d) => {
          if (d.key === 'PAYMENT_AMOUNTS') {
            this.report.today.total = d.value.toFixed(2);
          } else if (d.key === 'CONFERENCE_ROOM_PAYMENT_AMOUNTS') {
            this.report.today.books = d.value.toFixed(2);
          } else if (d.key === 'GROUPON_PAYMENT_AMOUNTS') {
            this.report.today.groupons = d.value.toFixed(2);
          } else if (d.key === 'REFUND_AMOUNTS') {
            this.report.today.refunds = d.value.toFixed(2);
          }
        });
      });
      // 本月
      findPeriodReport({
        keys: 'PAYMENT_AMOUNTS,CONFERENCE_ROOM_PAYMENT_AMOUNTS,GROUPON_PAYMENT_AMOUNTS,REFUND_AMOUNTS',
        channel: 'MONTH',
        startMonth: moment().format('YYYY-MM'),
        endMonth: moment().format('YYYY-MM'),
      }).then((data) => {
        if (!data) {
          return;
        }
        data.forEach((d) => {
          if (d.key === 'PAYMENT_AMOUNTS') {
            this.report.month.total = d.value.toFixed(2);
          } else if (d.key === 'CONFERENCE_ROOM_PAYMENT_AMOUNTS') {
            this.report.month.books = d.value.toFixed(2);
          } else if (d.key === 'GROUPON_PAYMENT_AMOUNTS') {
            this.report.month.groupons = d.value.toFixed(2);
          } else if (d.key === 'REFUND_AMOUNTS') {
            this.report.month.refunds = d.value.toFixed(2);
          }
        });
      });
      // 本年
      findPeriodReport({
        keys: 'PAYMENT_AMOUNTS,CONFERENCE_ROOM_PAYMENT_AMOUNTS,GROUPON_PAYMENT_AMOUNTS,REFUND_AMOUNTS',
        channel: 'YEAR',
        startYear: moment().format('YYYY'),
        endYear: moment().format('YYYY'),
      }).then((data) => {
        if (!data) {
          return;
        }
        data.forEach((d) => {
          if (d.key === 'PAYMENT_AMOUNTS') {
            this.report.year.total = d.value.toFixed(2);
          } else if (d.key === 'CONFERENCE_ROOM_PAYMENT_AMOUNTS') {
            this.report.year.books = d.value.toFixed(2);
          } else if (d.key === 'GROUPON_PAYMENT_AMOUNTS') {
            this.report.year.groupons = d.value.toFixed(2);
          } else if (d.key === 'REFUND_AMOUNTS') {
            this.report.year.refunds = d.value.toFixed(2);
          }
        });
      });
      findTotalReport({
        keys: 'PAYMENT_AMOUNTS,CONFERENCE_ROOM_PAYMENT_AMOUNTS,GROUPON_PAYMENT_AMOUNTS,REFUND_AMOUNTS',
      }).then((data) => {
        if (!data) {
          return;
        }
        data.forEach((d) => {
          if (d.key === 'PAYMENT_AMOUNTS') {
            this.report.total.total = d.value.toFixed(2);
          } else if (d.key === 'CONFERENCE_ROOM_PAYMENT_AMOUNTS') {
            this.report.total.books = d.value.toFixed(2);
          } else if (d.key === 'GROUPON_PAYMENT_AMOUNTS') {
            this.report.total.groupons = d.value.toFixed(2);
          } else if (d.key === 'REFUND_AMOUNTS') {
            this.report.total.refunds = d.value.toFixed(2);
          }
        });
      });
    },
    // 导出Excel表
    exportExcel() {
      const para = {
        orderNo: this.filters.orderNo,
        conferenceNo: this.filters.conferenceNo,
        name: this.filters.name,
        tel: this.filters.tel,
        typehood: this.filters.typehood,
        startTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[0]).valueOf() : '',
        endTime: (this.filters.dates && this.filters.dates.length > 1) ? moment(this.filters.dates[1]).valueOf() : '',
      };
      if (Object.values(para).join('') === '') {
        this.$message.warning('至少需要填写一个条件才能导出');
        return;
      }
      this.exportLoading = true;
      if (this.activeTab === 'tab3') {
        exportRefundExcel(para).then((data) => {
          this.exportLoading = false;
          if (!data) {
            return;
          }
          this.dialogText = (this.activeTab === 'tab3') ? '退款明细Excel表' : '收入明细Excel表';
          this.dialogUrl = data.url;
          this.dialogVisible = true;
        });
      } else {
        exportIncomeExcel(para).then((data) => {
          this.exportLoading = false;
          if (!data) {
            return;
          }
          this.dialogText = (this.activeTab === 'tab3') ? '退款明细Excel表' : '收入明细Excel表';
          this.dialogUrl = data.url;
          this.dialogVisible = true;
        });
      }
    },
    // 显示查看界面
    handleShow(index, row) {
      this.showFormVisible = true;
      this.showForm = row;
      // console.log(row);
    },
    // 显示查看界面
    handleShowRefund(index, row) {
      this.showRefundFormVisible = true;
      this.showRefundForm = row;
      console.log(row);
    },
    formatDate(row) {
      return moment(row.created).format('YYYY-MM-DD HH:mm:ss');
    },
    formatChannel(row) {
      const channels = {
        WEPAY: '微信支付',
      };
      return (row.channel in channels) ? channels[row.channel] : '未知';
    },
    formatTypehood(row) {
      const typehoods = {
        1: '订房',
        2: '团餐',
      };
      return (row.basic.typehood in typehoods) ? typehoods[row.basic.typehood] : '未知';
    },
    batchRemove() {},
    handleCurrentChange(val) {
      this.page = val;
      this.getIncomes();
    },
    handleCurrentChangeRefund(val) {
      this.pageRefund = val;
      this.getRefunds();
    },
    query() {
      if (this.activeTab === 'tab1') {
        this.activeTab = 'tab2';
      }
      if (this.activeTab === 'tab2') {
        this.page = 1;
        this.getIncomes();
      } else if (this.activeTab === 'tab3') {
        this.pageRefund = 1;
        this.getRefunds();
      }
    },
  },
  mounted() {
    this.getBrief();
  },
};
</script>

<style lang="scss" scoped>
.main-picker {
  margin-top: 0;
}

.total-title {
  text-align: center;
  color: gray;
}

.total-count {
  text-align: center;
  font-size: 19px;
  color: rgb(255,135,67);
}
</style>
