const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        toDate:'',               //当前年月
        currentMonth:'',         //当前月份
        balanceDouble: 0,        //门店总金额
        monthIncomeDouble:0,     //本月收入
        monthOutlayDouble:0,     //本月支出
        isLastReqFin: true,                         //上次请求是否结束
        searchParams: {              //搜索参数
            page: 0,
            size: 10,
            searchDate :'',         //搜索时间
        },
        pageList: {               //page对象
            recordsFiltered: 0,
            data: [],
            page: 0,
            size: 10
        },
        height : 0,
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        const self = this;

        // 获取用户屏幕尺寸
        let height = 0;
        let barheight = 0;
        wx.getSystemInfo({
            success:function(res){
                height = res.screenHeight;
                barheight=res.statusBarHeight;
            }
        });
        height = height - barheight - 360 ;

        util.doRequest({
            url: 'shop/shopBonusPool',
            method: 'GET',
        }, res => {
            let shopBonusPoolProtocol = res.data;

            self.setData({
                    height : height,
                    toDate:shopBonusPoolProtocol.toDate,                     //当前年月
                    currentMonth:shopBonusPoolProtocol.currentMonth,         //当前月份
                    balanceDouble: shopBonusPoolProtocol.balanceDouble.toFixed(2),        //门店总金额
                    monthIncomeDouble:shopBonusPoolProtocol.monthIncomeDouble.toFixed(2),     //本月收入
                    monthOutlayDouble:shopBonusPoolProtocol.monthOutlayDouble.toFixed(2),     //本月支出
                    ["searchParams.searchDate"]:shopBonusPoolProtocol.toDate
            },()=>{
                console.log(self.data);
                this.loadData() //加载分页
                }
            );
        })
    },


    /**
     * 加载数据
     * @param isLoadMore 是否是上划事件
     */
    loadData: function (isLoadMore) {
        const self = this;
        self.setData({
            isLastReqFin: false
        }, () => {
            util.doRequest({
                url: "shop/shopBonusPoolList",
                method: 'POST',
                data:self.data.searchParams
            }, res => {
                //处理金钱
                for (let i in res.data.data) {
                    let obj = res.data.data[i];
                    obj.amountDouble = obj.amountDouble.toFixed(2);
                    obj.afterAmountDouble = obj.afterAmountDouble.toFixed(2);
                }
                //加载更多为拼接 否则覆盖
                let pageList = {
                    page: self.data.searchParams.page,
                    size: self.data.searchParams.size,
                    recordsFiltered: res.data.recordsFiltered,
                    data: isLoadMore ? self.data.pageList.data.concat(res.data.data) : res.data.data
                };
                self.setData({
                    pageList: pageList,
                    isLastReqFin: true,
                });
                console.log(self.data.pageList);
            },fail => {
                self.setData({
                    isLastReqFin: true,
                });
            });
        });

    },


    /**
     * 上滑事件（只有在有滚动条的情况下，并且已经滑到底部的时候才能触发）
     */
    pullUpLoad: function () {
        const self = this;
        if (self.data.isLastReqFin && self.isHaveNextPage()) {
            self.setData({
                ["searchParams.page"]: self.data.searchParams.page + 1
            });
            self.loadData(true);
        }
    },
    /**
     * 是否还有下一页
     */
    isHaveNextPage: function () {
        let self = this;
        const pageList = self.data.pageList;
        return pageList.size * (pageList.page + 1) < pageList.recordsFiltered;
    },

    /**
     * 时间选择器
     */
    bindDateChange: function (e) {
        let self =this;
        self.setData({
            ["searchParam.searchDate"]: e.detail.value
        }, () => {
            self.setData({
                isLastReqFin: false
            }, () => {
                util.doRequest({
                    url: "shop/getShopMonthlyBonusBill?dateStr=" + e.detail.value + "&size=" + self.data.searchParams.size,
                    method: 'GET',
                }, res => {
                    //处理金钱
                    for (let i in res.data.shopBonusPoolList.data) {
                        let obj = res.data.shopBonusPoolList.data[i];
                        obj.amountDouble = obj.amountDouble.toFixed(2);
                        obj.afterAmountDouble = obj.afterAmountDouble.toFixed(2);
                    }
                    //加载更多为拼接 否则覆盖
                    let pageList = {
                        page: 0,
                        size: self.data.searchParams.size,
                        recordsFiltered: res.data.shopBonusPoolList.recordsFiltered,
                        data: res.data.shopBonusPoolList.data
                    };
                    self.setData({
                        currentMonth: res.data.month,         //当前月份
                        monthIncomeDouble: res.data.monthIncome.toFixed(2),     //本月收入
                        monthOutlayDouble: res.data.monthOutlay.toFixed(2),     //本月支出
                        pageList: pageList,
                        isLastReqFin: true,
                        ["searchParams.page"]:0
                    });
                    console.log(self.data.pageList);
                }, fail => {
                    self.setData({
                        isLastReqFin: true,
                    });
                });
            })
        });
    },




});