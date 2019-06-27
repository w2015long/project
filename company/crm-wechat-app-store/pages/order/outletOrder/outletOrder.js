const util = require('../../../utils/util.js');
const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    date: '',
    pageOrder: {    //活动列表分页
      page: 0,
      size: 3,
      content: [],
      recordsFiltered: 0,
    },
    isLastReqFin: true,                 //上次请求是否结束
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    const self = this;
    self.formatDay(self,options.date);
    self.loadPageActivity(self.data.pageOrder);
    this.setData({
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth
    });

  },
  /**
   * 日期格式化，设置默认值
   */
  formatDay: function (self,str) {
    if (str === "today") {
      self.setData({
        date: self.getDateStr(new Date(), 0)
      })
    } else {
      self.setData({
        date: self.getDateStr(new Date(), -1)
      })
    }
  },
  /**
   * 格式化日期 （格式：yyyy-mm-dd）
   */
  getDateStr: function(today, addDayCount) {
    var dd;
    if (today) {
      dd = new Date(today);
    } else {
      dd = new Date();
    }
    dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    };
    return y + "-" + m + "-" + d;
  },
  /**
   * 选择日期后重新加载数据
   */
  bindDateChange: function (e) {
    let self = this;
    this.setData({
      date: e.detail.value,
      pageOrder: {
        page: 0,
        size: 3,
        recordsFiltered: 0,
        createOrderTime: self.data.date,
        content: []
      },
    })
    self.data.pageOrder.date = self.data.date;
    self.loadPageActivity(self.data.pageOrder);
  }, 
   /**
    * 加载更多方法
    */
  loadPageActivity: function (pageActivity, isLoadMore) {
    const self = this;
    self.setData({
      isLastReqFin: false
    }, () => {
    util.doRequest({
      url: "order/pageOutletOrder",
      method: "GET",
      data: {
        page: pageActivity.page,
        size: pageActivity.size,
        createOrderTime: self.data.date,
      }
    },
      (res) => {
        self.setData({
          isLastReqFin: true,
          pageOrder: {
            page: res.data.page,
            size: res.data.size,
            recordsFiltered: res.data.recordsFiltered,
            createOrderTime: self.data.date,
            content: isLoadMore ? self.data.pageOrder.content.concat(res.data.data) : res.data.data

          },
        }, );
          });
      });


  }, 
  /**
   * 上滑事件（只有在有滚动条的情况下，并且已经滑到底部的时候才能触发）
   */
  pullUpLoad: function () {
    let self = this;
    if (self.isHaveNextPage() ) {
      const pageOrder = self.data.pageOrder;
      pageOrder.page += 1;
      setTimeout(() => {
        self.loadPageActivity(pageOrder, true);
      }, 100)

    }
  },
  /**
   * 是否还有下一页
   */
  isHaveNextPage: function () {
    const { pageOrder } = this.data;
    return pageOrder.size * (pageOrder.page + 1) < pageOrder.recordsFiltered;
  },

})