const util = require('../../../utils/util.js');
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		buttons: [
			"近三个月", "近半年", "近一年"
		],
    tabDay:[90,180,365],
		tabIndex: 0,
		winWidth: wx.getSystemInfoSync().windowWidth,
		winHeight: wx.getSystemInfoSync().windowHeight,
		isShowModal: false,
    isLastReqFin: true,                             //上次请求是否结束
		searchParam:{									                  // 请求参数
			page:0,											                  // 分页
			size:10,										                  // 大小
      dayNumber:90									                // 天数
		},
		pageParameters:{                                // 响应的数据page
		    page:0,
        size:10,
        data:[],
        recordsFiltered:0,                          // 总数据大小
    },

	},
	/**
   * 切换tab
   */
	onchangeTab: function (e) {//按钮点击事件
		const self = this;
    let index = parseInt(e.currentTarget.id.split('btn')[1]);
    self.setData({
      tabIndex: index,
      ['searchParam.dayNumber']: self.data.tabDay[index],
      ['searchParam.page']:0,
    },()=>self.loadData());
	
  },
  /**
   * 请求后台加载数据
   * @param isLoadMore 是否加载更多
   */
  loadData: function (isLoadMore){
    const self = this;
    self.setData({
      isLastReqFin: false
    }, () => {
    util.doRequest({
      url:'shopAnalyzeReport/pageAnalyzeMemberContribution',
      method:'POST',
      data: self.data.searchParam
    },(res)=>{
        // 替换金额加小数点
      for (let i = 0; i < res.data.data.length; i++){
        let consumeRank = res.data.data[i];
        consumeRank.consumeAmountDouble = consumeRank.consumeAmountDouble.toFixed(2);
        if (null===consumeRank.orderQuantity){
          consumeRank.orderQuantity = 0;
        }
      }
       //加载更多为拼接 否则覆盖
        let pageParameters = {
          page:res.data.page,
          size:res.data.size,
          recordsFiltered: res.data.recordsFiltered,
          data: isLoadMore ? self.data.pageParameters.data.concat(res.data.data) : res.data.data,
        };
        self.setData({
          isLastReqFin: true,
          pageParameters: pageParameters,
        })
    })
    });
  },

  /**
    * 上滑加载更多
    */
  pullUpLoad: function () {
    console.log("加载了一次....")
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
    const pageParameters = self.data.pageParameters;
    return pageParameters.size * (pageParameters.page + 1) < pageParameters.recordsFiltered;
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {   
    this.loadData();
	},


})