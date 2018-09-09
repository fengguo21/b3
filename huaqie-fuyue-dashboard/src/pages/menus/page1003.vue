<template>
  <div class="page1003">
    <div class="top-picker">
      <span class="page-title mg-r-50">{{$route.meta.name}}</span>
      <el-input clearable class="mg-r-15" placeholder="会议号" v-model="filters.conferenceNo"></el-input>
      <el-input clearable class="mg-r-15" placeholder="会议标题" v-model="filters.title"></el-input>
      <el-date-picker
        v-model="filters.startDate"
        type="date"
        class="mg-r-15"
        value-format="yyyy-MM-dd"
        placeholder="开始日期">
      </el-date-picker>
      <el-date-picker
        v-model="filters.endDate"
        type="date"
        class="mg-r-15"
        value-format="yyyy-MM-dd"
        placeholder="结束日期">
      </el-date-picker>
      <el-button class="mg-r-15" type="" @click="query">查询会议</el-button>
      <el-button type="primary" @click="handleAdd">新增会议</el-button>
    </div>
    <div class="main-picker">
    <el-table stripe :data="rooms" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column label="封面" width="168">
        <template slot-scope="scope">
          <img :src="scope.row.basic.images && scope.row.basic.images.length && scope.row.basic.images[0].url" class="avatar"/>
        </template>
      </el-table-column>
      <el-table-column label="小程序码" width="90">
        <template slot-scope="scope">
          <img :src="scope.row.basic && scope.row.basic.weappQrcode" class="avatar qrcode" @click="handleQrCodePreview(scope.$index, scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column prop="basic.conferenceNo" label="会议号" width="150">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="200">
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期" width="120">
      </el-table-column>
      <el-table-column prop="endDate" label="结束日期" width="120">
      </el-table-column>

      <el-table-column prop="extra.grouponId" label="团餐" width="60" :formatter="formatGroupon">
      </el-table-column>

      <el-table-column prop="people.name" label="创建人" width="120">
      </el-table-column>
      
      <el-table-column prop="created" label="创建时间" min-width="180" :formatter="formatDate">
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="small" @click="handleShow(scope.$index, scope.row)">详情</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleEditRoom(scope.$index, scope.row)">客房</el-button>
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
    <el-dialog title="新增会议" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="addForm.startDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="addForm.endDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封面轮播">
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
        <el-form-item label="会议地点" prop="place">
          <el-input v-model="addForm.place" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议地址" prop="address">
          <el-input v-model="addForm.address" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经理姓名" prop="contactName">
          <el-input v-model="addForm.contactName" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经理电话" prop="contactTel">
          <el-input v-model="addForm.contactTel" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动方" prop="sponsor">
          <el-input v-model="addForm.sponsor" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="text">
          <el-input type="textarea" class="fixed-input" v-model="addForm.text" :rows="4" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="编辑会议" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="editForm.startDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="editForm.endDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封面轮播">
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
        <el-form-item label="会议地点" prop="place">
          <el-input v-model="editForm.place" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议地址" prop="address">
          <el-input v-model="editForm.address" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经理姓名" prop="contactName">
          <el-input v-model="editForm.contactName" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经理电话" prop="contactTel">
          <el-input v-model="editForm.contactTel" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动方" prop="sponsor">
          <el-input v-model="editForm.sponsor" class="fixed-input" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="text">
          <el-input type="textarea" class="fixed-input" :rows="4" v-model="editForm.text" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click.native="handleDel" :loading="editLoading" style="float:left;">删除</el-button>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--编辑客房界面-->
    <el-dialog title="编辑会议客房" :visible.sync="editRoomFormVisible" :close-on-click-modal="false">
      <el-form :model="editRoomForm" label-width="120px" :rules="editRoomFormRules" ref="editRoomForm">
        <el-form-item label="会议标题" prop="title">
          {{ editRoomForm.title }}
        </el-form-item>
        <el-form-item label="会议客房列表">
        <el-row>
        <el-col :span="7">
        客房
        </el-col>
        <el-col :span="6">
        价格
        </el-col>
        <el-col :span="6">
        数量
        </el-col>
        <el-col :span="5">
        操作
        </el-col>
        </el-row>

        <el-row v-for="(room, index) in conferenceRooms" :key="index">
          <el-col :span="7" class="room-row">
            <el-select v-model="room.roomId" @change="onChangeRoom" placeholder="请选择客房">
              <el-option
                v-for="item in roomOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input-number v-model="room.price" :min="0.01" :max="1000" label=""></el-input-number>
          </el-col>
          <el-col :span="6">
            <el-input-number v-model="room.maxCount" :min="1" :max="10000" label=""></el-input-number>
          </el-col>
          <el-col :span="5">
            <i class="el-icon-circle-plus-outline" @click="addConferenceRoom(index)"></i><i class="el-icon-remove-outline" @click="removeConferenceRoom(index)" v-if="conferenceRooms.length > 1"></i>
          </el-col>
        </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editRoomFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editRoomSubmit" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--显示详情-->
    <el-dialog title="会议详情" :visible.sync="showFormVisible" :close-on-click-modal="false">
    <el-tabs v-model="showFormActiveName" @tab-click="onGrouponOrdersClick" class="fixed">
    <el-tab-pane label="基本信息" name="page1">
      <el-row>
      <el-col :span="6">
        会议轮播:
      </el-col>
      <el-col :span="9">
        <el-carousel height="150px">
          <el-carousel-item v-for="item in showForm.basic && showForm.basic.images" :key="item.url">
            <img :src="item.url" style="width:100%; height: 100%;"/>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        会议号:
      </el-col>
      <el-col :span="18">
        <h1 class="conference-no">{{ showForm.basic && showForm.basic.conferenceNo }}</h1>
      </el-col>
      </el-row>
      
      <el-row>
      <el-col :span="6">
        地点:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.place }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        地址:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.address }}
      </el-col>
      </el-row>
     <el-row>
      <el-col :span="6">
        经理联系方式:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.contactName }} {{ showForm.basic && showForm.basic.contactTel }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        活动方:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.sponsor }}
      </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        简介:
      </el-col>
      <el-col :span="18">
        {{ showForm.basic && showForm.basic.text }}
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          创建时间:
        </el-col>
        <el-col :span="18">
          {{ formatDate(showForm) }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          修改时间:
        </el-col>
        <el-col :span="18">
          {{ formatUpdateDate(showForm) }}
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="客房状态" name="page2">
        <el-row v-for="room in showForm.rooms" :key="room.roomId">
          <el-col :span="5">
          <el-row class="row-class left-fixed">客房</el-row>
          <el-row class="left-fixed">{{ room.basic.title }}</el-row>
          </el-col>
          <el-col :span="19">
            <el-row class="row-class">
            <el-col :span="4">
            日期
            </el-col>
            <el-col :span="4">
            数量
            </el-col>
            <el-col :span="4">
            剩余
            </el-col>
            <el-col :span="4">
            普通已售
            </el-col>
            <el-col :span="4">
            拼房已售
            </el-col>
            <el-col :span="4">
            详情
            </el-col>
            </el-row>
            <el-row v-for="item in formatSoldCount(showForm.startDate, showForm.endDate, room.maxCount, room.soldCount)" :key="item.date" style="margin-bottom: 10px;">
            <el-col :span="4">
            {{item.date}}
            </el-col>
            <el-col :span="4">
            {{room.maxCount}}
            </el-col>
            <el-col :span="4">
            {{item.value}}
            </el-col>
            <el-col :span="4">
            {{item.value2}}
            </el-col>
            <el-col :span="4">
            {{item.value3}}
            </el-col>
            <el-col :span="4">
            <el-button size="small" type="primary" plain @click="showRoomDetail(room.basic.title, item.date, room.soldCount[item.date])">查看详情</el-button>
            </el-col>
            </el-row>
          </el-col>
        </el-row>
    </el-tab-pane>
    <el-tab-pane label="客房预订列表" name="page3">
    <el-row>
    <el-col :span="24" class="groupon-orders-row">
      <el-input v-model="roomOrdersFilters.name" placeholder="姓名" clearable></el-input>
      <el-input v-model="roomOrdersFilters.tel" placeholder="手机号" clearable></el-input>
      <el-date-picker
        v-model="roomOrdersFilters.date"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="预订日期">
      </el-date-picker>
      <el-button type="primary" plain @click="queryRoomOrders">查询</el-button>
    </el-col>
    </el-row>
    <el-table
      :data="roomOrders"
      v-loading="listLoadingRoomOrders"
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
        prop="basic.sex"
        label="性别"
        :formatter="formatSex"
        width="80">
      </el-table-column>
      <el-table-column
        prop="basic.tel"
        label="手机号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="basic.special"
        :formatter="formatSpecial"
        width="100"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="room.title"
        width="120"
        label="客房">
      </el-table-column>
      <el-table-column
        prop="basic.dates"
        :formatter="formatDates"
        label="日期">
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination :current-page="page" layout="total, prev, pager, next" @current-change="handleCurrentChangeRoomOrders" :page-size="roomOrdersSize" :total="roomOrdersTotal" style="float:right;">
      </el-pagination>
    </el-col>
    </el-tab-pane>
  </el-tabs>
    

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="showFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--显示图片-->
    <el-dialog :visible.sync="dialogVisible">
      <img :width="dialogImageWidth" :src="dialogImageUrl" alt="" style="margin:0 auto;">
      <p style="text-align:center;">{{ dialogText }}</p>
    </el-dialog>
    <!--显示订房详情-->
    <el-dialog
      title="房态详情"
      :visible.sync="roomDialogVisible"
      width="30%">
      <p>客房：{{ roomDialogTitle }}</p>
       <p>日期：{{ roomDialogDate }}</p>
      <el-row>
      <el-col :span="12">
      名称
      </el-col>
      <el-col :span="12">
      数量
      </el-col>
      </el-row>
      <el-row v-for="item in roomDialogData" :key="item.title">
      <el-col :span="12">
      {{ item.title }}
      </el-col>
      <el-col :span="12">
      {{ item.value }}
      </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roomDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getConference, getConferences, addConference, editConference, removeConference, getAllRooms, getOrders } from '@/utils/api';
  import { avatarPath } from '@/utils/commonConfig';
  import moment from 'moment';

  export default {
    name: 'page1003',
    data() {
      return {
        filters: {
          conferenceNo: '',
          title: '',
          startDate: '',
          endDate: '',
        },
        roomOrdersFilters: {
          name: '',
          tel: '',
          date: '',
        },
        grouponOrdersFilters: {
          name: '',
          tel: '',
          date: '',
        },

        dialogImageUrl: '',
        dialogVisible: false,
        dialogImageWidth: '100%',
        dialogText: '',

        showFormActiveName: 'page1',

        imageList: [],

        roomOptions: [],
        avatarPath,
        rooms: [],
        page: 1,
        size: 10,
        total: 0,

        imageUrl: '',

        listLoading: false,

        addFormVisible: false,
        addLoading: false,
        addForm: {
          title: '',
          startDate: '',
          endDate: '',
          avatar: '',
          place: '',
          address: '',
          contactName: '',
          contactTel: '',
          sponsor: '',
        },
        addFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
          startDate: [
            { required: true, message: '请选择开始日期', trigger: 'blur' },
          ],
          endDate: [
            { required: true, message: '请输入结束日期', trigger: 'blur' },
          ],
        },

        editFormVisible: false,
        editLoading: false,
        editForm: {
          conferenceId: '',
          title: '',
          startDate: '',
          endDate: '',
          avatar: '',
          place: '',
          address: '',
          contactName: '',
          contactTel: '',
          sponsor: '',
        },
        editFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
          startDate: [
            { required: true, message: '请选择开始日期', trigger: 'blur' },
          ],
          endDate: [
            { required: true, message: '请输入结束日期', trigger: 'blur' },
          ],
        },

        conferenceRooms: [{ roomId: '', maxCount: 1, price: 1 }],
        editRoomFormVisible: false,
        editRoomForm: {
          conferenceId: '',
          title: '',
        },
        editRoomFormRules: {
          title: [
            { required: true, message: '请选择会议', trigger: 'blur' },
          ],
        },

        showFormVisible: false,
        showForm: {
          rooms: [],
        },

        roomOrders: [],
        roomOrdersTotal: 0,
        roomOrdersPage: 1,
        roomOrdersSize: 10,
        listLoadingRoomOrders: false,

        grouponOrders: [],
        grouponOrdersTotal: 0,
        grouponOrdersPage: 1,
        grouponOrdersSize: 10,
        listLoadingGrouponOrders: false,

        roomDialogVisible: false,
        roomDialogData: [],
        roomDialogDate: '',
        roomDialogTitle: '',
      };
    },
    methods: {
      formatDate(row) {
        return moment(row.created).format('YYYY-MM-DD HH:mm:ss');
      },
      formatUpdateDate(row) {
        return moment(row.updated).format('YYYY-MM-DD HH:mm:ss');
      },
      formatDates(row) {
        return row.basic.dates.join(', ');
      },
      formatSpecial(row) {
        return (row.basic.special) ? '拼房' : '普通';
      },
      formatSex(row) {
        return (row.basic.sex === 'M') ? '男' : '女';
      },
      formatGroupon(row) {
        return (row.extra.grouponId) ? '有' : '无';
      },
      formatTypehood(row) {
        const typehoods = {
          NORMAL: '普通',
          SPECIAL: '可拼',
        };
        return (row.typehood in typehoods) ? typehoods[row.typehood] : '未知';
      },
      formatSoldCount(startDate, endDate, maxCount, soldCount) {
        const dates = {};
        let currentDate = startDate;
        while (currentDate <= endDate) {
          dates[currentDate] = {
            value: maxCount,
            value2: 0,
            value3: 0,
          };
          currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
        }
        Object.keys(soldCount).forEach((e) => {
          dates[e] = {
            value: maxCount - Object.values(soldCount[e]).reduce((a, b) => a + b, 0),
            value2: (soldCount[e].aA || 0) + (soldCount[e].bA || 0),
            value3: (soldCount[e].aAC || 0) + (soldCount[e].aAaB || 0) + (soldCount[e].aAaA || 0) + (soldCount[e].bAC || 0) + (soldCount[e].bAbB || 0) + (soldCount[e].bAbA || 0),
          };
        });

        return Object.keys(dates).map((e) => ({ date: e, ...dates[e] }));
      },
      onChangeRoom(item) {
        this.roomOptions.forEach((e) => {
          if (e.value === item) {
            e.disabled = true;
          }
        });
      },
      onGrouponOrdersClick() {
        switch (this.showFormActiveName) {
          case 'page3':
            this.getRoomOrders();
            break;
          case 'page4':
            this.getGrouponOrders();
            break;
          default:
            break;
        }
      },
      addConferenceRoom(index) {
        this.conferenceRooms.splice(index + 1, 0, {
          roomId: '',
          price: 1,
          maxCount: 1,
        });
      },
      removeConferenceRoom(index) {
        this.conferenceRooms.splice(index, 1);
      },
      showRoomDetail(title, date, data) {
        this.roomDialogTitle = title;
        this.roomDialogDate = date;
        const datas = Object.assign({
          aA: 0,
          aB: 0,
          aAC: 0,
          aBC: 0,
          aAaA: 0,
          aAaB: 0,
          aBaB: 0,
          bA: 0,
          bB: 0,
          bAC: 0,
          bBC: 0,
          bAbA: 0,
          bAbB: 0,
          bBbB: 0,
        }, data);

        const titles = [];
        Object.keys(datas).forEach((e) => {
          switch (e) {
            case 'aA':
              titles.push({
                title: '普-男已售',
                value: datas[e],
              });
              break;
            case 'aB':
              titles.push({
                title: '普-男售中',
                value: datas[e],
              });
              break;
            case 'aAC':
              titles.push({
                title: '拼-男已售-空',
                value: datas[e],
              });
              break;
            case 'aBC':
              titles.push({
                title: '拼-男售中-空',
                value: datas[e],
              });
              break;
            case 'aAaA':
              titles.push({
                title: '拼-男已售-男已售',
                value: datas[e],
              });
              break;
            case 'aAaB':
              titles.push({
                title: '拼-男已售-男售中',
                value: datas[e],
              });
              break;
            case 'aBaB':
              titles.push({
                title: '拼-男售中-男售中',
                value: datas[e],
              });
              break;
            case 'bA':
              titles.push({
                title: '普-女已售',
                value: datas[e],
              });
              break;
            case 'bB':
              titles.push({
                title: '普-女售中',
                value: datas[e],
              });
              break;
            case 'bAC':
              titles.push({
                title: '拼-女已售-空',
                value: datas[e],
              });
              break;
            case 'bBC':
              titles.push({
                title: '拼-女售中-空',
                value: datas[e],
              });
              break;
            case 'bAbA':
              titles.push({
                title: '拼-女已售-女已售',
                value: datas[e],
              });
              break;
            case 'bAbB':
              titles.push({
                title: '拼-女已售-女售中',
                value: datas[e],
              });
              break;
            case 'bBbB':
              titles.push({
                title: '拼-女售中-女售中',
                value: datas[e],
              });
              break;
            default:
              break;
          }
        });
        this.roomDialogData = titles;
        this.roomDialogVisible = true;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getConferences();
      },
      handleCurrentChangeRoomOrders(val) {
        this.roomOrdersPage = val;
        this.getRoomOrders();
      },
      handleCurrentChangeGrouponOrders(val) {
        this.grouponOrdersPage = val;
        this.getGrouponOrders();
      },
      handleRemove(file, fileList) {
        this.imageList = fileList.map((e) => ({
          name: e.name,
          url: e.url,
        }));
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogText = '';
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
      getConferences() {
        this.listLoading = true;
        getConferences({
          conferenceNo: this.filters.conferenceNo,
          title: this.filters.title,
          startDate: this.filters.startDate,
          endDate: this.filters.endDate,
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
          startDate: '',
          endDate: '',
        };
        this.imageList = [];
        this.addLoading = false;
      },
      // 显示编辑界面
      handleEdit(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row.basic, {
          title: row.title,
          conferenceId: row.conferenceId,
          startDate: row.startDate,
          endDate: row.endDate,
        });
        this.imageList = row.basic.images;
        this.editLoading = false;
      },
      // 显示编辑客房界面
      handleEditRoom(index, row) {
        this.editRoomFormVisible = true;
        this.editRoomForm = Object.assign({}, {
          title: row.title,
          conferenceId: row.conferenceId,
        });
        getAllRooms({}).then((data) => {
          if (!data) {
            return;
          }
          this.roomOptions = [];
          data.forEach((e) => {
            let disabled = false;
            Object.keys(row.rooms).forEach((r) => {
              if (r === e.roomId) {
                disabled = true;
              }
            });
            this.roomOptions.push({
              label: e.title,
              value: e.roomId,
              disabled,
            });
          });
        });
        this.conferenceRooms = (Object.keys(row.rooms).length) ? Object.values(row.rooms) : [{ roomId: '', price: 0.01, maxCount: 1 }];
      },
      getRoomOrders() {
        this.listLoadingRoomOrders = true;
        getOrders({
          conferenceId: this.showForm.conferenceId,
          name: this.roomOrdersFilters.name,
          tel: this.roomOrdersFilters.tel,
          date: this.roomOrdersFilters.date,
          typehood: 1,
          steps: '2,4',
          page: this.roomOrdersPage,
          size: this.roomOrdersSize,
        }).then((data) => {
          this.listLoadingRoomOrders = false;
          if (!data) {
            return;
          }
          this.roomOrders = data.list;
          this.roomOrdersTotal = data.total;
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
      // 显示查看界面
      handleShow(index, row) {
        this.roomOrders = [];
        this.roomOrdersTotal = 0;
        this.grouponOrders = [];
        this.grouponOrdersTotal = 0;
        this.showFormVisible = true;
        this.showForm = {};
        getConference({
          conferenceId: row.conferenceId,
        }).then((data) => {
          if (!data) {
            return;
          }
          this.showForm = Object.assign({}, data);
        });
      },
      // 显示小程序码
      handleQrCodePreview(index, row) {
        this.dialogImageUrl = row.basic.weappQrcode;
        this.dialogText = row.title;
        this.dialogImageWidth = '40%';
        this.dialogVisible = true;
      },
      // 新增会议
      addSubmit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              const para = Object.assign({}, this.addForm);

              para.startDate = moment(para.startDate).format('YYYY-MM-DD');
              para.endDate = moment(para.endDate).format('YYYY-MM-DD');
              para.images = this.imageList;

              addConference(para).then((data) => {
                this.addLoading = false;
                if (!data) {
                  return;
                }
                this.$message.success('新增会议成功');
                this.addFormVisible = false;
                this.query();
              });
            });
          }
        });
      },
      // 修改会议
      editSubmit() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              const para = Object.assign({}, this.editForm);
              para.avatar = this.imageUrl;
              para.startDate = moment(para.startDate).format('YYYY-MM-DD');
              para.endDate = moment(para.endDate).format('YYYY-MM-DD');
              para.images = this.imageList;

              editConference(para).then((data) => {
                this.editLoading = false;
                if (!data) {
                  return;
                }
                this.$message.success('修改会议成功');
                this.editFormVisible = false;
                this.getConferences();
              });
            });
          }
        });
      },
      // 删除会议
      handleDel() {
        this.$confirm(`确认删除会议：${this.editForm.title} 吗?`, '提示', {
          type: 'warning',
        }).then(() => {
          this.editLoading = true;
          removeConference({
            conferenceId: this.editForm.conferenceId,
          }).then((data) => {
            this.editLoading = false;
            if (!data) {
              return;
            }
            this.editFormVisible = false;
            this.getConferences();
            this.$message.success('删除会议成功');
          });
        }).catch(() => {
          this.$message.info('取消删除会议');
        });
      },
      // 修改会议客房
      editRoomSubmit() {
        let validRooms = true;
        this.conferenceRooms.forEach((e) => {
          if (e.roomId === '') {
            validRooms = false;
          }
        });
        if (!validRooms) {
          this.$message.warning('客房不能为空');
          return;
        }
        this.$refs.editRoomForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              const para = Object.assign({}, {
                conferenceId: this.editRoomForm.conferenceId,
                rooms: {},
              });

              this.conferenceRooms.forEach(r => {
                para.rooms[r.roomId] = r;
              });

              editConference(para).then((data) => {
                this.editLoading = false;
                if (!data) {
                  return;
                }
                this.$message.success('修改会议客房成功');
                this.editRoomFormVisible = false;
                this.getConferences();
              });
            });
          }
        });
      },
      // 搜索
      query() {
        this.page = 1;
        this.getConferences();
      },
      // 搜索订房参加人员
      queryRoomOrders() {
        this.roomOrdersPage = 1;
        this.getRoomOrders();
      },
      // 搜索团餐参加人员
      queryGrouponOrders() {
        this.grouponOrdersPage = 1;
        this.getGrouponOrders();
      },
    },
    mounted() {
      this.getConferences();
    },
  };
</script>

<style lang="scss" scoped>
.mini-input {
  width: 200px;
}

.room-row {
  margin-bottom: 15px;
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

.avatar, .avatar-uploader-icon {
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
.avatar.qrcode {
  width: 64px;
  cursor: pointer;
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
.fixed-input {
  width: 50%;
}
.conference-no {
  font-size: 19px;
}
.row-class {
  background: #e8e8e8; 
}
.left-fixed {
  padding-left: 10px;
}
</style>
