const _smaskData = {
  'smask.showModal': false,
};

const smaskPannel = {
  // 阻止蒙层出现时造成底部滑动
  smaskTouchMove() {
    return;
  },
  // 切换弹窗状态
  toggleSmask() {
    this.setData({
      'smask.showModal': !this.data.smask.showModal,
    });
  },
// 导航相关
  navToOrder() {
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },
  // 前往开票页面
  navToInvoice(e) {
    const type = e.currentTarget.dataset.type;
    return;
    if (type == 1) {
      // console.log(this.data.orderId);
      wx.navigateTo({
        url: `/pages/invoice/invoice?orderId=${this.data.orderId}`,
      });
    }
  },
};

const SmaskPannel = () => {
  const pages = getCurrentPages();
  // console.log(pages);
  const currentPage = pages[pages.length - 1];
  // 将组件方法附加到page上
  Object.assign(currentPage, smaskPannel);
  // 把组件数据合并到页面的data中
  currentPage.setData(_smaskData);
}

export default SmaskPannel;