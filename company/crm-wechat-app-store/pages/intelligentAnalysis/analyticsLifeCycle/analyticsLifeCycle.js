var wxCharts = require('../../../utils/wxcharts.js');
const util = require('../../../utils/util.js');
var columnChart1 = null;//活跃期
var columnChart2 = null;//睡眠期
var columnChart3 = null;//沉睡期
var columnChart4 = null;//流失期
var lineChart4 = null;
Page({
	/**
	 * 页面的初始数据
	 */
    data: {
      isShowMouthModalText:'近3个月',
      isShowMouthModal:true,
      isShowModal: true,
      modalText: '活跃期',
      isShowChart1: true,                                         //活跃期     是否显示
      isShowChart2: false,                                        //睡眠期     是否显示
      isShowChart3: false,                                        //沉睡期     是否显示
      isShowChart4: false,                                        //流失期     是否显示
      lifeCycleArray:['ACTIVE_PERIOD','SLEEP_PERIOD','DORMANT_PERIOD','LOSS_PERIOD'],       //生命周期
      lifeCycleTextArray:['活跃期','睡眠期','沉睡期','流失期'],    //生命周期
      monthArray:[3,6,12],                                        //相隔月数
      currentShowChart:'',                                        //当前选中的周期类型
      searchParam:{                                               //搜索参数
          cycleState:'ACTIVE_PERIOD',                                  //周期状态
          monthNumber:3,                                              //近几个月
      },
      lifeCycleTableDataArray:[],                                 //生命周期table数据
      lifeCyclePieChartData:{                                     //生命周期图表数据
          newMemberPieChartList:[],                                 //新会员图表数据
          oldMemberPieChartList:[],                                 //老会员图表数据
          sleepPieChartList:[],                                     //睡眠期会员图表数据
          deadSleepPieChartList:[],                                 //沉睡期会员图表数据
          lossColumnPieChartList:[],                                //流失期会员柱形图数据
          lossLinePieChartList:[],                                  //流失期会员线形图数据
          categories:[]
      },

    },
      onLoad: function (e) {
        let self = this;
        self.loadLiefCycleDate();
      },

/**===============================加载数据   START==================================*/

    /**
     * 加载会员生命周期的数据
     */
    loadLiefCycleDate:function(){
        let self = this;
        util.doRequest({
            url: '/shopAnalyzeReport/listMemberLifeCycleAnalyzeReportForChain',
            method:'POST',
            data:self.data.searchParam,
        }, res => {
            self.setData({
               lifeCycleTableDataArray:res.data["memberLifeCycleAnalyzeReportList"],
                ['lifeCyclePieChartData.newMemberPieChartList']:res.data["newMemberPieChartList"],
                ['lifeCyclePieChartData.oldMemberPieChartList']:res.data["oldMemberPieChartList"],
                ['lifeCyclePieChartData.sleepPieChartList']:res.data["sleepPieChartList"],
                ['lifeCyclePieChartData.deadSleepPieChartList']:res.data["deadSleepPieChartList"],
                ['lifeCyclePieChartData.lossColumnPieChartList']:res.data["lossColumnPieChartList"],
                ['lifeCyclePieChartData.lossLinePieChartList']:res.data["lossLinePieChartList"],
                ['lifeCyclePieChartData.categories']:res.data["categoriesList"],
            },()=>{
                //加载页面对应的图表
                if(self.data.isShowChart1){
                    self.loadActiveCyclePieChart();
                }else if(self.data.isShowChart2){
                    self.loadSleepCyclePieChart();
                }else if(self.data.isShowChart3){
                    self.loadDeadSleepPieChart();
                }else{
                    self.loadLoseCycleColumnPieChart();
                    self.loadLossCycleLinePieChart();
                }
            });
        });
    },


/**===============================加载图表   START==================================*/
    //加载  活跃期柱形图
    loadActiveCyclePieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        columnChart1 = new wxCharts({
            canvasId: 'columnCanvas1',
            type: 'column',
            animation: true,
            categories: self.data.lifeCyclePieChartData.categories,
            series: [{
              color: '#90ED7D',
              name: '新会员',
              data: self.data.lifeCyclePieChartData.newMemberPieChartList,
              format: function (val, name) {
                return val.toFixed(2) + '万';
              }
            }, {
              color: '#434348',
              name: '老会员',
              data: self.data.lifeCyclePieChartData.oldMemberPieChartList,
              format: function (val, name) {
                return val.toFixed(2) + '万';
              }
            }],
            yAxis: {
              format: function (val) {
                return val + '万';
              },
              title: '',
              min: 0
            },
            xAxis: {
              disableGrid: false,
              type: 'calibration'
            },
            extra: {
              column: {
                width: 15
              }
            },
            width: windowWidth,
            height: windowWidth * 0.51,
        });
    },

    //加载  睡眠期柱形图
    loadSleepCyclePieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        columnChart2 = new wxCharts({
          canvasId: 'columnCanvas2',
          type: 'column',
          animation: true,
          categories: self.data.lifeCyclePieChartData.categories,
          series: [{
            color: '#F45844',
            name: '睡眠会员',
            data: self.data.lifeCyclePieChartData.sleepPieChartList,
            format: function (val, name) {
              return val.toFixed(2) + '万';
            }
          }],
          yAxis: {
            format: function (val) {
              return val + '万';
            },
            title: '',
            min: 0
          },
          xAxis: {
            disableGrid: false,
            type: 'calibration'
          },
          extra: {
            column: {
              width: 15
            }
          },
          width: windowWidth,
          height: windowWidth * 0.51,
        });
    },

    //加载  沉睡期柱形图
    loadDeadSleepPieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        columnChart3 = new wxCharts({
            canvasId: 'columnCanvas3',
            type: 'column',
            animation: true,
            categories: self.data.lifeCyclePieChartData.categories,
            series: [{
              color: '#FFB602',
              name: '沉睡会员',
              data: self.data.lifeCyclePieChartData.deadSleepPieChartList,
              format: function (val, name) {
                return val.toFixed(2) + '万';
              }
            }],
            yAxis: {
              format: function (val) {
                return val + '万';
              },
              title: '',
              min: 0
            },
            xAxis: {
              disableGrid: false,
              type: 'calibration'
            },
            extra: {
              column: {
                width: 15
              }
            },
            width: windowWidth,
            height: windowWidth * 0.51,
        });
    },

    //加载  流失期柱形图
    loadLoseCycleColumnPieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        columnChart4 = new wxCharts({
            canvasId: 'columnCanvas4',
            type: 'column',
            animation: true,
            categories: self.data.lifeCyclePieChartData.categories,
            series: [{
              color: '#546471',
              name: '流失会员',
              data: self.data.lifeCyclePieChartData.lossColumnPieChartList,
              format: function (val, name) {
                return val.toFixed(2) + '万';
              }
            }],
            yAxis: {
              format: function (val) {
                return val + '万';
              },
              title: '',
              min: 0
            },
            xAxis: {
              disableGrid: false,
              type: 'calibration'
            },
            extra: {
              column: {
                width: 15
              }
            },
            width: windowWidth,
            height: windowWidth * 0.51,
        });
    },

    //加载  流失率线形图
    loadLossCycleLinePieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        lineChart4 = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: self.data.lifeCyclePieChartData.categories,
            series: [{
              data: self.data.lifeCyclePieChartData.lossLinePieChartList,
              format: function (val) {
                return val.toFixed(2) + '万';
              }
            }],
            yAxis: {
              title: '',
              format: function (val) {
                return val.toFixed(2);
              },
              min: 0
            },
            width: windowWidth,
            height: windowWidth * 0.585,
            extra: {
              lineStyle: 'curve'
            }
        });
    },


/**===============================当前页面公用方法   START==================================*/
    /**
     * 获取宽度
     */
    getWindowWidth:function(){
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        return windowWidth;
    },

    /**
     * 获取数组索引
     * @param array 数组
     * @param value 值
     */
    getArrayIndex:function(array,value){
        for(let i = 0; i < array.length;i++){
            if(array[i] == value){
                return i;
            }
        }
    },

    /**
     * 生命周期下拉框弹层是否显示
     */
    showSelect: function () {
        let slef = this;
        slef.setData({
            isShowModal: !this.data.isShowModal,
            isShowMouthModal: true,
        })
    },

    /**
     * 选择对应的生命周期
     * @param e
     */
    selectedLifeCycleModal: function (e) {
        let self = this;
        let index = self.getArrayIndex(self.data.lifeCycleArray,e.currentTarget.id);
        self.setData({
            isShowModal: !this.data.isShowModal,                                        //设置弹框隐藏与显示
            modalText:self.data.lifeCycleTextArray[index],		                        //设置显示内容提示
            currentShowChart:self.data.lifeCycleArray[index] ,                          //设置当前选中的生命周期类型
            ['searchParam.cycleState'] : self.data.lifeCycleArray[index],			    //设置周期状态参数
        },()=>{
            let arrry = [1,2,3,4];
            for(let i in arrry){
                self.setData({
                    ['isShowChart'+arrry[i]]:index == i ? true : false,
                });
            }
            //重新加载数据
            self.loadLiefCycleDate();
        });
    },

    /**
     * 月数 选择下拉框弹层是否显示
     */
    showMouthModal: function () {
        let self = this;
        self.setData({
            isShowMouthModal: !this.data.isShowMouthModal,
            isShowModal:true,                                     //设置会员周期弹框隐藏与显示
        })
    },
    /**
     * 选择月数 3,6,12
     */
    selectedMonthNumberModal:function(e){
        let self = this;
        let index = self.getArrayIndex(self.data.monthArray, parseInt(e.currentTarget.id.split("Mouth")[1]));
        self.setData({
            isShowMouthModal: !this.data.isShowMouthModal,					        //设置选择月数弹框隐藏与显示
            isShowMouthModalText: '近'+self.data.monthArray[index]+'个月' ,		    //设置显示内容提示 近 N 天
            ['searchParam.monthNumber'] : self.data.monthArray[index],			    //设置搜索参数
        },()=>{
            self.loadLiefCycleDate();
        });
    },


});