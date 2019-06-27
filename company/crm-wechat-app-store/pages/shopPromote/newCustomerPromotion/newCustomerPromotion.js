const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        maximumNumberOfPromoters: 50,
        dateParam: util.formatDay(new Date()),
        totalAmount: 0.00,
        thatDayPromoteNum: 0,
        wapUserPromoteBonusRecordProtocol: {},//抽奖记录
        isShowBonus:false,
        bonus:0

},
    onLoad: function () {
        this.loadData();
    },
    /**
     * 请求后台加载数据
     */
    loadData:function(){
        let self = this;
        util.doRequest({
            url: '/userPromote/getUserPromoteRecord?dateTime='+self.data.dateParam,
            method:'GET'
        }, res => {
            if(res.data != null && res.data !== ''){
                self.setData({
                    totalAmount:res.data.totalAmountDouble,
                  thatDayPromoteNum: res.data.thatDayPromoteNum,
                  wapUserPromoteBonusRecordProtocol: res.data.wapUserPromoteBonusRecordProtocol,
                });
            }
        });
    },
//时间组件
  bindDateChange: function (e) {

      this.setData({
          dateParam: e.detail.value
      });
      this.loadData();
  },
    //点击抽奖
    getBonus: function (event){
        var userpromotebonusrecordid = event.detail.userpromotebonusrecordid;
        let self = this;
        util.doRequest({
            url: '/userPromote/getBonus?userPromoteBonusRecordId=' + userpromotebonusrecordid,
            method:'GET'
        }, res => {
            if(res.data != null && res.data !== ''){
                self.setData({
                    isShowBonus: true,
                    bonus: res.data,
                });
            }
        });
    },
    //关闭红包弹窗
    closeShowBonus: function (){
         let self = this;
        self.setData({
            isShowBonus: false,
        });
        this.loadData();
    },
  //   /**
  //    * 下拉刷新
  //    */
  //   onPullDownRefresh:function(){
  //     let self = this;
  //     self.loadData();
  //     wx.stopPullDownRefresh();
  // }
})