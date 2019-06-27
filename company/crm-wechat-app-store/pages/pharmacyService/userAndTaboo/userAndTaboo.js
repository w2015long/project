const util = require('../../../utils/util.js');
Page({

  /**
   * 组件的初始数据
   */
  data: {
    dateDays: "TODAY",                      //查询天数
    pageUserAndTaboo: {                     //page对象
      recordsFiltered: 0,
      data: [],
      page: 0,
      size: 10
    },
    isLastReqFin: true,                 //上次请求是否结束
    searchParam: {
      dateDays: "TODAY",                      //查询天数
      isComment: "",                      //是否评价
      page: 0,                            //页码
      size: 10,                           //每页大小
    }
  },
  /**
      * 切换tab触发
      */
  changeTab: function (e) {
    const self = this;
    self.setData({
      dateDays: e.currentTarget.dataset.id,
      ["searchParam.dateDays"]: e.currentTarget.dataset.id,
      ["searchParam.page"]: 0
    }, () => self.loadData(false));

  },
  /**
   * 页面加载设置当前状态
   */
  onLoad: function (options) {
    const self = this;
    self.loadData();
  },
  /**
       * 加载数据
       * @param isLoadMore 是否加载更多
       */
  loadData: function (isLoadMore) {
    //TODO:caixuan 上滑加载更多转圈样式待调整
    const self = this;
    self.setData({
      isLastReqFin: false
    }, () => {
      util.doRequest({
        url: "userAndTaboo/pageUserAndTabooXcx",
        data: self.data.searchParam 
      }, res => {
        //加载更多为拼接 否则覆盖
        let pageUserAndTaboo = {
          page: res.data.page,
          size: res.data.size,
          recordsFiltered: res.data.recordsFiltered,
          data: isLoadMore ? self.data.pageUserAndTaboo.data.concat(res.data.data) : res.data.data
        };
        self.setData({
          pageUserAndTaboo: pageUserAndTaboo,
          isLastReqFin: true,
          isShowLoadMore: false
        });
      })
    });
  },
  
  /**
  * 上滑加载更多
  */
  pullUpLoad: function () {
    const self = this;
    if (self.data.isLastReqFin && self.isHaveNextPage()) {
      self.setData({
        ["searchParam.page"]: self.data.searchParam.page + 1
      }, () => self.loadData(true));
    }
  },
  /**
   * 判断是否还有下一页
   */
  isHaveNextPage: function () {
    const self = this;
    const pageUserAndTaboo = self.data.pageUserAndTaboo;
    return pageUserAndTaboo.size * (pageUserAndTaboo.page + 1) < pageUserAndTaboo.recordsFiltered;
  },
  pushTaboo:function(e){
    util.privateNavigateTo('../pushTaboo/pushTaboo/pushTaboo?orderId=' + e.currentTarget.dataset.itemId);
  },
})
