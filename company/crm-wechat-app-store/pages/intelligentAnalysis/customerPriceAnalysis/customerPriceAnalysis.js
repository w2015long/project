var wxCharts = require('../../../utils/wxcharts.js');
const util = require('../../../utils/util.js');
var columnChart1 = null;//综合分析
var alllineChart4 = null;//综合分析
var columnChart2 = null;//交易分析
var columnChart3 = null;//客单价分析
var columnChart4 = null;//客流量分析
var pieChart1 = null;//客群分析
var pieChart2 = null;//客群分析
var pieChart3 = null;//客群分析
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		allList: [],                              //综合分析   列表  = 数据结构{ reportDateString: "6月1日", customerQuantity: 160, orderQuantity: 70, repurchaseQuantity: 45, sellAmountDouble: 1680 ,dealRatio:"80%",repurchaseRatio:'80%',grossMarginRatio:'80%'},
        transactionList: [],                      //交易分析   列表  = 数据结构{ cause : "价格偏贵" , quantity : "15",ratio : "50%"}
		isShowModal: true,
		modalText: '综合分析',
		modalselectTransactionText: '按天',       //综合分析 - 交易分析 初始化条件提醒 /按天/按周/按月
		modalselectDoneText: '按天',              //综合分析 - 成交分析 初始化条件提醒 /按天/按周/按月
		isShowMouthModalText: '近7天',            //分析类型的天数条件
		modalselectPrectText:'价格区间10',        //客单价分析 - 价格分析 初始化条件提醒 价格区间10/价格区间20/价格区间30
		isShowAllSelectDay: true,                 //交易数据按天/周/月 选择弹层
		isPrice:true,                             //价格按10/20/30 选择弹层
        isShowDay: true,                          //成交按10/30/90/180天弹层
		isShowMouthModal: true,                   //天数按10/30/90/180 选择弹层
		isShowChart1: true,                       //综合分析        是否显示
		isShowChart2: false,                      //交易分析        是否显示
		isShowChart3: false,                      //客单价分析      是否显示
		isShowChart4: false,                      //客流量分析      是否显示
		isShowChart5: false,                      //客群分析        是否显示

        selectedTransactionOrDeal : '',           //交易或者成交的按天/周/月选择
        currentShowChart:'',                      //当前选中的分析类型
        priceArray:[10,20,30],					  //价格 数组
        dayArray:[7,30,90,180],			          //天数 数组
		analysisArray:['all','transaction','percustomer','passengerflow','guestgroup'],
		analysisTextArray:['综合分析','交易分析','客单价分析','客流量分析','客群分析'],
        selectGroupByArray:['day','week','month'],
        selectGroupByTextArray:['按天','按周','按月'],
        transactionFailArray:[],                 //交易分析 - 交易失败占比分析
        transactionFailColorHintsArray:[],                 //交易分析 - 图表颜色提示
        searchParam:{					         //搜索参数
			dayNumber:7,				            //天数
            groupBy:'day',				            //查询状态，天/周/月
            range:10,                               //价格 10/20/30
        },
        analytiscIndexData:{                     //综合分析  - 总览数据
            customerQuantityOfDay:0,                //日均客流量
            orderQuantityOfDay:0,                   //日均订单数量
            sellAmountOfDayDouble:0,                //日均销售额
            dealRatio:0,                            //成交率
            repurchaseRatio:0,                      //复购率
            grossMarginRatio:0,                     //毛利率
        },
		allPieChartData:{				         //综合分析 - 图表数据
            customerQuantity:[],		            //进店人数
            orderQuantity:[],			            //成交笔数
            repurchaseQuantity:[],		            //复购数
            dealRatio:[],				            //成交率
            repurchaseRatio:[],			            //复购率
            categories:[],
		},
        unitPriceIndexData: {                    // 客单价分析 - 总览数据
            totalSellAmount:0,                      // 总销售额
            totalOrderQuantity:0,                   // 总订单数
            totalBuyerQuantity:0,                   // 总购买人数
            sellAmountAvg:0                         // 平均客单价
        },
        unitPricePieChartList: {},                      // 客单价分析 -  价格分析List
        unitPricePieChartData: {
          sellAmountPieChartList: [],               // 销售金额
          amountRangePieChartList: [],              // 数据类别-订单区间
        },              

        times: ['00:00-01:00', '01:00-02:00', '03:00-04:00', '03:00-04:00', '05:00-06:00', '07:00-08:00',
            '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
            '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
            '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-00:00'
        ],                                       // 客流量24小时时间段
        passengerFlowVolume: {},                 // 客流量  后台返回对象（下面的数据是从该对象中拆分出来）
        passengerFlowVolumeSellAmount: [],       // 客流量销售金额数据
        passengerFlowPieChartData:{              // 客流量分析 - 图表数据
            passengerFlowVolumeCustomer: [],        // 客流量进店人数数据
            passengerFlowVolumeOrder: [],           // 客流量成交订单数据
        },
        guestgroup:'',                           // 客群分析 - （包含图表数据）
        noDataPieChartColor:'#EECFA1',          //查询无数据的默认颜色
        testArray:[1,2,3]
	},
	onLoad: function (e) {
	    let self = this;
        self.initCurrentShowChart();
        self.init(e);
	},

    /** ================================== 全页面通用选择 start ==================================*/


    /**
     * 初始化当前分析类型的字段
     */
    initCurrentShowChart:function(){
        let self = this;
        const currentSelectedShowChart = wx.getStorageSync("currentShowChart");
        wx.removeStorageSync("currentShowChart");
        self.setData({
            currentShowChart:currentSelectedShowChart,
        })
    },

    /**
     * 多入口分析选择初始化
     * @param e
     */
    init: function (e) {
        if (e.id) {
            let self = this;
            let index = self.getArrayIndex(self.data.analysisArray,e.id);
            self.setData({
                modalText:self.data.analysisTextArray[index],		//设置显示内容提示
                currentShowChart:self.data.analysisArray[index]     //设置当前选中的分析类型
            },()=>{
                let arrry = [1,2,3,4,5];
                for(let i in arrry){
                    self.setData({
                        ['isShowChart'+arrry[i]]:index == i ? true : false,
                    });
                }
                self.switchLoadAnalysisData();
            });
        }
    },

    /**
     * 根据switch 加载对应分析类型的数据
     */
    switchLoadAnalysisData:function(){
        let self = this;
        //选择指定天数数据，回调加载数据
        switch (self.data.currentShowChart) {
            case self.data.analysisArray[0]:             //综合分析
                self.loadAll();
                break;
            case self.data.analysisArray[1]:            //交易分析
                self.loadTransaction();
                break;
            case self.data.analysisArray[2]:            //客单价分析
                self.loadUnitPriceData();
                break;
            case self.data.analysisArray[3]:            //客流量分析
                self.loadPassengerFlowData();
                break;
            case self.data.analysisArray[4]:            //客群分析
                self.loadGuestGroupData();
                break;
        }
    },

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
     */
    getArrayIndex:function(array,value){
        for(let i = 0; i < array.length;i++){
            if(array[i] == value){
                return i;
            }
        }
    },

    /**
	 * 选择对应的分析类型
     * @param e
     */
    selectedAnalysisModal: function (e) {
        let self = this;
        let index = self.getArrayIndex(self.data.analysisArray,e.currentTarget.id);
        self.setData({
            isShowModal: !this.data.isShowModal,				//设置弹框隐藏与显示
            modalText:self.data.analysisTextArray[index],		//设置显示内容提示
            currentShowChart:self.data.analysisArray[index]     //设置当前选中的分析类型
        },()=>{
            let arrry = [1,2,3,4,5];
            for(let i in arrry){
                self.setData({
                    ['isShowChart'+arrry[i]]:index == i ? true : false,
                });
            }
            self.switchLoadAnalysisData();
        });
    },

    /**
     * 综合分析 - 交易弹窗 选择 天/周/月
     * @param e
     */
    selectedGroupByModal: function (e) {
        let self = this;
        let index = self.getArrayIndex(self.data.selectGroupByArray,e.currentTarget.id);
        self.setData({
            isShowAllSelectDay: !this.data.isShowAllSelectDay,						//设置弹框隐藏与显示
            modalselectTransactionText : self.data.selectGroupByTextArray[index],	//设置显示内容提示
            ['searchParam.groupBy']:self.data.selectGroupByArray[index],			//设置搜索参数
            selectedTransactionOrDeal:'transaction',
        },()=>{
            self.loadAllListAnalyzeOfShopByData();
        });
    },

    /**
     * 综合分析 - 成交弹窗 选择 天/周/月
     * @param e
     */
    selectedDealGroupByModal: function (e) {
        let self = this;
        let index = self.getArrayIndex(self.data.selectGroupByArray,e.currentTarget.id);
        self.setData({
            isShowDay: !this.data.isShowDay,						                //设置弹框隐藏与显示
            modalselectDoneText : self.data.selectGroupByTextArray[index],	        //设置显示内容提示
            ['searchParam.groupBy']:self.data.selectGroupByArray[index],			//设置搜索参数
            selectedTransactionOrDeal:'deal',
        },()=>{
            self.loadAllListAnalyzeOfShopByData();
        });
    },

    /**
	 * 全部分析(5种)选择天 7,30,90,180
     */
    selectedDayNumberModal:function(e){
        let self = this;
        let index = self.getArrayIndex(self.data.dayArray, parseInt(e.currentTarget.id.split("Mouth")[1]));
        this.setData({
            isShowMouthModal: !this.data.isShowMouthModal,					//设置弹框隐藏与显示
            isShowMouthModalText: '近'+self.data.dayArray[index]+'天' ,		        //设置显示内容提示 近 N 天
			['searchParam.dayNumber'] : self.data.dayArray[index],			//设置搜索参数
            selectedTransactionOrDeal : '',
        },()=>{
            self.switchLoadAnalysisData();
        });
	},

    /**
	 * 选择价格 10,20,30
     */
    selectedPriceModal:function(e){
        let self = this;
        let index = self.getArrayIndex(self.data.priceArray, parseInt(e.currentTarget.id.split("price")[1]));
        self.setData({
            isPrice: !this.data.isPrice,
            modalselectPrectText: '价格区间'+self.data.priceArray[index],
            ['searchParam.range']:self.data.priceArray[index],
		},()=>{
            self.loadUnitPriceData();
        });
	},

    /**
     * 天数选择事件
     */
    showMouthModal: function () {
        let self = this;
        self.setData({
            isShowMouthModal: !this.data.isShowMouthModal,
            isShowAllSelectDay: true,
            isShowModal: true,
            isPrice:true,
        })
    },

    /**
     *  综合分析 -  交易数据 点击事件
     */
    showSelectAllDay: function () {
        let self = this;
        self.setData({
            isShowAllSelectDay: !this.data.isShowAllSelectDay,
            isShowPassengerflow:true,
            isShowModal: true,
            isShowMouthModal: true,//近7天
            isPrice:true,
        })
    },

    /**
     *  综合分析 -  成交分析 点击事件
     */
    showDaySelect: function () {
        let self = this;
        self.setData({
            isShowDay: !this.data.isShowDay,
            isShowAllSelectDay: true,//交易数据
            isShowMouthModal: true,//近7天
            isShowPassengerflow: true,
            isPrice:true,
        })
    },

    /**
     *  客单价分析 -  价格分析 点击事件
     */
    showPriceSelect: function () {
        let self = this;
        self.setData({
            isPrice: !this.data.isPrice,
            isShowPassengerflow: true,
            isShowModal: true,
            isShowAllSelectDay: true,//交易数据
            isShowMouthModal: true,//近7天
        })
    },

    /**
     * 综合分析 - 搜索类型选择 点击事件
     */
    showSelect: function () {
        let self = this;
        self.setData({
            isShowModal: !this.data.isShowModal,
            isShowAllSelectDay: true,//交易数据
            isShowMouthModal: true,//近7天
            isShowPassengerflow: true,
            isPrice:true,
        })

    },
    /** ================================== 综合分析 start ==================================*/

    /**
	 * 加载 综合分析-总览 数据
     */
	loadAllAnalyticsShopData:function(){
        let self = this;
        util.doRequest({
            url: '/shopAnalyzeReport/getAnalyzeOfShopBySynthesizeDate',
            method:'POST',
            data:self.data.searchParam,
        }, res => {
            if(res.data != null && res.data != ''){
                self.setData({
                    analytiscIndexData:res.data,
                });
            }
        });
	},

    /**
     * 加载图表插件分期数据
     */
    loadAllListAnalyzeOfShopByData:function(){
        let self = this;
        util.doRequest({
            url: '/shopAnalyzeReport/listAnalyzeOfShopByDate',
            method:'POST',
            data:self.data.searchParam,
        }, res => {
            self.setData({
                allList : res.data['XCXClerkAnalyzeOfShopByDateProtocolList'],  //列表数据
                allPieChartData:{
                    customerQuantity:res.data['customerQuantityList'] == '' ? [0] : res.data['customerQuantityList'],			//进店人数
                    orderQuantity:res.data['orderQuantityList'] == '' ? [0] : res.data['orderQuantityList'],			    //成交笔数
                    repurchaseQuantity:res.data['repurchaseQuantityList'] ? [0] : res.data['repurchaseQuantityList'] ,		//复购数
                    dealRatio:res.data['dealRatioList'] == '' ? [0] : res.data['dealRatioList'],			            //成交率
                    repurchaseRatio:res.data['repurchaseRatioList'] == '' ? [0] : res.data['repurchaseRatioList'],		    //复购率
                    categories:res.data['dateStringList'] == '' ? [0] : res.data['dateStringList'],
                },
            },() => {
                let selectedTransactionOrDeal = self.data.selectedTransactionOrDeal;
                if(selectedTransactionOrDeal == 'transaction'){
                    self.loadAllTransactionDataHistogramPieChart();
                }else if(selectedTransactionOrDeal == 'deal'){
                    self.loadAllTransactionAnalysisLinetypePieChart();
                }else{
                    self.loadAllTransactionDataHistogramPieChart();
                    self.loadAllTransactionAnalysisLinetypePieChart();
                }
            });
        });
    },

    //综合分析
    loadAll: function () {
        let self = this;
        self.loadAllAnalyticsShopData();
        self.loadAllListAnalyzeOfShopByData();
    },

    //综合分析 - 加载交易数据柱状图
    loadAllTransactionDataHistogramPieChart:function(){
        let self = this;
        var windowWidth = self.getWindowWidth();
        columnChart1 = new wxCharts({
            canvasId: 'all',
            type: 'column',
            animation: true,                                    //是否有动画
            categories: self.data.allPieChartData.categories,   //(饼图、圆环图不需要) 数据类别分类
            series: [{
                    color: '#7CB5EC',
                    name: '进店人数',
                    data: self.data.allPieChartData.customerQuantity,
                    format: function (val, name) {
                        return val.toFixed(2) + '';
                    }
                },{
                    color: '#434348',
                    name: '成交笔数',
                    data: self.data.allPieChartData.orderQuantity,
                    format: function (val, name) {
                        return val.toFixed(2) + '';
                    }
                },{
                    color: '#90ED7D',
                    name: '复够数',
                    data: self.data.allPieChartData.repurchaseQuantity,
                    format: function (val, name) {
                        return val.toFixed(2) + '';
                    }
                }],   //数据列表
            yAxis: {                                            //Y轴配置
                format: function (val) {                        //自定义Y轴文案显示
                    return val + '万';
                },
                title: '',                                      //Y轴title
                min: 0                                          //Y轴起始值
            },
            xAxis: {                                            //X轴配置
                disableGrid: false,                             //不绘制X轴网格
                type: 'calibration'
            },
            extra: {
                column: {
                    width: 15
                }
            },
            width: windowWidth ,
            height: windowWidth*0.815,
        });
	},

    //综合分析 - 加载成交数据线形图
    loadAllTransactionAnalysisLinetypePieChart:function(){
        let self = this;
        var windowWidth = self.getWindowWidth();
        alllineChart4 = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: self.data.allPieChartData.categories,
            series: [
                {
                    data: self.data.allPieChartData.dealRatio,
                    format: function (val) {
                        return val.toFixed(2) + '万';
                    }
                },
                {
                    data: self.data.allPieChartData.repurchaseRatio,
                    format: function (val) {
                        return val.toFixed(2) + '万';
                    }
                }
            ],
            yAxis: {
                title: '',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: windowWidth,
            height: windowWidth*0.815,
            extra: {
                lineStyle: 'curve'
            }
        });
	},

    /**================================== 综合分析 end ==================================*/

    //交易分析
    loadTransaction: function () {
        let self = this;
        self.setData({
            ['searchParam.groupBy']:'',
        },() =>{
            util.doRequest({
                url: '/shopAnalyzeReport/listAnalyzeOfDealFailCause',
                method:'POST',
                data:self.data.searchParam,
            }, res => {
                self.setData({
                    transactionList : res.data['xcxClerkAnalyzeOfDealFailCauseProtocolList'],
                    transactionFailArray : res.data['pieChartList'],
                    transactionFailColorHintsArray : res.data['pageColorHintsList'],
                },()=>{
                    self.loadTransactionPieChart();
                });
            });
        });
    },

      //加载交易分析饼图
    loadTransactionPieChart:function(){
        let self = this;
        let windowWidth = self.getWindowWidth();
        let transactionPieChartArray = self.data.transactionFailArray;
        if(transactionPieChartArray.length == 0){
            transactionPieChartArray.push(self.buildGuestGroupPieChartDefaultData(self.data.noDataPieChartColor)) ;
        }
        columnChart2 = new wxCharts({
            animation: true,
            canvasId: 'transaction',
            type: 'pie',
            series:transactionPieChartArray,
            width: windowWidth,
            height: windowWidth * 0.80,
        });
    },

    /** ================================== 交易分析 end ==================================*/

    /**
     * 加载 客单价分析 - 平均客单价数据
     */
    loadUnitPriceData:function(){
        let self = this;
        util.doRequest({
                url: 'shopAnalyzeReport/getAnalyzeOfCustomerUnitPriceCollect',
                method:'POST',
                data: self.data.searchParam
            },(res)=>{
                if (res.data != null && res.data != ''){
                    // 转换：
                    let totalSellAmount = res.data.totalSellAmountDouble.toFixed(2);
                    let sellAmountAvg = res.data.sellAmountAvgDouble.toFixed(2);
                    self.setData({
                        ['unitPriceIndexData.totalSellAmount']: totalSellAmount,
                        ['unitPriceIndexData.sellAmountAvg']: sellAmountAvg,
                        unitPriceIndexData:res.data,
                    },()=>{
                        // 请求成功，再请求价格分析
                        self.loadPriceData();
                    });
                }else{
                    util.showModal('近期暂无数据，请重新选择天数');
                }
            }
        )
    },

     //加载客单价分析 - 价格分析图表/table数据
    loadPriceData:function(){
        const self = this;
        util.doRequest({
            url: 'shopAnalyzeReport/listAnalyzeOfOrderAmountRange',
            method: 'POST',
            data: self.data.searchParam
        },
        (res)=>{
          let sellAmountPieChartList = res.data['sellAmountPieChartList'];
          for (let i = 0; i < sellAmountPieChartList.length;i++){
            sellAmountPieChartList[i] = sellAmountPieChartList[i].toFixed(2);
          };
            self.setData({
              unitPricePieChartList: res.data['xcxClerkAnalyzeOfDealFailCauseProtocols'],
              ['unitPricePieChartData.sellAmountPieChartList']: sellAmountPieChartList == '' ? [0] : sellAmountPieChartList,
              ['unitPricePieChartData.amountRangePieChartList']: res.data['amountRangePieChartList'] == '' ? [0] : res.data['amountRangePieChartList'],
            },()=>{
              self.loadUnitPriceColumnPieChart();
            }); 
        });
    },

     //加载 客单价 柱状图
    loadUnitPriceColumnPieChart: function () {
        let self = this;
        let data = self.data.unitPricePieChartData.sellAmountPieChartList;
        let categories = self.data.unitPricePieChartData.amountRangePieChartList;
        let windowWidth = self.getWindowWidth();
        columnChart3 = new wxCharts({
            canvasId: 'percustomer',                         // 标注分析id
            type: 'column',                                  // 图表类型 pie饼图, line圆环图, column柱状图, area折线图
            animation: true,                                 // 是否动画展示
            categories: categories,                          // 数据类别分类
            series: [{                                       // 数据列表
                color: '#7CB5EC',                              // 配色
                name: '订单笔数',                              // 数据名称
                data: data,                                    // 数据
            }],
            yAxis: {                                         //  Y轴配置
                title: '',
                min: 0
            },
            xAxis: {                                         // X轴配置
                disableGrid: false,
                type: 'calibration',
            },
            extra: {                                         // 其他非通用配置项
                column: {
                    width: 10                                    // 柱状图每项的图形宽度
                }
            },
            width: windowWidth,                              // 宽度
            height: windowWidth*0.69,                        // 高度
        });
    },

    /**================================客单价 end ===================================*/

    /**
     * 加载客流量分析
     */
    loadPassengerFlowData:function(){
        const self = this;
        util.doRequest({
            url:'shopAnalyzeReport/getAnalyzeOfShopCustomerQuantityByTime',
            method:'POST',
            data: self.data.searchParam
        },(res)=>{
            self.setData({
              ['passengerFlowPieChartData.passengerFlowVolumeCustomer']: res.data['customerQuantityPieChartList'] == ''?[0] : res.data['customerQuantityPieChartList'],
              ['passengerFlowPieChartData.passengerFlowVolumeOrder']: res.data['orderQuantityPieChartList'] =='' ? [0] : res.data['orderQuantityPieChartList'],
              passengerFlowVolumeSellAmount: res.data['sellAmountDoublePieChartList'] == '' ? [0] : res.data['sellAmountDoublePieChartList'],
              times: res.data['timePeriodPieChartList'],
            },()=>{
                self.loadPassengerflowPieChart();
            });
        })
    },


    //客流量分析数据图表
    loadPassengerflowPieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        columnChart4 = new wxCharts({
            canvasId: 'passengerflow',
            type: 'column',
            animation: true,
            categories: this.data.times,
            series: [{
                color: '#7CB5EC',
                name: '进店人数',
                data: this.data.passengerFlowPieChartData.passengerFlowVolumeCustomer,
            }, {
                color: '#434348',
                name: '成交笔数',
                data: this.data.passengerFlowPieChartData.passengerFlowVolumeOrder,
            }],
            yAxis: {
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
            height: windowWidth*0.53,
        });
    },

    /**================================客流量 end ===================================*/

    /**
     * 加载客群分析
     */
    loadGuestGroupData:function(){
        const self = this;
        util.doRequest({
            url: 'shopAnalyzeReport/getAnalyzeOfShopCustomerRatio',
            method:'POST',
            data: self.data.searchParam
        },(res)=>{


            self.setData({
                guestgroup:res.data
            },()=>{
                //加载对应图表
                self.loadGuestGroupSexPieChart();
                self.loadGuestGroupAgePieChart();
                self.loadGuestGroupIdentityPieChart();
            });
        });
    },

    //客群分析数据图表1 - 性别
    loadGuestGroupSexPieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        var sexPieChartArray = new Array();
        if(self.data.guestgroup.guestGroupSexDefaultFlag){
            sexPieChartArray.push(self.buildGuestGroupPieChartDefaultData(self.data.noDataPieChartColor));
        }else{
            var  maleObj = {
                name: '男性',
                data: self.data.guestgroup.customerQuantityOfSexMaleRatio,
                color: '#7CB5EC'
            };
            var  femaleObj = {
                name: '女性',
                data: self.data.guestgroup.customerQuantityOfSexFemaleRatio,
                color: '#F0332F'
            };
            var  secretObj = {
                name: '未知',
                data: self.data.guestgroup.customerQuantityOfSexSecretRatio,
                color: '#90ED7D'
            };
            sexPieChartArray.push(maleObj);
            sexPieChartArray.push(femaleObj);
            sexPieChartArray.push(secretObj);
        }

        pieChart1 = new wxCharts({
            animation: true,
            canvasId: 'pieChart1',
            type: 'pie',
            series: sexPieChartArray,
            width: windowWidth,
            height: windowWidth * 0.60,
            dataLabel: true,
        });
    },

    //客群分析数据图表2 -  年龄
    loadGuestGroupAgePieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        var agePieChartArray = new Array();
        if(self.data.guestgroup.guestGroupAgeDefaultFlag){
            agePieChartArray.push(self.buildGuestGroupPieChartDefaultData(self.data.noDataPieChartColor));
        }else{
            var ageUnknownObj = {
                name: '未知',
                data: self.data.guestgroup.customerQuantityOfAgeUnknownRatio,
                color: '#434348'
            };
            var age0To19Obj = {
                name: '0-19岁',
                data: self.data.guestgroup.customerQuantityOfAge0To19Ratio,
                color: '#7CB5EC'
            };
            var age20To29Obj = {
                name: '20-29岁',
                data: self.data.guestgroup.customerQuantityOfAge20To29Ratio,
                color: '#90ED7D'
            };
            var age30To39Obj = {
                name: '30-39岁',
                data: self.data.guestgroup.customerQuantityOfAge30To39Ratio,
                color: '#2B908F'
            };
            var age40To49Obj = {
                name: '40-49岁',
                data: self.data.guestgroup.customerQuantityOfAge40To49Ratio,
                color: '#F15C81'
            };
            var age50To59Obj = {
                name: '50-59岁',
                data: self.data.guestgroup.customerQuantityOfAge50To59Ratio,
                color: '#4141C9'
            };
            var age60ToMoreObj = {
                name: '60以上',
                data: self.data.guestgroup.customerQuantityOfAge60ToMoreRatio,
                color: '#F7A35C'
            };
            agePieChartArray.push(ageUnknownObj);
            agePieChartArray.push(age0To19Obj);
            agePieChartArray.push(age20To29Obj);
            agePieChartArray.push(age30To39Obj);
            agePieChartArray.push(age40To49Obj);
            agePieChartArray.push(age50To59Obj);
            agePieChartArray.push(age60ToMoreObj);
        }

        pieChart2 = new wxCharts({
            animation: true,
            canvasId: 'pieChart2',
            type: 'pie',
            series: agePieChartArray,
            width: windowWidth,
            height: windowWidth * 0.68,
            dataLabel: true,
        });
    },

    //客群分析数据图表3 -  身份
    loadGuestGroupIdentityPieChart: function () {
        let self = this;
        let windowWidth = self.getWindowWidth();

        var identityPieChartArray = new Array();
        if(self.data.guestgroup.guestGroupIdentityDefaultFlag){
            identityPieChartArray.push(self.buildGuestGroupPieChartDefaultData(self.data.noDataPieChartColor));
        }else{
            var  identityMemberObj = {
                name: '会员',
                data: self.data.guestgroup.customerQuantityOfIdentityMemberRatio,
                color: '#7CB5EC'
            };
            var  identityNotMemberObj = {
                name: '非会员',
                data: self.data.guestgroup.customerQuantityOfIdentityNotMemberRatio,
                color: '#434348'
            };
            identityPieChartArray.push(identityMemberObj);
            identityPieChartArray.push(identityNotMemberObj);
        }

        pieChart3 = new wxCharts({
            animation: true,
            canvasId: 'pieChart3',
            type: 'pie',
            series: identityPieChartArray,
            width: windowWidth,
            height: windowWidth * 0.60,
            dataLabel: true,
        });
    },

    /**
     * 构建饼图数据列
     */
    buildGuestGroupPieChartDefaultData:function(color){
        return  {
            name: '暂无查询数据',
            data: 1,
            color: color,
        };
    }

    /**================================客群 end ===================================*/
});