<template>
  <div class="page1000">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
    </div>
    <canvas id="canvas"></canvas>
    <el-tabs v-model="activeName" @tab-click="changeTab">
    <el-tab-pane label="基本" name="page1">
    <div class="main-picker">
    <div>
    <el-row>
      <el-col :span="6"><p class="total-title">总用户数</p><p class="total-count">{{ total.peoples }}</p></el-col>
      <el-col :span="6"><p class="total-title">总会议数</p><p class="total-count">{{ total.conferences }}</p></el-col>
      <el-col :span="6"><p class="total-title">总订单数</p><p class="total-count">{{ total.orders }}</p></el-col>
      <el-col :span="6"><p class="total-title">总收入金额</p><p class="total-count">{{ total.paymentAmounts }}</p></el-col>
      </el-row>
    </div>
    <div class="show-box">
    <el-switch
      v-model="showMode"
      active-text="累计"
      class="switch"
      @change="onChangeMode"
      inactive-text="新增">
    </el-switch>
    <el-date-picker
      v-model="period"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="periodChange"
      :picker-options="pickerOptions">
    </el-date-picker>
    </div>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.peoples" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.peoples" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferences" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferences" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferencePageViews" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferencePageViews" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferenceUserViews" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferenceUserViews" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.payments" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.payments" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.paymentAmounts" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.paymentAmounts" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>
    <el-tab-pane label="订房统计" name="page2">
      <div class="main-picker">
    <div class="show-box">
    <el-switch
      v-model="showMode"
      active-text="累计"
      class="switch"
      @change="onChangeMode"
      inactive-text="新增">
    </el-switch>
    <el-date-picker
      v-model="period"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="periodChange"
      :picker-options="pickerOptions">
    </el-date-picker>
    </div>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferenceRooms" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferenceRooms" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferenceRoomOrders" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferenceRoomOrders" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferenceRoomPaymentAmounts" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferenceRoomPaymentAmounts" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferenceHalfRooms" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferenceHalfRooms" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferenceHalfRoomOrders" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferenceHalfRoomOrders" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.conferenceHalfRoomPaymentAmounts" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.conferenceHalfRoomPaymentAmounts" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>
    <el-tab-pane label="团餐统计" name="page3">
      <div class="main-picker">
    <div class="show-box">
    <el-switch
      v-model="showMode"
      active-text="累计"
      class="switch"
      @change="onChangeMode"
      inactive-text="新增">
    </el-switch>
    <el-date-picker
      v-model="period"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="periodChange"
      :picker-options="pickerOptions">
    </el-date-picker>
    </div>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.groupons" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.groupons" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.grouponOrders" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.grouponOrders" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.grouponPaymentAmounts" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.grouponPaymentAmounts" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.grouponCancels" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.grouponCancels" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.grouponRefundOrders" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.grouponRefundOrders" :options="options" :height="200"></bar-chart>
          </el-col>
          <el-col :span="12">
            <area-chart v-if="showMode" :chart-data="chart.grouponRefundAmounts" :options="options" :height="200"></area-chart>
            <bar-chart v-else :chart-data="chart.grouponRefundAmounts" :options="options" :height="200"></bar-chart>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>
  </el-tabs>


  </div>
</template>

<script>
  import areaChart from '@/components/areaChart';
  import barChart from '@/components/barChart';
  /* eslint-disable */
  import pattern from 'patternomaly';
  import moment from 'moment';
  import { findTotalReport, findPeriodReport } from '@/utils/api'
  /* eslint-enable */

  export default {
    name: 'page1000',
    components: {
      areaChart,
      barChart,
    },
    data() {
      return {
        activeName: 'page1',
        showMode: true,
        period: moment(),
        filters: {
          startDate: moment().subtract(1, 'months').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - (3600 * 1000 * 24 * 7));
              picker.$emit('pick', [start, end]);
            },
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - (3600 * 1000 * 24 * 30));
              picker.$emit('pick', [start, end]);
            },
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
              picker.$emit('pick', [start, end]);
            },
          }],
        },
        total: {
          peoples: 0,
          conferences: 0,
          orders: 0,
          paymentAmounts: 0,
        },
        chart: {
          peoples: [],
          conferences: [],
          conferencePageViews: [],
          conferenceUserViews: [],
          payments: [],
          paymentAmounts: [],
          conferenceRooms: [],
          conferenceRoomOrders: [],
          conferenceRoomPaymentAmounts: [],
          conferenceHalfRooms: [],
          conferenceHalfRoomOrders: [],
          conferenceHalfRoomPaymentAmounts: [],
          groupons: [],
          grouponOrders: [],
          grouponPaymentAmounts: [],
          grouponCancels: [],
          grouponRefundOrders: [],
          grouponRefundAmounts: [],
        },
        options: {
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              fontSize: 15,
            },
          },
        },
      };
    },
    methods: {
      changeTab () {
        this.update();
      },
      periodChange() {
        if (this.period.length === 2 && this.period[0] && this.period[1]) {
          this.filters.startDate = moment(this.period[0]).format('YYYY-MM-DD');
          this.filters.endDate = moment(this.period[1]).format('YYYY-MM-DD');
          this.update();
        }
      },
      onChangeMode() {
        this.update();
      },
      update () {
        if (this.activeName === 'page1') {
          findTotalReport({
            keys: 'PEOPLES,ORDERS,CONFERENCES,CONFERENCE_VIEWS,CONFERENCE_USER_VIEWS,PAYMENTS,PAYMENT_AMOUNTS',
          }).then((data) => {
            if (!data) {
              return;
            }
            data.forEach((e) => {
              if (e.key === 'PEOPLES') {
                this.total.peoples = e.value;
              } else if (e.key === 'CONFERENCES') {
                this.total.conferences = e.value;
              } else if (e.key === 'ORDERS') {
                this.total.orders = e.value;
              } else if (e.key === 'PAYMENT_AMOUNTS') {
                this.total.paymentAmounts = e.value.toFixed(2);
              }
            });
          });
          findPeriodReport({
            keys: 'PEOPLES,CONFERENCES,CONFERENCE_VIEWS,CONFERENCE_USER_VIEWS,PAYMENTS,PAYMENT_AMOUNTS',
            channel: 'DATE',
            startDate: this.filters.startDate,
            endDate: this.filters.endDate,
          }).then((data) => {
            if (!data) {
              return;
            }
            const dates = {};
            const lasts = {
              peoples: 0,
              conferences: 0,
              conferencePageViews: 0,
              conferenceUserViews: 0,
              payments: 0,
              paymentAmounts: 0,
            };
            data.forEach((d) => {
              if (!(d.date in dates)) {
                dates[d.date] = {
                  peoples: lasts.peoples,
                  conferences: lasts.conferences,
                  conferencePageViews: lasts.conferencePageViews,
                  conferenceUserViews: lasts.conferenceUserViews,
                  payments: lasts.payments,
                  paymentAmounts: lasts.paymentAmounts,
                };
              }
              switch (d.key) {
                case 'PEOPLES':
                  if (this.showMode) {
                    dates[d.date].peoples = d.total || lasts.peoples;
                    lasts.peoples = dates[d.date].peoples;
                  } else {
                    dates[d.date].peoples = d.value || 0;
                  }
                  break;
                case 'CONFERENCES':
                  if (this.showMode) {
                    dates[d.date].conferences = d.total || lasts.conferences;
                    lasts.conferences = dates[d.date].conferences;
                  } else {
                    dates[d.date].conferences = d.value || 0;
                  }
                  break;
                case 'CONFERENCE_VIEWS':
                  if (this.showMode) {
                    dates[d.date].conferencePageViews = d.total || lasts.conferencePageViews;
                    lasts.conferencePageViews = dates[d.date].conferencePageViews;
                  } else {
                    dates[d.date].conferencePageViews = d.value || 0;
                  }
                  break;
                case 'CONFERENCE_USER_VIEWS':
                  if (this.showMode) {
                    dates[d.date].conferenceUserViews = d.total || lasts.conferenceUserViews;
                    lasts.conferenceUserViews = dates[d.date].conferenceUserViews;
                  } else {
                    dates[d.date].conferenceUserViews = d.value || 0;
                  }
                  break;
                case 'PAYMENTS':
                  if (this.showMode) {
                    dates[d.date].payments = d.total || lasts.payments;
                    lasts.payments = dates[d.date].payments;
                  } else {
                    dates[d.date].payments = d.value || 0;
                  }
                  break;
                case 'PAYMENT_AMOUNTS':
                  if (this.showMode) {
                    dates[d.date].paymentAmounts = d.total.toFixed(2) || lasts.paymentAmounts.toFixed(2);
                    lasts.paymentAmounts = dates[d.date].paymentAmounts;
                  } else {
                    dates[d.date].paymentAmounts = d.value.toFixed(2) || 0;
                  }
                  break;
                default:
                  break;
              }
            });
            this.fullfillData('用户数', Object.keys(dates), Object.values(dates).map((e) => e.peoples), 'peoples');
            this.fullfillData('会议数', Object.keys(dates), Object.values(dates).map((e) => e.conferences), 'conferences');
            this.fullfillData('会议PV', Object.keys(dates), Object.values(dates).map((e) => e.conferencePageViews), 'conferencePageViews');
            this.fullfillData('会议UV', Object.keys(dates), Object.values(dates).map((e) => e.conferenceUserViews), 'conferenceUserViews');
            this.fullfillData('成交数量', Object.keys(dates), Object.values(dates).map((e) => e.payments), 'payments');
            this.fullfillData('成交金额', Object.keys(dates), Object.values(dates).map((e) => e.paymentAmounts), 'paymentAmounts');
          });
        } else if (this.activeName === 'page2') {
          findPeriodReport({
            keys: 'CONFERENCE_ROOMS,CONFERENCE_ROOM_ORDERS,CONFERENCE_ROOM_PAYMENT_AMOUNTS,CONFERENCE_HALF_ROOMS,CONFERENCE_HALF_ROOM_ORDERS,CONFERENCE_HALF_ROOM_PAYMENT_AMOUNTS',
            channel: 'DATE',
            startDate: this.filters.startDate,
            endDate: this.filters.endDate,
          }).then((data) => {
            if (!data) {
              return;
            }
            const dates = {};
            const lasts = {
              conferenceRooms: 0,
              conferenceRoomOrders: 0,
              conferenceRoomPaymentAmounts: 0,
              conferenceHalfRooms: 0,
              conferenceHalfRoomOrders: 0,
              conferenceHalfRoomPaymentAmounts: 0,
            };
            data.forEach((d) => {
              if (!(d.date in dates)) {
                dates[d.date] = {
                  conferenceRooms: lasts.conferenceRooms,
                  conferenceRoomOrders: lasts.conferenceRoomOrders,
                  conferenceRoomPaymentAmounts: lasts.conferenceRoomPaymentAmounts,
                  conferenceHalfRooms: lasts.conferenceHalfRooms,
                  conferenceHalfRoomOrders: lasts.conferenceHalfRoomOrders,
                  conferenceHalfRoomPaymentAmounts: lasts.conferenceHalfRoomPaymentAmounts,
                };
              }
              switch (d.key) {
                case 'CONFERENCE_ROOMS':
                  if (this.showMode) {
                    dates[d.date].conferenceRooms = d.total || lasts.conferenceRooms;
                    lasts.conferenceRooms = dates[d.date].conferenceRooms;
                  } else {
                    dates[d.date].conferenceRooms = d.value || 0;
                  }
                  break;
                case 'CONFERENCE_ROOM_ORDERS':
                  if (this.showMode) {
                    dates[d.date].conferenceRoomOrders = d.total || lasts.conferenceRoomOrders;
                    lasts.conferenceRoomOrders = dates[d.date].conferenceRoomOrders;
                  } else {
                    dates[d.date].conferenceRoomOrders = d.value || 0;
                  }
                  break;
                case 'CONFERENCE_ROOM_PAYMENT_AMOUNTS':
                  if (this.showMode) {
                    dates[d.date].conferenceRoomPaymentAmounts = d.total.toFixed(2) || lasts.conferenceRoomPaymentAmounts.toFixed(2);
                    lasts.conferenceRoomPaymentAmounts = dates[d.date].conferenceRoomPaymentAmounts;
                  } else {
                    dates[d.date].conferenceRoomPaymentAmounts = d.value.toFixed(2) || 0;
                  }
                  break;
                case 'CONFERENCE_HALF_ROOMS':
                  if (this.showMode) {
                    dates[d.date].conferenceHalfRooms = d.total || lasts.conferenceHalfRooms;
                    lasts.conferenceHalfRooms = dates[d.date].conferenceHalfRooms;
                  } else {
                    dates[d.date].conferenceHalfRooms = d.value || 0;
                  }
                  break;
                case 'CONFERENCE_HALF_ROOM_ORDERS':
                  if (this.showMode) {
                    dates[d.date].conferenceHalfRoomOrders = d.total || lasts.conferenceHalfRoomOrders;
                    lasts.conferenceHalfRoomOrders = dates[d.date].conferenceHalfRoomOrders;
                  } else {
                    dates[d.date].conferenceHalfRoomOrders = d.value || 0;
                  }
                  break;
                case 'CONFERENCE_HALF_ROOM_PAYMENT_AMOUNTS':
                  if (this.showMode) {
                    dates[d.date].conferenceHalfRoomPaymentAmounts = d.total.toFixed(2) || lasts.conferenceHalfRoomPaymentAmounts.toFixed(2);
                    lasts.conferenceHalfRoomPaymentAmounts = dates[d.date].conferenceHalfRoomPaymentAmounts;
                  } else {
                    dates[d.date].conferenceHalfRoomPaymentAmounts = d.value.toFixed(2) || 0;
                  }
                  break;
                default:
                  break;
              }
            });
            this.fullfillData('客房销量', Object.keys(dates), Object.values(dates).map((e) => e.conferenceRooms), 'conferenceRooms');
            this.fullfillData('订房订单数', Object.keys(dates), Object.values(dates).map((e) => e.conferenceRoomOrders), 'conferenceRoomOrders');
            this.fullfillData('订房收入金额', Object.keys(dates), Object.values(dates).map((e) => e.conferenceRoomPaymentAmounts), 'conferenceRoomPaymentAmounts');
            this.fullfillData('拼房销量', Object.keys(dates), Object.values(dates).map((e) => e.conferenceHalfRooms), 'conferenceHalfRooms');
            this.fullfillData('拼房订单数', Object.keys(dates), Object.values(dates).map((e) => e.conferenceHalfRoomOrders), 'conferenceHalfRoomOrders');
            this.fullfillData('拼房收入金额', Object.keys(dates), Object.values(dates).map((e) => e.conferenceHalfRoomPaymentAmounts), 'conferenceHalfRoomPaymentAmounts');
          });
        } else if (this.activeName === 'page3') {
          findPeriodReport({
            keys: 'GROUPONS,GROUPON_ORDERS,GROUPON_PAYMENT_AMOUNTS,GROUPON_CANCELS,GROUPON_REFUND_ORDERS,GROUPON_REFUND_AMOUNTS',
            channel: 'DATE',
            startDate: this.filters.startDate,
            endDate: this.filters.endDate,
          }).then((data) => {
            if (!data) {
              return;
            }
            const dates = {};
            const lasts = {
              groupons: 0,
              grouponOrders: 0,
              grouponPaymentAmounts: 0,
              grouponCancels: 0,
              grouponRefundOrders: 0,
              grouponRefundAmounts: 0,
            };
            data.forEach((d) => {
              if (!(d.date in dates)) {
                dates[d.date] = {
                  groupons: lasts.groupons,
                  grouponOrders: lasts.grouponOrders,
                  grouponPaymentAmounts: lasts.grouponPaymentAmounts,
                  grouponCancels: lasts.grouponCancels,
                  grouponRefundOrders: lasts.grouponRefundOrders,
                  grouponRefundAmounts: lasts.grouponRefundAmounts,
                };
              }
              switch (d.key) {
                case 'GROUPONS':
                  if (this.showMode) {
                    dates[d.date].groupons = d.total || lasts.groupons;
                    lasts.groupons = dates[d.date].groupons;
                  } else {
                    dates[d.date].groupons = d.value || 0;
                  }
                  break;
                case 'GROUPON_ORDERS':
                  if (this.showMode) {
                    dates[d.date].grouponOrders = d.total || lasts.grouponOrders;
                    lasts.grouponOrders = dates[d.date].grouponOrders;
                  } else {
                    dates[d.date].grouponOrders = d.value || 0;
                  }
                  break;
                case 'GROUPON_PAYMENT_AMOUNTS':
                  if (this.showMode) {
                    dates[d.date].grouponPaymentAmounts = d.total.toFixed(2) || lasts.grouponPaymentAmounts.toFixed(2);
                    lasts.grouponPaymentAmounts = dates[d.date].grouponPaymentAmounts;
                  } else {
                    dates[d.date].grouponPaymentAmounts = d.value.toFixed(2) || 0;
                  }
                  break;
                case 'GROUPON_CANCELS':
                  if (this.showMode) {
                    dates[d.date].grouponCancels = d.total || lasts.grouponCancels;
                    lasts.grouponCancels = dates[d.date].grouponCancels;
                  } else {
                    dates[d.date].grouponCancels = d.value || 0;
                  }
                  break;
                case 'GROUPON_REFUND_ORDERS':
                  if (this.showMode) {
                    dates[d.date].grouponRefundOrders = d.total || lasts.grouponRefundOrders;
                    lasts.grouponRefundOrders = dates[d.date].grouponRefundOrders;
                  } else {
                    dates[d.date].grouponRefundOrders = d.value || 0;
                  }
                  break;
                case 'GROUPON_REFUND_AMOUNTS':
                  if (this.showMode) {
                    dates[d.date].grouponRefundAmounts = d.total.toFixed(2) || lasts.grouponRefundAmounts.toFixed(2);
                    lasts.grouponRefundAmounts = dates[d.date].grouponRefundAmounts;
                  } else {
                    dates[d.date].grouponRefundAmounts = d.value.toFixed(2) || 0;
                  }
                  break;
                default:
                  break;
              }
            });
            this.fullfillData('团餐销量', Object.keys(dates), Object.values(dates).map((e) => e.groupons), 'groupons');
            this.fullfillData('团餐订单数', Object.keys(dates), Object.values(dates).map((e) => e.grouponOrders), 'grouponOrders');
            this.fullfillData('团餐收入金额', Object.keys(dates), Object.values(dates).map((e) => e.grouponPaymentAmounts), 'grouponPaymentAmounts');
            this.fullfillData('团餐取消数', Object.keys(dates), Object.values(dates).map((e) => e.grouponCancels), 'grouponCancels');
            this.fullfillData('团餐退款订单数', Object.keys(dates), Object.values(dates).map((e) => e.grouponRefundOrders), 'grouponRefundOrders');
            this.fullfillData('团餐退款金额', Object.keys(dates), Object.values(dates).map((e) => e.grouponRefundAmounts), 'grouponRefundAmounts');
          });
        }
      },
      fullfillData (label, labels, srcData, dstData) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(255,135,67,0.5)');
        gradient.addColorStop(0.5, 'rgba(255,135,67,0.25)');
        gradient.addColorStop(0.9, 'rgba(255,135,67,0.05)');
        gradient.addColorStop(1, 'rgba(255,135,67,0)');

        this.chart[dstData] = {
          labels,
          datasets: [
            {
              label,
              backgroundColor: (this.showMode) ? gradient : pattern.draw('dot-dash', 'rgb(255,135,67)'),
              borderColor: 'rgb(255,135,67)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgb(255,135,67)',
              pointBackgroundColor: 'rgb(255,135,67)',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgb(255,135,67)',
              pointHoverBorderColor: 'rgb(255,135,67)',
              pointHoverBorderWidth: 2,
              pointRadius: 3,
              pointHitRadius: 10,
              data: srcData,
            },
          ],
        };
      },
    },
    mounted () {
      this.update();
    },
  };
</script>

<style lang="scss" scoped>
.page1000 {
  height: 100%;
  padding-bottom: 20px;
}
.main-picker {
  background: #fff;
  margin-top: 0;
}
#canvas {
  display: none;
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

.show-box {
  text-align: right;
  padding-right: 25px;
  padding-top: 20px;
}

.switch {
  margin-right: 25px;
}

.chart-container {
  width: 100%;
  float: left;
}

.el-col {
  padding: 30px 20px;
}
</style>
