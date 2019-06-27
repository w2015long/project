const util = require('../../../utils/util.js');
Page({
	/**
	 * 页面的初始数据
	 */
    data: {
        winWidth: wx.getSystemInfoSync().windowWidth,
        winHeight: wx.getSystemInfoSync().windowHeight,
        tabs: ["已售罄", "预计3天后售罄", "预计5天后售罄"],
        tabsCode: [0, 3, 5],
        tabIndex: 0,                            //当前tab下标
        isLastReqFin: true,                     //上次请求是否结束
        isCurrentConditionsPage:false,          //是否当前条件分页
        pageShortageData: {                     //缺货分析的page对象
            page: 0,
            size: 10,
            data: [],
            recordsFiltered: 0,
        },
        searchParam:{                           //搜索参数
            page:0,
            size:10,
            sellOutTime:0,
        }
    },

    /**
     * 切换tab - 按钮点击事件
     * @param e
     */
    onchangeTab: function (e) {
        const self = this;
        let index = parseInt(e.currentTarget.id.split("tab")[1]);
        self.setData({
            tabIndex: index,
            ["searchParam.sellOutTime"]: self.data.tabsCode[index],
            ["searchParam.page"]: 0,
        },()=>self.loadPageShortageData());
    },

    selectItemDetail: function () {
        wx.navigateTo({
          url: '../orderDetails/orderDetails',
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        let self = this;
        self.loadPageShortageData();
    },


    /**
     * 加载缺货分析的分页数据
     */
    loadPageShortageData:function(){
        let self = this;
        self.setData({
            isLastReqFin: false
        }, () => {
            util.doRequest({
                url: "shopAnalyzeReport/pageShopSkuStockoutByShopId",
                data: self.data.searchParam,
                method:'POST'
            }, res => {
                let isCurrentConditionsPage = self.data.isCurrentConditionsPage;
                self.setData({
                    isLastReqFin: true,                 //加载完成
                    isCurrentConditionsPage: false,     //是否为当前条件下分页。默认 false.
                    pageShortageData:{                  //分页数据
                        page: res.data.page,
                        size: res.data.size,
                        data: isCurrentConditionsPage ? self.data.pageShortageData.data.concat(res.data.data) : res.data.data,
                        recordsFiltered: res.data.recordsFiltered,
                    }
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
                isCurrentConditionsPage:true,//表明是当前条件下的分页
                ["searchParam.page"]: self.data.searchParam.page + 1
            }, () => self.loadPageShortageData());
        }
    },

    /**
     * 判断是否还有下一页
     */
    isHaveNextPage: function () {
        const self = this;
        const pageShortageData = self.data.pageShortageData;
        return pageShortageData.size * (pageShortageData.page + 1) < pageShortageData.recordsFiltered;
    },

});