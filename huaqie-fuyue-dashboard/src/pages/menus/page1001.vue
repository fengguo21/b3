<template>
  <div class="page1001">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
      <el-input clearable class="mg-r-15" placeholder="昵称" v-model="filters.nickName"></el-input>
      <el-input clearable class="mg-r-15" placeholder="姓名" v-model="filters.name"></el-input>
      <el-input clearable class="mg-r-15" placeholder="手机号" v-model="filters.tel"></el-input>
      <el-input clearable class="mg-r-15" placeholder="身份证号" v-model="filters.identityId"></el-input>
      <el-button type="" @click="query">查询用户</el-button>
    </div>
    <div class="main-picker">
    <el-table :data="peoples" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.basic.avatar || defaultAvatar" class="avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="basic.name" label="昵称" width="200">
      </el-table-column>
      <el-table-column prop="basic.sex" label="性别" width="100" :formatter="formatSex">
      </el-table-column>
      <el-table-column prop="basic.province" label="省份" width="150">
      </el-table-column>
      <el-table-column prop="basic.city" label="城市" width="150">
      </el-table-column>
      <el-table-column prop="created" label="注册时间" min-width="180" :formatter="formatDate">
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
    <el-dialog title="用户详情" :visible.sync="showFormVisible" :close-on-click-modal="false">
      <el-row>
        <el-col :span="4">
          用户头像:
        </el-col>
        <el-col :span="5">
          <img style="width: 100%;" :src="showForm.basic.avatar" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          用户ID:
        </el-col>
        <el-col :span="20">
          {{ showForm.peopleId }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          昵称:
        </el-col>
        <el-col :span="8">
          {{ showForm.basic.name }}
        </el-col>
        <el-col :span="4">
          性别:
        </el-col>
        <el-col :span="8">
          {{ showForm.basic.sex | filterSex }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          国籍:
        </el-col>
        <el-col :span="8">
          {{ showForm.basic.country }}
        </el-col>
        <el-col :span="4">
          所在地区:
        </el-col>
        <el-col :span="8">
          {{ showForm.basic.area }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          所属省份:
        </el-col>
        <el-col :span="8">
          {{ showForm.basic.province }}
        </el-col>
        <el-col :span="4">
          所在城市:
        </el-col>
        <el-col :span="8">
          {{ showForm.basic.city }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          注册时间:
        </el-col>
        <el-col :span="20">
          {{ showForm.created | filterDate }}
        </el-col>
      </el-row>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="showFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getPeople, getPeoples } from '@/utils/api';
  import moment from 'moment';

  export default {
    name: 'page1001',
    data() {
      return {
        defaultAvatar: 'https://qbox.huaqie.com/FmkK21LYHkS6OfkbhL7aw9W0tcl5',
        filters: {
          nickName: '',
          name: '',
          tel: '',
          identityId: '',
        },
        peoples: [],
        total: 0,
        size: 10,
        page: 1,

        showFormVisible: false,
        showForm: {
          basic: {},
        },
        listLoading: false,
      };
    },
    filters: {
      filterSex(val) {
        return val === 1 ? '男' : '女';
      },
      filterDate(val) {
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    methods: {
      formatDate(row) {
        return moment(row.created).format('YYYY-MM-DD HH:mm:ss');
      },
      formatSex(row) {
        return (row.basic.sex === 1) ? '男' : '女';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getPeoples();
      },
      // 显示查看界面
      handleShow(index, row) {
        this.showFormVisible = true;
        // this.showForm = {};
        getPeople({
          peopleId: row.peopleId,
        }).then((data) => {
          if (!data) {
            return;
          }
          this.showForm = data;
          // console.log(data);
        });
      },
      getPeoples() {
        getPeoples({
          nickName: this.filters.nickName,
          name: this.filters.name,
          tel: this.filters.tel,
          identityId: this.filters.identityId,
          page: this.page,
          size: this.size,
        }).then((data) => {
          if (!data) {
            return;
          }
          this.peoples = data.list;
          this.total = data.total;
        });
      },
      query() {
        this.page = 1;
        this.getPeoples();
      },
    },
    mounted() {
      this.getPeoples();
    },
  };
</script>

<style lang="scss" scoped>
.avatar {
  width: 48px;
  height: 48px;
}
</style>
