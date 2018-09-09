// 可调用ajax操作，ajax集中管理处'../../utils/api'
const app = getApp();

const _maskData = {
  'mask.showModal': false,
};

const maskPannel = {
  // 阻止蒙层出现时造成底部滑动
  maskTouchMove() {
    return;
  },
  // 阻止误触白色区域关闭弹窗
  maskBoxTap() {
    return;
  },
  // 切换弹窗状态
  toggleMask() {
    // 点击时弹窗是false时执行
    // console.log(app);
    app.isLogin(() => {
      if (!this.data.mask.showModal) {
        this.createOrder();
      } else {
        this.setData({
          'mask.showModal': !this.data.mask.showModal,
        });
      }
    });
  },
  // 自己支付
  minePay() {
    // console.log('============= mine pay =============');
    this.goPay(() => {
      this.setData({
        'mask.showModal': !this.data.mask.showModal,
        'smask.showModal': !this.data.smask.showModal,
      });
    });
  },
  // 他人支付
  otherPay() {
    this.setData({
      'mask.showModal': !this.data.mask.showModal,
    });
  },
};

const MaskPannel = () => {
  const pages = getCurrentPages();
  // console.log(pages);
  const currentPage = pages[pages.length - 1];
  // 将组件方法附加到page上
  Object.assign(currentPage, maskPannel);
  // 把组件数据合并到页面的data中
  currentPage.setData(_maskData);
}

// const masks = new MaskPannel();
export default MaskPannel;


