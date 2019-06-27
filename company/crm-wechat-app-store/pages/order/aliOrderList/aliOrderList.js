// pages/activeManager/activeManager.js
// 引用外部js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    buttons: [
      "全部", "待确认", "退款中", "已发送", "已完成"
    ],
    modalData: [
      { title: "待确认" },
      { title: "退款中" },
      { title: "已发送" },
      { title: "已完成" },
      { title: "交易成功" },
    ],
    starts:['','2','4','12','20','21'],            // 订单状态集合
    tabIndex: 0,                                // 设置横向滚动条的位置
    scrollTop: 0,                               // 标签起始值 为0 ：全部
    isForLeft: true,
    modalIndex: null,                           // 下拉框的标签属性值
    winWidth: app.globalData.windowWidth,
    winWidth: app.globalData.windowHeight,                                                                     
    isShowModal: false,                         // 默认关闭下拉框
    pageAliOrder:{                              // page对象
      page: 0,
      size: 10,
      listDatas: [],                            // 订单数据列表 ------ 传输数据
      recordsFiltered: 0,
    },
    searchParam:{                               // 搜索对象
      page: 0,
      size: 10,
      orderStatus: '',                          // 订单状态：------------传输数据
    },
    status:'',
  },
	/**
   * 按钮点击
   */
  onchangeTab: function (e) {
    var self = this;
    let index = parseInt(e.target.id.split('btn')[1]);
    let status =self.data.starts[index];
    self.setData({
      tabIndex: index,
      ['searchParam.orderStatus']:status,
    },()=>{
      self.pageAilOreder();
    });
  },

  swiperScreen: function (e) {//swiper切屏事件
    this.setData({
      tabIndex: e.detail.current
    });
    if (e.detail.current == 5) {
      if (this.data.isForLeft) {//从左边往右边滑动swiper到4这个位置，让scroll-view滑动到最大位置，使其他到tab可以看见
        let self = this;
        self.setData({
          scrollTop: this.data.winWidth,
          isForLeft: false
        });
      }
    };
    if (!this.data.isForLeft && e.detail.current == 2) {//从右边往左边滑动swiper到3这个位置，让scroll-view滑动到最大位置，使其他到tab可以看见
      let self = this;
      self.setData({
        scrollTop: 0,
        isForLeft: true
      });
    }
  },

  // 下拉框：显示/关闭
  actonModal: function () {
    let self = this;
    this.setData({
      isShowModal: !this.data.isShowModal
    })
  },

  // 下拉框点击事件
  onModelItemsSelsect: function (e) {
    
    var self = this;
    let index = parseInt(e.currentTarget.id.split('modal')[1]);
    var status =self.data.starts[index+1];
    self.setData({
      modalIndex: index,
      ['searchParam.orderStatus']: status,
      isShowModal: false,
      tabIndex : null 
    },()=>{
      self.pageAilOreder();
    });
  },
  selectItemDetail: function () {
    wx.navigateTo({
      url: '../aliOrderList/components/aliOrderItem',
    })
  },

  /** 
   * 分页加载阿里健康订单：
   * @param isLoadMore 是否加载更多
   */
  pageAilOreder: function (isLoadMore) {
    const self = this;
    util.doRequest({
      url: 'aliOrder/pageAliOrder',
      method: 'POST',
      data: self.data.searchParam,
    }, res => {
      // 转换金额小数
      for(let i = 0;i<res.data.data.length;i++){
        let obj = res.data.data[i];
        obj.orderTountDouble =  obj.totalPayDouble - obj.deliveryPayDouble;
        obj.orderTountDouble = obj.orderTountDouble===null?0.00:obj.orderTountDouble.toFixed(2);
        obj.deliveryPayDouble = obj.deliveryPayDouble ===null?0.00:obj.deliveryPayDouble.toFixed(2);
        obj.totalPayDouble = obj.totalPayDouble ===null?0.00: obj.totalPayDouble.toFixed(2);
        }
      let pageAliOrder = {
        page : res.data.page,
        size : res.data.size,
        recordsFiltered: res.data.recordsFiltered,
        listDatas: self.isLoadMore ? self.data.pageAliOrder.listDatas.concat(res.data.data) : res.data.data
      }
        self.setData({
          pageAliOrder: pageAliOrder,
        });
    });
  },
  /**
     * 上滑事件（只有在有滚动条的情况下，并且已经滑到底部的时候才能触发）
     */
  pullUpLoad: function () {
    console.log("启动");
    const self = this;
    if (self.isHaveNextPage()) {
      self.setData({
        ["searchParam.page"]: self.data.searchParam.page + 1
      }, () => self.pageAilOreder(true));
    }
  },
  /**
   * 是否还有下一页
   */
  isHaveNextPage: function () {
      const self = this;
      const pageAliOrder = self.data.pageAliOrder;
      return pageAliOrder.size * (pageAliOrder.page + 1) < pageAliOrder.recordsFiltered;
  },
  /**
    * 跳转到ali订单详情页面
      */
  jumpAliO2oOrderDetails: function (e) {
    let self = this;
    let index = e.currentTarget.id;
    let number = Math.abs(index);
    const orderObj = this.data.pageAliOrder.listDatas[number];
    util.privateNavigateTo('../aliOrderDetails/aliOrderDetails?aliO2oOrderId='+orderObj.aliO2oOrderId);
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function() {
    let self=this;
    self.pageAilOreder();
  },	
 
})