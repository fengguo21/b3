<template>
  <div class="page1008">
    <div class="top-picker">
      <span class="page-title mg-r-15">{{$route.meta.name}}</span>
      <el-input clearable class="mg-r-15" placeholder="工号" v-model="filters.customId"></el-input>
      <el-input clearable class="mg-r-15" placeholder="员工姓名" v-model="filters.name"></el-input>
      <el-input clearable class="mg-r-15" placeholder="手机号码" v-model="filters.tel"></el-input>
      <el-input clearable class="mg-r-15" placeholder="日志内容" v-model="filters.text"></el-input>
      <el-date-picker
        class="mg-r-15"
        style="height: 46px"
        v-model="filters.date"
        type="daterange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right">
      </el-date-picker>
      <el-button @click="query">查询日志</el-button>
    </div>

    <div class="main-picker">
      <!--列表-->
  		<el-table :data="logs" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
  			<el-table-column type="index" width="60">
  			</el-table-column>
  			<el-table-column prop="people.customId" label="工号" width="150">
  			</el-table-column>
        <el-table-column prop="people.name" label="姓名" width="150">
        </el-table-column>
  			<el-table-column prop="people.tel" label="手机号" width="150">
  			</el-table-column>
  			<el-table-column prop="people.title" label="职务" width="150">
  			</el-table-column>
  			<el-table-column prop="text" label="内容" min-width="300">
  			</el-table-column>
  			<el-table-column prop="created" label="创建时间" width="200" :formatter="formatDate">
  			</el-table-column>
        <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button size="small" @click="handleShow(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
  		</el-table>
      <!--工具条-->
  		<el-col :span="24" class="toolbar">
  			<el-pagination :current-page="page" layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
  			</el-pagination>
  		</el-col>
    </div>
    <!--显示详情-->
    <el-dialog title="日志详情" :visible.sync="showFormVisible" :close-on-click-modal="false">
      <el-row>
      <el-col :span="6">
        用户ID:
      </el-col>
      <el-col :span="18">
        {{ showForm.peopleId }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        操作人:
      </el-col>
      <el-col :span="18">
        {{ showForm.people && showForm.people.name }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        手机号:
      </el-col>
      <el-col :span="18">
        {{ showForm.people && showForm.people.tel }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        职务:
      </el-col>
      <el-col :span="18">
        {{ showForm.people && showForm.people.title }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        内容:
      </el-col>
      <el-col :span="18">
        {{ showForm.text }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        创建时间:
      </el-col>
      <el-col :span="18">
        {{ moment(showForm.created).format('YYYY-MM-DD HH:mm:ss') }}
      </el-col>
      </el-row>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="showFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getLogs } from '@/utils/api';
  import moment from 'moment';

  export default {
    name: 'page1008',
    data() {
      return {
        logs: [],
        moment,
        total: 0,
        page: 1,
        size: 10,
        listLoading: false,
        filters: {
          customId: '',
          name: '',
          tel: '',
          text: '',
          date: [],
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 604800000);
              picker.$emit('pick', [start, end]);
            },
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 2592000000);
              picker.$emit('pick', [start, end]);
            },
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 7776000000);
              picker.$emit('pick', [start, end]);
            },
          }],
        },

        showFormVisible: false,
        showForm: {

        },
      };
    },
    methods: {
      formatDate(row) {
        return moment(row.created).format('YYYY-MM-DD HH:mm:ss');
      },
      // 显示查看界面
      handleShow(index, row) {
        this.showFormVisible = true;
        this.showForm = row;
      },
      getLogs() {
        // console.log(this.filters);
        // moment(this.filters.date[0]).format('YYYY-MM-DD') : '',
        // moment(this.filters.date[1]).format('YYYY-MM-DD') : '',
        getLogs({
          customId: this.filters.customId,
          name: this.filters.name,
          tel: this.filters.tel,
          text: this.filters.text,
          startDate: this.filters.date && this.filters.date[0],
          endDate: this.filters.date && this.filters.date[1],
          page: this.page,
          size: this.size,
        }).then((data) => {
          if (!data) {
            return;
          }
          this.logs = data.list;
          this.total = data.total;
        });
      },
      query() {
        this.page = 1;
        this.getLogs();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getLogs();
      },
    },
    mounted() {
      this.getLogs();
    },
  };
</script>

<style lang="scss" scoped>
</style>
