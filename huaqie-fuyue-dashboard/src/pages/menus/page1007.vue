<template>
  <div class="page1007">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
      <el-input clearable class="mg-r-15" placeholder="员工编号" v-model="filter.customId"></el-input>
      <el-input clearable class="mg-r-15" placeholder="员工姓名" v-model="filter.name"></el-input>
      <el-input clearable class="mg-r-15" placeholder="手机号码" v-model="filter.tel"></el-input>
      <el-button class="mg-r-15" type="" @click='query'>查询员工</el-button>
      <el-button type="primary" @click='addMember'>新增员工</el-button>
    </div>

    <div class="main-picker">
      <!--列表-->
  		<el-table :data="member" stripe highlight-current-row style="width: 100%;" v-loading="listLoading" >
  			<el-table-column type="index" width="60">
  			</el-table-column>
        <el-table-column prop="basic.avatar" label="头像" width="100">
          <template slot-scope="scope">
            <div class="avatar-wrap">
              <img class='avatar' :src="scope.row.basic.avatar||defaultSysAvatar" />
            </div>
          </template>
  			</el-table-column>
  			<el-table-column prop="basic.name" label="姓名">
  			</el-table-column>
        <el-table-column prop="basic.customId" label="工号">
  			</el-table-column>
  			<el-table-column prop="basic.tel" label="手机号">
  			</el-table-column>
  			<el-table-column prop="basic.title" label="职称">
  			</el-table-column>
        <el-table-column prop="created" :formatter="formatDate" label="创建时间">
  			</el-table-column>
  			<el-table-column label="操作" width="220">
  				<template slot-scope="scope">
            <el-button size="small" @click="handleShow(scope.$index, scope.row)">详情</el-button>
  					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handlePower(scope.$index, scope.row)">权限</el-button>
  				</template>
  			</el-table-column>
  		</el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination :current-page="page" layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </div>

    <!-- 新增员工弹窗 -->
    <el-dialog title="新增员工" :visible.sync="addMemberFormVisible" @close="initAddDialog">
      <el-form ref="addMemberForm" :model="addMemberForm" :rules="rulesAddMember">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addMemberForm.name" class="mini-input" placeholder="请输入员工姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="addMemberForm.tel" class="mini-input" placeholder="请输入手机号码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职称" :label-width="formLabelWidth" prop="title">
          <el-input v-model="addMemberForm.title" class="mini-input" placeholder="请输入职称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工编号" :label-width="formLabelWidth" prop="customId">
          <el-input v-model="addMemberForm.customId" class="mini-input" placeholder="请输入员工编号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" class="mini-input" v-model="addMemberForm.password" placeholder="请输入员工编号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="avatarPath"
            :show-file-list="false"
            :on-success="handleAddAvatarSuccess"
            :before-upload="beforeAddAvatarUpload">
            <img v-if="addMemberForm.avatarDb" :src="addMemberForm.avatarDb" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMemberFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="saveLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑员工弹窗 -->
    <el-dialog title="编辑员工" :visible.sync="editMemberFormVisible" @close="initEditDialog">
      <el-form ref="editMemberForm" :model="editMemberForm" :rules="rulesEditMember">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editMemberForm.name" class="mini-input" placeholder="请输入员工姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="editMemberForm.tel" class="mini-input" placeholder="请输入手机号码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职称" :label-width="formLabelWidth" prop="title">
          <el-input v-model="editMemberForm.title" class="mini-input" placeholder="请输入职称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工编号" :label-width="formLabelWidth" prop="customId">
          <el-input v-model="editMemberForm.customId" class="mini-input" placeholder="请输入员工编号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="avatarPath"
            :show-file-list="false"
            :on-success="handleEditAvatarSuccess"
            :before-upload="beforeEditAvatarUpload">
            <img v-if="editMemberForm.avatar" :src="editMemberForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="handleDel" :loading="saveLoading" style="float:left;">删除</el-button>
        <el-button @click="editMemberFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="saveLoading">确定</el-button>
      </div>
    </el-dialog>
<!-- 设置员工权限 -->
    <el-dialog title="设置权限" :visible.sync="editAnalyticsFormVisible">
      <el-form ref="editAnalyticsForm" label-position="top" :model="editAnalyticsForm" :rules="rulesEditAnalytics">
        <el-form-item prop="name">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div v-for="(item1, key1) in authoritiesList">
            <div style="font-weight: 600">{{key1}}相关 ：</div>
            <el-checkbox-group v-model="editAnalyticsForm.authorities">
              <el-checkbox v-for="(item2, index) in item1" :label="item2.code"   :key="index">{{item2.title}}</el-checkbox>
            </el-checkbox-group>
          </div>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAnalyticsFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editAnalyticsSubmit" :loading="saveLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--显示详情-->
    <el-dialog title="员工详情" :visible.sync="showFormVisible" :close-on-click-modal="false">
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
        员工编号:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.customId }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        职务:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.title }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        头像:
      </el-col>
      <el-col :span="18">
        <img :src="showForm.basic && showForm.basic.avatar" class="avatar"/>
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        姓名:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.name }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        手机号:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.tel }}
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
  import { getAnalyticsAll, createRole, getRoles, removeRole, editRole } from '@/utils/api';
  import { avatarPath } from '@/utils/commonConfig';
  import moment from 'moment';

  const defaultSysAvatar = require('@/assets/images/user.png');

  export default {
    name: 'page1007',
    data() {
      return {
        moment,
        defaultSysAvatar,
        avatarPath,
        filter: {
          customId: '',
          name: '',
          tel: '',
        },
        page: 1,
        size: 10,
        total: 0,
        member: [],
        listLoading: false,
        formLabelWidth: '120px',
        authoritiesList: [],
        authoritiesAll: [],

        saveLoading: false,

        // 新增员工弹窗相关数据
        addMemberFormVisible: false,
        addMemberForm: {
          name: '',
          tel: '',
          password: '123456',
          avatar: '',
          customId: '',
          title: '',
          avatarDb: '',
        },
        rulesAddMember: {
          name: [
            { required: true, message: '请输入员工姓名', trigger: 'blur' },
          ],
          tel: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入职称', trigger: 'blur' },
          ],
          customId: [
            { required: true, message: '请输入员工编号', trigger: 'blur' },
          ],
        },

        // 编辑员工窗口
        editMemberFormVisible: false,
        editMemberForm: {
          name: '',
          tel: '',
          avatar: '',
          customId: '',
          title: '',
          avatarDb: '',
          peopleId: '',
        },
        rulesEditMember: {
          name: [
            { required: true, message: '请输入员工姓名', trigger: 'blur' },
          ],
          tel: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入职称', trigger: 'blur' },
          ],
          customId: [
            { required: true, message: '请输入员工编号', trigger: 'blur' },
          ],
        },

        // 设置权限
        checkAll: false,
        isIndeterminate: true,
        editAnalyticsFormVisible: false,
        editAnalyticsForm: {
          peopleId: '',
          authorities: [],
        },
        rulesEditAnalytics: {},

        showFormVisible: false,
        showForm: {

        },
      };
    },
    methods: {
      formatDate(row) {
        return moment(row.created).format('YYYY-MM-DD HH:mm:ss');
      },
      // 弹窗初始化
      initAddDialog() {
        this.addMemberForm = {
          name: '',
          tel: '',
          password: '123456',
          avatar: '',
          customId: '',
          title: '',
          avatarDb: '',
        };
        this.$refs.addMemberForm.resetFields();
      },
      initEditDialog() {
        this.$refs.editMemberForm.resetFields();
      },
      // 头像上传
      handleAddAvatarSuccess(res, file) {
        this.addMemberForm.avatarDb = URL.createObjectURL(file.raw);
        this.addMemberForm.avatar = res.data.url;
      },
      handleEditAvatarSuccess(res, file) {
        // console.log(res, file);
        this.editMemberForm.avatarDb = URL.createObjectURL(file.raw);
        this.editMemberForm.avatar = res.data.url;
      },
      beforeAddAvatarUpload(file) {
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
      beforeEditAvatarUpload(file) {
        // console.log(this.editMemberForm);
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
      // 点击添加新员工, 唤醒弹窗
      addMember() {
        this.addMemberFormVisible = true;
        this.saveLoading = false;
      },
      addSubmit() {
        this.$refs.addMemberForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true;
            createRole(this.addMemberForm).then((res) => {
              this.saveLoading = false;
              if (res) {
                this.addMemberFormVisible = false;
                this.query();
                this.$message.success('新增员工成功！');
              }
            });
          } else {
            console.log('error submit!!');
          }
        });
      },
// 表格对应的操作
      // 权限设置
      handlePower(index, row) {
        this.editAnalyticsFormVisible = true;
        this.editAnalyticsForm.peopleId = row.peopleId;
        this.editAnalyticsForm.authorities = row.extra.authorities;
        // console.log('line :: ========= ', index, 'row msg :: ================', row);
      },
      handleCheckAllChange(val) {
        this.editAnalyticsForm.authorities = val ? this.authoritiesAll : [];
        this.isIndeterminate = false;
      },
      editAnalyticsSubmit() {
        this.saveLoading = true;
        editRole(this.editAnalyticsForm).then((res) => {
          this.saveLoading = false;
          if (res) {
            this.editAnalyticsFormVisible = false;
            this.getRolesMsg();
            this.$message.success('权限设置成功！');
          }
        });
      },
      // 编辑
      handleEdit(index, row) {
        this.editMemberFormVisible = true;
        this.editMemberForm = { ...row.basic };
        this.editMemberForm.avatarDb = row.basic.avatar;
        this.editMemberForm.peopleId = row.peopleId;
        this.saveLoading = false;
      },
      editSubmit() {
        this.$refs.editMemberForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true;
            editRole(this.editMemberForm).then((res) => {
              this.saveLoading = false;
              if (res) {
                this.editMemberFormVisible = false;
                this.getRolesMsg();
                this.$message.success('修改成功！');
              }
            });
          } else {
            console.log('error submit!!');
          }
        });
      },
      // 删除
      handleDel() {
        this.$confirm(`确认删除员工：${this.editMemberForm.name} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.saveLoading = true;
          removeRole({
            peopleId: this.editMemberForm.peopleId,
          }).then((res) => {
            this.saveLoading = false;
            if (res) {
              this.editMemberFormVisible = false;
              this.getRolesMsg();
              this.$message.success('删除员工成功!');
            }
          });
        }).catch(() => {
          this.$message.info('取消删除员工');
        });
      },
      // 显示查看界面
      handleShow(index, row) {
        this.showFormVisible = true;
        this.showForm = row;
      },
      // 分页
      handleCurrentChange(val) {
        this.page = val;
        this.getRolesMsg();
        // console.log(`当前页: ${val}`);
      },
// 数据获取
      getRolesMsg() {
        this.listLoading = true;
        getRoles({
          customId: this.filter.customId,
          name: this.filter.name,
          tel: this.filter.tel,
          page: this.page,
          size: this.size,
        }).then((res) => {
          this.listLoading = false;
          if (res) {
            this.total = res.total;
            this.member = res.list;
          }
        }).catch(() => {
          this.listLoading = false;
        });
      },
      // 获取权限列表
      getAnalyticsList() {
        getAnalyticsAll({}).then((res) => {
          if (res) {
            const catalogs = {};
            const allList = [];
            res.forEach((item) => {
              allList.push(item.code);
              if (item.catalog in catalogs) {
                catalogs[item.catalog].push(item);
              } else {
                catalogs[item.catalog] = [item];
              }
            });
            this.authoritiesAll = allList;
            this.authoritiesList = catalogs;
          }
        });
      },
      query() {
        this.page = 1;
        this.getRolesMsg();
      },
    },
    created() {
      this.getRolesMsg();
      this.getAnalyticsList();
    },
  };
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin-left: 0;
  margin-right: 30px;
}

.avatar-wrap {
  width: 50px;
  height: 50px;
  overflow: hidden;

  .avatar {
    width: 100%;
    height: 100%;
  }
}
.mini-input {
  width: 50%;
}
</style>
