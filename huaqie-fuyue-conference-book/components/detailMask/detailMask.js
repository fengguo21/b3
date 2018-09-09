import moment from '../../utils/moment';
import { dateAdd, diffDate } from '../../utils/tool';

let count = 0;
const app = getApp();

const _dmaskData = {
  'dmask.showModal': false,
  'dmask.showMore': false,
  'dmask.selectList': [],
};

const initPrice = (checkboxItems, values, type) => {
  checkboxItems.totalPrice = values.length && values.length>0 
                             ? checkboxItems.price * values.length
                             : checkboxItems.price;
  if (type == 'special') {
    checkboxItems.totalPrice = values.length && values.length>0 
                               ? checkboxItems.price * values.length / 2
                               : checkboxItems.price / 2;
  }
  return checkboxItems;
};

const dmaskPannel = {
  // 阻止弹窗底部滑动
  dmaskTouchMove() {
    return;
  },
  // 阻止误触内容区域而关闭弹窗
  contentTap() {
    return;
  },
  selectTime(e) {
    const currentTime = e.currentTarget.dataset.time;
    const realCurrTime = moment(currentTime).format('YYYY-MM-DD');
    const checkboxItems = this.data.checkboxItems.rooms;
    const selectElemt = checkboxItems.find(item => item.value == realCurrTime);
    if (selectElemt.count <= 0 || selectElemt.disabled) {
      wx.showModal({
        title: '提示',
        content: '您选择入住的房间已定完或已过期',
        showCancel: false,
        confirmColor: '#be342a',
      })
      return;
    }
    // let selectList = this.data.dmask.selectList;
    // count++;
    // // 处理逻辑；
    // if (count % 2 === 1) {
    //   selectList = [realCurrTime];
    // } else {
    //   if (selectList[0] != realCurrTime) {
    //     selectList.push(realCurrTime);
    //   } else {
    //     count--;
    //   }
    // };
    // selectList.sort();
    // // 做差链接
    // if (selectList.length > 1) {
    //   const prevTime = selectList[0];
    //   const currTime = selectList[1];
    //   const diff = moment(currTime).valueOf() - moment(prevTime).valueOf();
    //   const dayDiff = moment.duration(diff / 1000, 'seconds')._data.days;
    //   if (dayDiff > 1) {
    //     for(let i = 0, lenI = dayDiff - 1; i < lenI; ++i) {
    //       const newTime = dateAdd(prevTime, i + 1, 'YYYY-MM-DD');
    //       const nowItem = checkboxItems.find(item => item.value == newTime);
    //       if (nowItem.count > 0 && !nowItem.disabled) {
    //         selectList.push(newTime);
    //       }
    //       // selectList.splice(i + 1, 0, newTime);
    //     }
    //   }
    // }
    // selectList.sort();
    // // 设置状态
    // for(let i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
    //   checkboxItems[i].checked = false;
    //   for (let j = 0, lenJ = selectList.length; j < lenJ; ++j) {
    //     if(checkboxItems[i].value == selectList[j]){
    //       checkboxItems[i].checked = true;
    //       break;
    //     }
    //   }
    // }
    // this.setData({
    //   selectCount: selectList.length,
    //   checkboxItems: this.data.checkboxItems,
    //   'dmask.selectList': selectList,
    // });
  },
  checkboxChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    // console.log(this.data.checkboxItems);
    let roomList = this.data.checkboxItems;
    const values = e.detail.value;
    roomList = initPrice(this.data.checkboxItems, values, this.data.selectType);
    const checkboxItems = roomList.rooms;
    for (let i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = false;
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
            if(checkboxItems[i].value == values[j]){
                checkboxItems[i].checked = true;
                break;
            }
        }
    }
    values.sort();
    // console.log(values);
    this.setData({
      selectCount: values.length,
      'dmask.selectList': values,
      checkboxItems: this.data.checkboxItems,
    });
},
  // 切换弹窗状态
  toggleDmask(e) {
    count = 0;
    const type = e.currentTarget.dataset.type;
    const detail = e.currentTarget.dataset.detail;
    // console.log(type);
    let checkboxItems = [];
    if (detail) {
      checkboxItems = detail;
      const values = this.data.dmask.selectList;
      checkboxItems = initPrice(checkboxItems, values, type);
    }
    this.setData({
      selectType: type,
      selectCount: 0,
      'dmask.selectList': [],
      checkboxItems,
      'dmask.showModal': !this.data.dmask.showModal,
    });
  },
  // 切换详情
  toggleDetailShow(e) {
    this.setData({
      'dmask.showMore': !this.data.dmask.showMore,
    });
  },
// 导航相关
  // 跳转至预约详情
  navToReserve(e) {
    const selectList = this.data.dmask.selectList;
    const rooms = this.data.checkboxItems.rooms;
    // 判断日期是否连续
    for(let i = 0, lenS = selectList.length; i < lenS; ++i) {
      if (selectList[i + 1]) {
        if (dateAdd(selectList[i], 1, 'YYYY-MM-DD') != selectList[i + 1]) {
          wx.showModal({
            title: '提示',
            content: '您选择入住的时间必须连续',
            showCancel: false,
            confirmColor: '#be342a',
          })
          return;
        }
      }
    }
    // 准备跳转
    if (this.data.selectCount && this.data.selectCount > 0) {
      app.isLogin(() => {
        const room = JSON.stringify(this.data.checkboxItems);
        const conferenceId = this.data.conferenceId;
        const roomId = e.currentTarget.dataset.id;
        const dates = JSON.stringify(this.data.dmask.selectList);
        const type = this.data.selectType;
        wx.navigateTo({
          url: `/pages/reserve/reserve?conferenceId=${conferenceId}&roomId=${roomId}&dates=${dates}&room=${room}&type=${type}`,
        });
        this.setData({
          'dmask.showModal': !this.data.dmask.showModal,
        });
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "没有选择预约日期不能预约",
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#be342a",
      });
    }
  },
};

const DmaskPannel = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  // 将组件的方法合并到当前页面
  Object.assign(currentPage, dmaskPannel);
  // 将data设置到主分支
  currentPage.setData(_dmaskData);
};

export default DmaskPannel;
