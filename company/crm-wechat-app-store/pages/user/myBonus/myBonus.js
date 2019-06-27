const util = require('../../../utils/util.js');
const app = getApp();
Page({
   /**
   * 页面的初始数据
   */
  data:{
    num:1,
    myBonus: {                    // 回调函数
      balance:0,                  // 员工余额
      newMemberBonus:0,           // 新会员奖金
      customersBonus: 0,          // 回头客奖金
      salesBonus: 0,              // 线上销售提成
      accumulativeEarnings: 0,    // 累计收益
    },           
    startTime:'',         // 请求参数 ： 起始时间
    endTime: '',          // 请求参数 ： 结束时间
  },


  /**
   * 请求后台参数
   */
  employeeBonusDetails: function (){
    let self = this;
    let startTime = self.data.startTime;
    let endTime = self.data.endTime;
    util.doRequest({
      url: "myBonus/employeeBonusDetails",
      data: { 
        "startTime": startTime,
        "endTime": endTime
           }
    },res =>{
      console.log(res.data);
       self.setData({
         ["myBonus.balance"]: res.data.balanceDouble==null?0:res.data.balanceDouble.toFixed(2),
         ["myBonus.newMemberBonus"]: res.data.newMemberBonus==null?0:res.data.newMemberBonus.toFixed(2),
         ["myBonus.customersBonus"]: res.data.customersBonus==null?0:res.data.customersBonus.toFixed(2),
         ["myBonus.salesBonus"]: res.data.salesBonus == null ? 0 : res.data.salesBonus.toFixed(2),
         ["myBonus.accumulativeEarnings"]: res.data.accumulativeEarnings == null ? 0 : res.data.accumulativeEarnings.toFixed(2),
           
         }) 
    })
  },

  selectTime:function(e){
    const self = this;
    console.log(e);
    let num = e.target.dataset.num;
    self.setData({
      num: num
    });
    let startTime = '';
    let endTime = '';
    let day = new Date();
    let day2 = day;
    switch (num){
      case '1':
        day.setTime(day.getTime());
        startTime = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        endTime = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
      break;
      case '2':
        day.setTime(day.getTime());
        endTime = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        day2.setTime(day.getTime() - 24 * 60 * 60 * 1000);
        startTime = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
        break;
      case '3':
        let numDay = day.getDay() - 1;
        day.setDate(day.getDate() - num); //本周第一天
        startTime = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        day.setDate(day.getDate() + 6);//本周最后一天
        endTime = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        break;
      case '4':
        day.setDate(1);//本月第一天
        startTime = day.getFullYear() + "-" + (day.getMonth()+1) + "-" + '1';
        day.setMonth(day.getMonth() + 1);//下个月
        day.setDate(day.getDate() - 1);//下个月第一天减1得到本月最后一天
        endTime = day.getFullYear() + "-" + (day.getMonth() +1) + "-" + day.getDate();
        break;
    }
    self.setData({
      startTime: startTime,
      endTime:endTime
      });
      
    self.employeeBonusDetails();

  },

  /**
   * 查看日志明细
   */
  checkDetails:function(){
    wx.navigateTo({
      url: "../myBonus/bounsDetails/bounsDetails",
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    let day = new Date();
    day.setTime(day.getTime());
    let startTime = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    let endTime = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    self.setData({
      startTime: startTime,
      endTime:endTime
    },() => {
      self.employeeBonusDetails();
    });
  },
});
