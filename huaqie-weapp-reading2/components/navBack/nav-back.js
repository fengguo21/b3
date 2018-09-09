

const navDatas = {};

const navPannel = {
  reBack() {
    wx.switchTab({
      url: '/pages/home/home',
    });
  },
  reNavMine() {
    wx.switchTab({
      url: '/pages/mine/mine',
    });
  },
  reNavVip() {
    wx.reLaunch({
      url: '/pages/home/openVip/openVip',
    });
  },
};

const NavPannel = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  // 将组件方法附加到page上
  Object.assign(currentPage, navPannel);
  // 把组件数据合并到页面的data中
  currentPage.setData(navDatas);
};

export default NavPannel;