const util = require('../../../../utils/util.js');
const app = getApp();
Page({
    data:{
      income:0,                             // 总收入
      spending: 0,                          // 总支出
      balance:0,                            // 余额
      isLastReqFin: true,                 //上次请求是否结束
      height:500,                           // 滑动高度
      pageBounsTrans: {                     //page对象
        recordsFiltered: 0,
        data: [],
        page: 0,
        size: 10
      },
      searchParam: {                        // 搜索参数
        startTime: "",               // 开始时间
  
        page: 0,                            // 页码
        size: 10,                           // 每页大小
      },
    
    },

    /**
     * 时间选择器
     */
  bindDateChange: function (e) {
      let self =this;
      self.setData({
        ["searchParam.startTime"]: e.detail.value
      }, () =>{
        self.loadData(false);
      })
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
      const pageBounsTrans = self.data.pageBounsTrans;
      return (pageBounsTrans.size * (pageBounsTrans.page + 1)) < pageBounsTrans.recordsFiltered;
    },

  /**
     * 加载数据
     * @param isLoadMore 是否加载更多
     */
  loadData: function (isLoadMore) {
    const self = this;
    self.setData({
      isLastReqFin: false
    },() => {
      util.doRequest({
        url: "myBonus/bonusBillingDetails",
        data: self.data.searchParam
      }, res => {
        let income = res.data["income"].toFixed(2);
        let spending = res.data["spending"].toFixed(2);
        let pageBouns = res.data["page"];
        let balance = res.data["balance"].toFixed(2);
        //加载更多为拼接 否则覆盖
        let pageBounsTrans = {
          page: pageBouns.page,
          size: pageBouns.size,
          recordsFiltered: pageBouns.recordsFiltered,
          data: isLoadMore ? self.data.pageBounsTrans.data.concat(pageBouns.data) : pageBouns.data
        };
        self.setData({
          pageBounsTrans: pageBounsTrans,
          income: income,
          isLastReqFin: true,
          spending: spending,
          balance:balance
          });
        });
    });
  },

  /**
  * 计算屏幕滑动高度
  */
  screenHieht:function(){
    let self = this;
      // 获取用户屏幕尺寸
    let height = null;
    let barheight = null;
    wx.getSystemInfo({
      success:function(res){
      height = res.screenHeight;
      barheight=res.statusBarHeight;
      }
    })
    height = height - barheight - 100 - 88 -20;
    self.setData({
      height: height
    })
  },


  /**
  * 页面加载设置当前状态
  */
    onLoad: function (options) {
    const self = this;
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var startTime = year + "-" + month;
    self.setData({
      ["searchParam.startTime"]: startTime
    },()=>{
      self.loadData(false);
    })
    // 计算屏幕滑动高度
      self.screenHieht();
  },

})
