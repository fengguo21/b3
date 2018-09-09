<template>
  <div class="page1005">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
      <el-input clearable class="mg-r-15" placeholder="会议号" v-model="filters.conferenceNo"></el-input>
      <el-input clearable class="mg-r-15" placeholder="团餐号" v-model="filters.grouponNo"></el-input>
      <el-input clearable class="mg-r-15" placeholder="团餐标题" v-model="filters.title"></el-input>
      <el-button class="mg-r-15" type="" @click="query">查询团餐</el-button>
      <el-button type="primary" @click="handleAdd">新增团餐</el-button>
    </div>
    <div class="main-picker">
    <el-table :data="rooms" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column label="封面" width="200">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" class="avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="basic.grouponNo" label="团餐号" width="150">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="200">
      </el-table-column>
      <el-table-column prop="conference.title" label="会议" width="200">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="120">
      </el-table-column>
      <el-table-column prop="minCount" label="最小人数" width="120">
      </el-table-column>
      <el-table-column prop="created" label="创建时间" min-width="180" :formatter="formatDate">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleShow(scope.$index, scope.row)">详情</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :current-page="page" layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
    </div>
    <!--新增界面-->
    <el-dialog title="新增团餐" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="会议号" prop="conferenceNo">
          <el-input v-model="addForm.conferenceNo" class="mini-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" class="mini-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="addForm.price" :min="0" :max="1000" label="团餐价格"></el-input-number>
        </el-form-item>
        <el-form-item label="最小人数">
          <el-input-number v-model="addForm.minCount" :min="1" :max="10000" label="最小人数"></el-input-number>
        </el-form-item>
        <el-form-item label="最大人数">
          <el-input-number v-model="addForm.maxCount" :min="1" :max="10000" label="最大人数"></el-input-number>
        </el-form-item>
        <el-form-item label="报名截止日期">
        <el-date-picker
          v-model="addForm.deadDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="封面">
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
        <el-form-item label="规则说明" prop="text">
          <el-input type="textarea" class="mini-input" :rows="4" v-model="addForm.text" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="详情">
        <el-row>
        <el-col :span="6">
        名称
        </el-col>
        <el-col :span="12">
        说明
        </el-col>
        <el-col :span="6">
        操作
        </el-col>
        </el-row>

        <el-row v-for="(desc, index) in grouponDescs" :key="index" class="desc-row">
          <el-col :span="6" class="desc-row-fixed">
        <el-input v-model="desc.title" label=""></el-input>
        </el-col>
        <el-col :span="12">
            <el-input v-model="desc.text" label=""></el-input>
            </el-col>
            <el-col :span="6">
            <i class="el-icon-circle-plus-outline" @click="addGrouponDesc(index)"></i><i class="el-icon-remove-outline" @click="removeGrouponDesc(index)" v-if="grouponDescs.length > 1"></i>
            </el-col>
        </el-row>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="编辑团餐" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="会议">
          {{ editForm.conference && editForm.conference.title }}
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" class="mini-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="editForm.price" :min="0" :max="1000" label="团餐价格"></el-input-number>
        </el-form-item>
        <el-form-item label="最小人数">
          <el-input-number v-model="editForm.minCount" :min="1" :max="10000" label="最小人数"></el-input-number>
        </el-form-item>
        <el-form-item label="最大人数">
          <el-input-number v-model="editForm.maxCount" :min="1" :max="10000" label="最大人数"></el-input-number>
        </el-form-item>
        <el-form-item label="报名截止日期">
        <el-date-picker
          v-model="editForm.deadDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="封面">
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
        <el-form-item label="规则说明" prop="text">
          <el-input type="textarea" class="mini-input" :rows="4" v-model="eidtText" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="详情">
        <el-row>
        <el-col :span="6">
        名称
        </el-col>
        <el-col :span="12">
        说明
        </el-col>
        <el-col :span="6">
        操作
        </el-col>
        </el-row>

        <el-row v-for="(desc, index) in grouponDescs" :key="index" class="desc-row">
          <el-col :span="6" class="desc-row-fixed">
        <el-input v-model="desc.title" label=""></el-input>
        </el-col>
        <el-col :span="12">
            <el-input v-model="desc.text" label=""></el-input>
            </el-col>
            <el-col :span="6">
            <i class="el-icon-circle-plus-outline" @click="addGrouponDesc(index)"></i><i class="el-icon-remove-outline" @click="removeGrouponDesc(index)" v-if="grouponDescs.length > 1"></i>
            </el-col>
        </el-row>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
      <el-button type="danger" plain @click.native="handleDel" :loading="editLoading" style="float:left">删除</el-button>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--显示详情-->
    <el-dialog title="团餐详情" :visible.sync="showFormVisible" :close-on-click-modal="false">
    <el-tabs v-model="activeName" @tab-click="onChangeShowTab" class="fixed">
    <el-tab-pane label="基本信息" name="pane1">
      <el-row>
        <el-col :span="4">
          团餐封面:
        </el-col>
        <el-col :span="20">
          <img style="width: 256px; height: 128px" :src="showForm.avatar" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          团餐号:
        </el-col>
        <el-col :span="20">
          <h1 class="groupon-no">{{ showForm.basic && showForm.basic.grouponNo }}</h1>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          会议号:
        </el-col>
        <el-col :span="20">
          {{ showForm.basic && showForm.basic.conferenceNo }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          会议标题:
        </el-col>
        <el-col :span="20">
          {{ showForm.conference&&showForm.conference.title }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          团餐标题:
        </el-col>
        <el-col :span="20">
          {{ showForm.title }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          团餐价格:
        </el-col>
        <el-col :span="20">
          {{ showForm.price }}元/人
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          团餐规则:
        </el-col>
        <el-col :span="20">
          {{ (showForm.basic&&showForm.basic.text) || '暂无' }}
        </el-col>
      </el-row>
      <el-row v-if="showForm.basic&&showForm.basic.desc">
        <el-col :span="4">
          团餐描述:
        </el-col>
        <el-col :span="10">
          <div>描述名称</div>
          <div v-for="item in showForm.basic&&showForm.basic.desc" :key="item.title">{{item.title}}</div>
        </el-col>
        <el-col :span="10">
          <div>描述内容</div>
          <div v-for="item in showForm.basic&&showForm.basic.desc" :key="item.title">{{item.text}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          开团人数:
        </el-col>
        <el-col :span="8">
          {{ showForm.minCount }}人
        </el-col>
        <el-col :span="4">
          团满人数:
        </el-col>
        <el-col :span="8">
          {{ showForm.maxCount }}人
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          开始日期:
        </el-col>
        <el-col :span="8">
          {{ showForm.conference&&showForm.conference.startDate }}
        </el-col>
        <el-col :span="4">
          结束日期:
        </el-col>
        <el-col :span="8">
          {{ showForm.conference&&showForm.conference.endDate }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          报名截止日期:
        </el-col>
        <el-col :span="8">
          {{ showForm.basic && showForm.basic.deadDate }}
        </el-col>
        <el-col :span="4">
          创建时间:
        </el-col>
        <el-col :span="8">
          {{ formatDate(showForm) }}
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="团餐状态" name="pane2">
    <el-row>
      <el-col :span="4">
        日期
      </el-col>
      <el-col :span="4">
        最大人数
      </el-col>
      <el-col :span="4">
        最少人数
      </el-col>
      <el-col :span="4">
        已付款
      </el-col>
      <el-col :span="4">
        付款中
      </el-col>
      <el-col :span="4">
        状态
      </el-col>
      </el-row>
      <el-row v-for="item in formatSoldCount(showForm.soldCount)" :key="item.date">
      <el-col :span="4">
      {{ item.date }}
      </el-col>
      <el-col :span="4">
        {{ showForm.maxCount }}
      </el-col>
      <el-col :span="4">
        {{ showForm.minCount }}
      </el-col>
      <el-col :span="4">
        {{ item.A }}
      </el-col>
      <el-col :span="4">
        {{ item.B }}
      </el-col>
      <el-col :span="4">
        <el-tag type="primary" v-if="formatStep(showForm.minCount, item.A, showForm.basic && showForm.basic.deadDate) === 1">报名中</el-tag>
        <el-tag type="success" v-if="formatStep(showForm.minCount, item.A, showForm.basic && showForm.basic.deadDate) === 2">已成团</el-tag>
        <el-tag type="info" v-if="formatStep(showForm.minCount, item.A, showForm.basic && showForm.basic.deadDate) === 3">已取消</el-tag>
      </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="报名列表" name="pane3">
      <el-row>
    <el-col :span="24" class="groupon-orders-row">
      <el-input v-model="grouponOrdersFilters.name" placeholder="姓名" clearable></el-input>
      <el-input v-model="grouponOrdersFilters.tel" placeholder="手机号" clearable></el-input>
      <el-date-picker
        v-model="grouponOrdersFilters.date"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="团餐日期">
      </el-date-picker>
      <el-button type="primary" plain @click="queryGrouponOrders">查询</el-button>
    </el-col>
    </el-row>
    <el-table
      :data="grouponOrders"
      v-loading="listLoadingGrouponOrders"
      style="width: 100%">
      <el-table-column
        label="用户"
        width="80">
        <template slot-scope="scope">
          <img :src="scope.row.people.avatar" class="avatar mini"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="basic.name"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="basic.tel"
        label="手机号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="basic.dates"
        :formatter="formatDates"
        label="日期">
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :current-page="page" layout="total, prev, pager, next" @current-change="handleCurrentChangeGrouponOrders" :page-size="grouponOrdersSize" :total="grouponOrdersTotal" style="float:right;">
      </el-pagination>
    </el-col>
    </el-tab-pane>
  </el-tabs>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="showFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getGroupon, getGroupons, addGroupon, editGroupon, removeGroupon, getOrders } from '@/utils/api';
  import { avatarPath } from '@/utils/commonConfig';
  import moment from 'moment';

  export default {
    name: 'page1005',
    data() {
      return {
        filters: {
          conferenceNo: '',
          grouponNo: '',
          title: '',
        },
        avatarPath,
        rooms: [],
        page: 1,
        size: 10,
        total: 0,

        grouponOrdersFilters: {
          name: '',
          tel: '',
          date: '',
        },

        activeName: 'pane1',

        imageUrl: '',

        grouponDescs: [{ title: '', text: '' }],

        listLoading: false,

        addFormVisible: false,
        addLoading: false,
        addForm: {
          conferenceNo: '',
          title: '',
          price: 1,
          minCount: 1,
          maxCount: 1,
          deadDate: '',
          avatar: '',
        },
        addFormRules: {
          conferenceNo: [
            { required: true, message: '请输入会议号', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
        },

        editFormVisible: false,
        editLoading: false,
        eidtText: '',
        editForm: {
          grouponId: '',
          deadDate: '',
          title: '',
          price: 1,
          minCount: 1,
          maxCount: 1,
          avatar: '',
        },
        editFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
        },

        showFormVisible: false,
        showForm: {

        },

        grouponOrders: [],
        grouponOrdersTotal: 0,
        grouponOrdersPage: 1,
        grouponOrdersSize: 10,
        listLoadingGrouponOrders: false,
      };
    },
    methods: {
      formatDate(row) {
        return moment(row.created).format('YYYY-MM-DD HH:mm:ss');
      },
      formatDates(row) {
        return row.basic.dates.join(', ');
      },
      formatStep(minCount, sold, deadDate) {
        if (sold >= minCount) {
          return 2;
        } else if (sold < minCount && moment().format('YYYY-MM-DD') <= deadDate) {
          return 1;
        }
        return 3;
      },
      formatTypehood(row) {
        const typehoods = {
          NORMAL: '普通',
          SPECIAL: '可拼',
        };
        return (row.typehood in typehoods) ? typehoods[row.typehood] : '未知';
      },
      formatSoldCount(soldCount) {
        if (!this.showForm.conference || !soldCount) {
          return [];
        }
        const dates = {};
        let currentDate = this.showForm.conference.startDate;
        while (currentDate <= this.showForm.conference.endDate) {
          dates[currentDate] = {
            A: 0,
            B: 0,
          };
          currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
        }
        Object.assign(dates, soldCount);
        return Object.keys(dates).map((e) => ({
          date: e,
          A: dates[e].A || 0,
          B: dates[e].B || 0,
        })).sort((a, b) => ((a.date < b.date) ? -1 : 1));
      },
      onChangeShowTab() {
        this.grouponOrders = [];
        this.grouponOrdersTotal = 0;
        switch (this.activeName) {
          case 'pane3':
            this.getGrouponOrders();
            break;
          default:
            break;
        }
      },
      addGrouponDesc(index) {
        this.grouponDescs.splice(index + 1, 0, {
          title: '',
          text: '',
        });
      },
      removeGrouponDesc(index) {
        this.grouponDescs.splice(index, 1);
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getGroupons();
      },
      handleCurrentChangeGrouponOrders(val) {
        this.grouponOrdersPage = val;
        this.getGrouponOrders();
      },
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
      getGroupons() {
        this.listLoading = true;
        getGroupons({
          conferenceNo: this.filters.conferenceNo,
          grouponNo: this.filters.grouponNo,
          title: this.filters.title,
          page: this.page,
          size: this.size,
        }).then((data) => {
          this.listLoading = false;
          this.total = data.total;
          this.rooms = data.list;
        });
      },
      getGrouponOrders() {
        this.listLoadingGrouponOrders = true;
        getOrders({
          conferenceId: this.showForm.conferenceId,
          name: this.grouponOrdersFilters.name,
          tel: this.grouponOrdersFilters.tel,
          date: this.grouponOrdersFilters.date,
          typehood: 2,
          step: 2,
          page: this.grouponOrdersPage,
          size: this.grouponOrdersSize,
        }).then((data) => {
          this.listLoadingGrouponOrders = false;
          if (!data) {
            return;
          }
          this.grouponOrders = data.list;
          this.grouponOrdersTotal = data.total;
        });
      },
      handleAdd() {
        this.addFormVisible = true;
        this.addForm = {
          title: '',
          avatar: '',
          deadDate: '',
          typehood: 'NORMAL',
        };
        this.imageUrl = '';
        this.grouponDescs = [{ title: '', text: '' }];
        this.addLoading = false;
      },
      // 显示编辑界面
      handleEdit(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row, {
          deadDate: row.basic.deadDate,
        });
        this.imageUrl = row.avatar;
        this.grouponDescs = (row.basic && row.basic.desc && row.basic.desc.length > 0) ? row.basic.desc : [{ title: '', text: '' }];
        this.eidtText = row.basic && row.basic.text;
        this.editLoading = false;
      },
      // 显示查看界面
      handleShow(index, row) {
        this.showFormVisible = true;
        this.showForm = {};
        getGroupon({
          grouponId: row.grouponId,
        }).then((data) => {
          if (!data) {
            return;
          }
          this.showForm = data;
        });
      },
      // 新增团餐
      addSubmit() {
        let descValid = true;
        this.grouponDescs.forEach(r => {
          if (!r.title || !r.text) {
            descValid = false;
          }
        });
        if (!descValid) {
          this.$message.warning('描述不能为空');
          return;
        }
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              const para = Object.assign({}, this.addForm);
              para.avatar = this.imageUrl;
              para.desc = this.grouponDescs;

              addGroupon(para).then((data) => {
                this.addLoading = false;
                if (!data) {
                  return;
                }
                this.$message.success('新增团餐成功');
                this.addFormVisible = false;
                this.query();
              });
            });
          }
        });
      },
      // 修改团餐
      editSubmit() {
        let descValid = true;
        this.grouponDescs.forEach(r => {
          if (!r.title || !r.text) {
            descValid = false;
          }
        });
        if (!descValid) {
          this.$message.warning('描述不能为空');
          return;
        }
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              const para = Object.assign({}, this.editForm);
              para.avatar = this.imageUrl;
              para.desc = this.grouponDescs;
              para.text = this.eidtText;
              // console.log(para); return;
              editGroupon(para).then((data) => {
                this.editLoading = false;
                if (!data) {
                  return;
                }
                this.$message.success('修改团餐成功');
                this.editFormVisible = false;
                this.getGroupons();
              });
            });
          }
        });
      },
      // 删除团餐
      handleDel() {
        this.$confirm(`确认删除团餐：${this.editForm.title} 吗?`, '提示', {
          type: 'warning',
        }).then(() => {
          this.editLoading = true;
          removeGroupon({
            grouponId: this.editForm.grouponId,
          }).then((data) => {
            this.editLoading = false;
            if (!data) {
              return;
            }
            this.editFormVisible = false;
            this.getGroupons();
            this.$message.success('删除团餐成功');
          });
        }).catch(() => {
          this.$message.info('取消删除团餐');
        });
      },
      // 搜索
      query() {
        this.page = 1;
        this.getGroupons();
      },
      // 搜索团餐参加人员
      queryGrouponOrders() {
        this.grouponOrdersPage = 1;
        this.getGrouponOrders();
      },
    },
    mounted() {
      this.getGroupons();
    },
  };
</script>

<style lang="scss" scoped>
.avatar, .avatar-uploader-icon{
  width: 128px;
  height: 64px;
  line-height: 64px;
  font-size: 64px;
  text-align: center;
  vertical-align: middle;
  color: #e3e3e3;
}
.avatar.big, .avatar-uploader-icon.big{
  width: 256px;
  height: 128px;
  line-height: 128px;
  font-size: 128px;
}
.avatar.mini {
  width: 36px;
  height: 36px;
}
.el-icon-circle-plus-outline {
  font-size: 32px;
  color: #409EFF;
  vertical-align: middle;
  margin-left: 15px;
  cursor: pointer;
}

.el-icon-remove-outline {
  font-size: 32px;
  color: #f56c6c;
  vertical-align: middle;
  margin-left: 15px;
  cursor: pointer;
}

.desc-row {
  margin-bottom: 15px;
}
.desc-row-fixed {
  padding-right: 15px;
}
.fixed {
  margin-top: -15px;
}
.groupon-orders-row {
  padding-bottom: 10px;
}
.groupon-orders-row .el-input {
  width: 200px;
  margin-right: 10px;
}
.mini-input {
  width: 50%;
}
.groupon-no {
  font-size: 19px;
}
</style>

