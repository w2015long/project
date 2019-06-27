var wxCharts = require('../../../utils/wxcharts.js');
const util = require('../../../utils/util.js');
var pieChart = null;
Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    winWidth: wx.getSystemInfoSync().windowWidth,
    winHeight: wx.getSystemInfoSync().windowHeight,
    searchParam:{dayNumber:7},      //搜索参数
    analytiscIndexData:{            //分析初始化数据
        customerQuantityOfDay:0,    //日均客流量
        orderQuantityOfDay:0,       //日均订单数量
        sellAmountOfDayDouble:0,    //日均销售额
        dealRatio:0,                //成交率
        repurchaseRatio:0,          //复购率
        grossMarginRatio:0,         //毛利率

        sellOutNum:0,               //缺货
        sellOutNumAfterThreeDay:0,  //3天后缺货数量
        sellOutNumAfterFiveDay:0,   //5天后缺货数量

        active:0,                   //活跃期人数
        sleep:0,                    //睡眠期人数
        longSleep:0,                //沉睡期人数
        loss:0,                     //流失期人数
        lossRate:'0%',              //流失率
    },
  },

  onLoad: function (e) {
    let self = this;
    self.loadAnalyticsHomeData();
  },


    /**
     * 去往综合分析
     * @param e
     */
  gotoComprehensiveAnalysis:function(e){
        wx.setStorageSync("currentShowChart", e.currentTarget.id);
        util.privateNavigateTo('../../intelligentAnalysis/customerPriceAnalysis/customerPriceAnalysis?id=' + e.currentTarget.id);
  },

    /**
     * 会员分析  : 
     */
  gotoMembershipAnalysis:function(e){
        switch (e.currentTarget.id){
              case 'consumption':
                    util.privateNavigateTo('../consumerRankings/consumerRankings');
                    break;
              case 'life':
                    util.privateNavigateTo('../../intelligentAnalysis/analyticsLifeCycle/analyticsLifeCycle?id=' + e.currentTarget.id);
                    break;
        }
  },

    /**
     * 品类分析
     */
  gotoCategoryAnalysis:function(e){
        switch (e.currentTarget.id) {
            case 'sales' :      //销售分析 
            util.privateNavigateTo('../salesRanking/salesRanking');
                break;
            case 'shortage' :   //缺货分析
                util.privateNavigateTo('../../intelligentAnalysis/shortageAnalysis/shortageAnalysis?id=' + e.currentTarget.id);
                break;
        }

  },

  /**
   * 加载智能分析首页数据
   */
  loadAnalyticsHomeData:function(){
      let self = this;
      util.doRequest({
          url: '/shopAnalyzeReport/getShopIntelligentAnalyzeOfSimpleProtocol',
          method:'POST',
          data:self.data.searchParam,
      }, res => {
          if(res.data != null && res.data != ''){
              self.setData({
                  analytiscIndexData:res.data,
              },()=>{
                  self.loadMemberLifeCyclePieChart();
              });
          }
      });
  },
  /**
   * 加载会员生命周期饼图
   */
  loadMemberLifeCyclePieChart:function(){
      let self = this;
      var windowWidth = 320;
      try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
      } catch (e) {
          console.error('getSystemInfoSync failed!');
      }
      pieChart = new wxCharts({
          animation: true,
          canvasId: 'pieCanvas',
          type: 'ring',
          series: [{
              name: '活跃会员',
              data: self.data.analytiscIndexData.active,
              color: '#27C886'
          }, {
              name: '睡眠会员',
              data: self.data.analytiscIndexData.sleep,
              color: '#F0332F'
          }, {
              name: '沉睡会员',
              data: self.data.analytiscIndexData.longSleep,
              color:'#FFB602'
          }, {
              name: '流失会员',
              data: self.data.analytiscIndexData.loss,
              color: '#546472'
          }],
          width: 290,
          height: windowWidth * 0.70,
          dataLabel: true,
          title: {
              name: '流失率',
              color: '#1A1A1A',
              fontSize: 16
          },
          subtitle: {
              name: self.data.analytiscIndexData.lossRate,
              color: '#1A1A1A',
              fontSize: 16
          },
      });
  }
});