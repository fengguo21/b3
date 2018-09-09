<template>
  <div class="page1002">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
      <el-input clearable class="mg-r-15" placeholder="客房名称" v-model="filters.title"></el-input>
      <el-select clearable class="mg-r-15" v-model="filters.typehood" placeholder="客房类型">
        <el-option
          v-for="item in typehoodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="mg-r-15" type="" @click="query">查询客房</el-button>
      <el-button type="primary" @click="handleAdd">新增客房</el-button>
    </div>
    <div class="main-picker">
    <el-table :data="rooms" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column label="封面" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" class="avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="200">
      </el-table-column>
      <el-table-column prop="typehood" label="类型" width="120" :formatter="formatTypehood">
      </el-table-column>
      <el-table-column label="标签" min-width="200">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.basic.tags" :key="tag" v-if="tag" style="margin-right:10px;">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="people.name" label="创建人" width="120">
      </el-table-column>
      <el-table-column prop="created" label="创建时间" width="180" :formatter="formatDate">
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
    <el-dialog title="新增客房" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="addForm.typehood">
            <el-radio class="radio" :label="'NORMAL'">普通</el-radio>
            <el-radio class="radio" :label="'SPECIAL'">可拼</el-radio>
          </el-radio-group>
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
        <el-form-item label="详情轮播">
          <el-upload
            :action="avatarPath"
            list-type="picture-card"
            :file-list="imageList"
            :on-preview="handlePictureCardPreview"
            :on-success="handleImageSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="tags[index]" v-for="(tag, index) in tags" :key="index" placeholder="选填" class="small-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
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

        <el-row v-for="(room, index) in roomDescs" :key="index" class="room-row">
          <el-col :span="6" class="room-row-fixed">
        <el-input v-model="room.title" label=""></el-input>
        </el-col>
        <el-col :span="12">
            <el-input v-model="room.text" label=""></el-input>
            </el-col>
            <el-col :span="6">
            <i class="el-icon-circle-plus-outline" @click="addRoomDesc(index)"></i><i class="el-icon-remove-outline" @click="removeRoomDesc(index)" v-if="roomDescs.length > 1"></i>
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
    <el-dialog title="编辑客房" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="editForm.typehood">
            <el-radio class="radio" :label="'NORMAL'">普通</el-radio>
            <el-radio class="radio" :label="'SPECIAL'">可拼</el-radio>
          </el-radio-group>
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
        <el-form-item label="详情轮播">
          <el-upload
            :action="avatarPath"
            list-type="picture-card"
            :file-list="imageList"
            :on-preview="handlePictureCardPreview"
            :on-success="handleImageSuccess"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="tags[index]" v-for="(tag, index) in tags" :key="index" placeholder="选填" class="small-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
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

        <el-row v-for="(room, index) in roomDescs" :key="index" class="room-row">
          <el-col :span="6" class="room-row-fixed">
        <el-input v-model="room.title" label=""></el-input>
        </el-col>
        <el-col :span="12">
            <el-input v-model="room.text" label=""></el-input>
            </el-col>
            <el-col :span="6">
            <i class="el-icon-circle-plus-outline" @click="addRoomDesc(index)"></i><i class="el-icon-remove-outline" @click="removeRoomDesc(index)" v-if="roomDescs.length > 1"></i>
            </el-col>
        </el-row>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
      <el-button type="danger" plain @click.native="handleDel" :loading="editLoading" style="float:left;">删除</el-button>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--显示详情-->
    <el-dialog title="客房详情" :visible.sync="showFormVisible" :close-on-click-modal="false">
      <el-row>
        <el-col :span="4">
          客房封面:
        </el-col>
        <el-col :span="20">
          <img style="width: 128px; height: 128px;" :src="showForm.avatar" /> 
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          客房名称:
        </el-col>
        <el-col :span="20">
          {{ showForm.title }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          客房轮播图:
        </el-col>
        <el-col :span="10" v-if="showForm.basic&&showForm.basic.images&&showForm.basic.images.length>0">
          <el-carousel :autoplay="false" height="160px">
            <el-carousel-item v-for="(item, index) in showForm.basic.images" :key="index">
              <img style="width: 100%; height: 100%;" :src="item.url" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="10" v-else>
          没有设置轮播图
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          客房类型:
        </el-col>
        <el-col :span="20">
          {{ showForm.typehood == 'NORMAL' ? '普通客房' : '可拼客房' }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          客房标签:
        </el-col>
        <el-col :span="20" v-if="showForm.basic&&showForm.basic.tags&&showForm.basic.tags.length>0">
          <el-tag style="margin-right: 10px;" v-for="(item, index) in showForm.basic.tags" :key="index">{{item}}</el-tag>
        </el-col>
        <el-col :span="20" v-else>
          没有设置标签
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          创建时间:
        </el-col>
        <el-col :span="20">
          {{ formatDate(showForm) }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          修改时间:
        </el-col>
        <el-col :span="20">
          {{ formatUpdateDate(showForm) }}
        </el-col>
      </el-row>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="showFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--显示图片-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { getRoom, getRooms, addRoom, editRoom, removeRoom } from '@/utils/api';
  import { avatarPath } from '@/utils/commonConfig';
  import moment from 'moment';

  export default {
    name: 'page1002',
    data() {
      return {
        filters: {
          title: '',
        },

        typehoodOptions: [{
          label: '普通',
          value: 'NORMAL',
        }, {
          label: '可拼',
          value: 'SPECIAL',
        }],

        tags: ['', '', '', ''],

        dialogImageUrl: '',
        dialogVisible: false,

        avatarPath,
        rooms: [],
        page: 1,
        size: 10,
        total: 0,

        roomDescs: [{ title: '', text: '' }],

        imageUrl: '',
        imageList: [],

        listLoading: false,

        addFormVisible: false,
        addLoading: false,
        addForm: {
          title: '',
          typehood: 'NORMAL',
          avatar: '',
        },
        addFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
        },

        editFormVisible: false,
        editLoading: false,
        editForm: {
          roomId: '',
          title: '',
          typehood: 'NORMAL',
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
      };
    },
    methods: {
      formatDate(row) {
        return moment(row.created).format('YYYY-MM-DD HH:mm:ss');
      },
      formatUpdateDate(row) {
        return moment(row.updated).format('YYYY-MM-DD HH:mm:ss');
      },
      formatTypehood(row) {
        const typehoods = {
          NORMAL: '普通',
          SPECIAL: '可拼',
        };
        return (row.typehood in typehoods) ? typehoods[row.typehood] : '未知';
      },
      addRoomDesc(index) {
        this.roomDescs.splice(index + 1, 0, {
          title: '',
          text: '',
        });
      },
      removeRoomDesc(index) {
        this.roomDescs.splice(index, 1);
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getRooms();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.imageList = fileList.map((e) => ({
          name: e.name,
          url: e.url,
        }));
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleImageSuccess(res, file) {
        if (res.code) {
          this.$message.error(res.message);
          return;
        }
        this.imageList.push({
          name: file.name,
          url: res.data.url,
        });
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
      getRooms() {
        this.listLoading = true;
        getRooms({
          title: this.filters.title,
          typehood: this.filters.typehood,
          page: this.page,
          size: this.size,
        }).then((data) => {
          this.listLoading = false;
          this.total = data.total;
          this.rooms = data.list;
        });
      },
      handleAdd() {
        this.addFormVisible = true;
        this.addForm = {
          title: '',
          avatar: '',
          typehood: 'NORMAL',
        };
        this.imageUrl = '';
        this.imageList = [];
        this.roomDescs = [{ title: '', text: '' }];
        this.tags = ['', '', '', ''];
        this.addLoading = false;
      },
      // 显示编辑界面
      handleEdit(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.imageUrl = row.avatar;
        this.imageList = row.basic.images;
        this.roomDescs = (row.basic.desc.length > 0) ? row.basic.desc : [{ title: '', text: '' }];
        this.tags = (row.basic.tags && row.basic.tags.length > 0) ? row.basic.tags : ['', '', '', ''];
        this.editLoading = false;
      },
      // 显示查看界面
      handleShow(index, row) {
        this.showFormVisible = true;
        this.showForm = {};
        getRoom({
          roomId: row.roomId,
        }).then((data) => {
          if (!data) {
            return;
          }
          this.showForm = data;
          // console.log(data);
        });
      },
      // 新增客房
      addSubmit() {
        let descValid = true;
        this.roomDescs.forEach(r => {
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
              para.images = this.imageList;
              para.desc = this.roomDescs;
              para.tags = this.tags;

              addRoom(para).then((data) => {
                this.addLoading = false;
                if (!data) {
                  return;
                }
                this.$message.success('新增客房成功');
                this.addFormVisible = false;
                this.query();
              });
            });
          }
        });
      },
      // 修改客房
      editSubmit() {
        let descValid = true;
        this.roomDescs.forEach(r => {
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
              para.images = this.imageList;
              para.desc = this.roomDescs;
              para.tags = this.tags;

              editRoom(para).then((data) => {
                this.editLoading = false;
                if (!data) {
                  return;
                }
                this.$message.success('修改客房成功');
                this.editFormVisible = false;
                this.getRooms();
              });
            });
          }
        });
      },
      // 删除客房
      handleDel() {
        this.$confirm(`确认删除客房：${this.editForm.title} 吗?`, '提示', {
          type: 'warning',
        }).then(() => {
          this.editLoading = true;
          removeRoom({
            roomId: this.editForm.roomId,
          }).then((data) => {
            this.editLoading = false;
            if (!data) {
              return;
            }
            this.editFormVisible = false;
            this.getRooms();
            this.$message.success('删除客房成功');
          });
        }).catch(() => {
          this.$message.info('取消删除客房');
        });
      },
      // 搜索
      query() {
        this.page = 1;
        this.getRooms();
      },
    },
    mounted() {
      this.getRooms();
    },
  };
</script>

<style lang="scss" scoped>
.avatar, .avatar-uploader-icon{
  width: 64px;
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

.room-row {
  margin-bottom: 15px;
}
.room-row-fixed {
  padding-right: 15px;
}
.small-input {
  width: 20%;
  margin-right: 10px;
}
</style>
