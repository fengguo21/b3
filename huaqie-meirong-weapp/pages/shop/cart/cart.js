import cart from '../../../util/cart'

Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true    // 全选状态，默认全选
  },
  onShow() {
    this.setData({
      carts: cart.products,
      hasList: cart.products.length
    })
    console.log('CART++++++++', cart.products)
    this.getTotalPrice();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const pid = e.currentTarget.dataset.pid;
    const carts = this.data.carts
    carts.forEach(p => {
      if (p.productId == pid) {
        p.selected = !p.selected
      }
    })
    this.setData({
      carts: carts
    });
    cart.save(carts)
    this.getTotalPrice();
    this.querySelect();
  },
  /**
   * 查询全选状态
   */
  querySelect() {
    let arr = [];
    this.data.carts.forEach(item => {
      arr.push(item.selected);
    });
    if (arr.indexOf(false) < 0) {
      this.setData({
        selectAllStatus: true
      })
    } else {
      this.setData({
        selectAllStatus: false
      })
    }
  },
  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    const pid = e.currentTarget.dataset.pid;
    const carts = this.data.carts;
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });
    if (!carts.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
    cart.removeProduct(pid)
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    const pid = e.currentTarget.dataset.pid;
    let carts = this.data.carts;
    let num = carts[index].count;
    num = num + 1;
    carts[index].count = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    cart.addProduct({
      productId: pid,
      count: 1
    })
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const pid = e.currentTarget.dataset.pid;
    let carts = this.data.carts;
    let num = carts[index].count;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].count = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    cart.decProduct(pid, 1)
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let totalPrice = 0
    this.data.carts.forEach(e => {
      if (e.selected) {
        totalPrice += (e.basic.price * e.count)
      }
    })
    this.setData({
      totalPrice: totalPrice.toFixed(2)
    });
  }

})