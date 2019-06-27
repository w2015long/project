const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLastReqFin: true,                     //上次请求是否结束
        tabType: "HALF_MONTH_WITHIN",           //渲染tab样式
        searchParam: {
            dateDays : 'HALF_MONTH_WITHIN',     //tab中哪一天
            page: 0,                            //页码
            size: 10,                           //每页大小
        },
        rehabilitationVisitPageList : {         //康复回访分页数据
            recordsFiltered: 0,
            data: [],
            page: 0,
            size: 10
        }
    },

    /**
     * 页面加载时执行
     */
    onLoad: function (options) {
        const self = this;
        self.loadData();
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
                url: "rehabilitationVisit/pageXcxRehabilitationVisit",
                data: self.data.searchParam
            }, res => {
                //加载更多为拼接 否则覆盖
                let rehabilitationVisitPageList = {
                    page: res.data.page,
                    size: res.data.size,
                    recordsFiltered: res.data.recordsFiltered,
                    data: isLoadMore ? self.data.rehabilitationVisitPageList.data.concat(res.data.data) : res.data.data
                };
                self.setData({
                    rehabilitationVisitPageList: rehabilitationVisitPageList,
                    isLastReqFin: true
                });
            })
        });
    },


    //上划时到底部 加载更多
    onPullDownRefresh :function(){
        const self = this;
        if (self.data.isLastReqFin && self.isHaveNextPage()) {
            self.setData({
                ["searchParam.page"]: self.data.searchParam.page + 1
            });
            self.loadData(true);
        }
    },


    /**
     * 判断是否还有下一页
     */
    isHaveNextPage: function () {
        const self = this;
        const rehabilitationVisitPageList = self.data.rehabilitationVisitPageList;
        return rehabilitationVisitPageList.size * (rehabilitationVisitPageList.page + 1) < rehabilitationVisitPageList.recordsFiltered;
    },


    /**
     * 切换tab触发
     */
    changeTab: function (e) {
        const self = this;
        self.setData({
            tabType: e.currentTarget.dataset.id,
            ["searchParam.dateDays"]: e.currentTarget.dataset.id,
            ["searchParam.page"]: 0
        }, () => self.loadData(false));

    },



    /**
     * 跳转到 康复回访-记录回访 详情页面
     */
    jumpRecordVisitDetails: function (e) {
        const self = this;
        let index = e.currentTarget.id;
        let orderId = Math.abs(index);
        util.privateNavigateTo('../recordRehabilitationVisit/recordRehabilitationVisit?orderId='+orderId+'&tabType='+self.data.tabType);
    },


    /**
     * 返回该页面前更新列表
     */
    returnData: function (value) {
        console.log("进来+"+value);
        if (!value) {
            return;
        }
        const self = this;
        self.setData({
            tabType: value,
            ["searchParam.dateDays"]: value,
        });
        self.loadData();
    },

});