const util = require('../../../utils/util.js');
Page({
    data: {
        pageWeChatPromoteActivity: {                     //page对象
            recordsFiltered: 0,
            data: [],
            page: 0,
            size: 10
        },
        isLastReqFin: true,                 //上次请求是否结束
        searchParam: {
            page: 0,                            //页码
            size: 3,                           //每页大小
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const self = this;
        // 从后台获取列表
        self.loadData();
    },

    /**
     * 上滑加载更多
     */
    pullUpLoad: function () {
        console.log("上滑加载更多");
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
        const pageWeChatPromoteActivity = self.data.pageWeChatPromoteActivity;
        return pageWeChatPromoteActivity.size * (pageWeChatPromoteActivity.page + 1) < pageWeChatPromoteActivity.recordsFiltered;
    },

    /**
     * 加载数据
     * @param isLoadMore 是否加载更多
     */
    loadData: function (isLoadMore) {
        const self = this;
        self.setData({
            isLastReqFin: false
        }, () => {
            util.doRequest({
                url: "promotionActivities/pageWeChatPromoteActivity",
                data: self.data.searchParam
            }, res => {
                //加载更多为拼接 否则覆盖
                let pageWeChatPromoteActivity = {
                    page: res.data.page,
                    size: res.data.size,
                    recordsFiltered: res.data.recordsFiltered,
                    data: isLoadMore ? self.data.pageWeChatPromoteActivity.data.concat(res.data.data) : res.data.data
                };
                self.setData({
                    pageWeChatPromoteActivity: pageWeChatPromoteActivity,
                    isLastReqFin: true
                });
            })
        });
    },
});