const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLastReqFin: true,                     //上次请求是否结束
        searchParam: {
            page: 0,                            //页码
            size: 10,                           //每页大小
            searchTitle: ''                    //搜索内容
        },
        pageList: {                            //分页数据
            page: 0,
            size: 10,
            data: [],
            recordsFiltered: 0
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
                url: "rehabilitationVisit/pageAlreadyRehabilitationVisit",
                method: 'POST',
                data: self.data.searchParam
            }, res => {
                if (res.data.data.length > 0) {
                    for (let i in res.data.data) {
                        let tagsArray = [];
                        let tags = res.data.data[i].estimateTags;
                        if(tags){
                            tagsArray = tags.split(',');
                        }
                        res.data.data[i].estimateTags = tagsArray
                    }
                }



                //加载更多为拼接 否则覆盖
                let pageList = {
                    page: res.data.page,
                    size: res.data.size,
                    recordsFiltered: res.data.recordsFiltered,
                    data: isLoadMore ? self.data.pageList.data.concat(res.data.data) : res.data.data
                };
                self.setData({
                    pageList: pageList,
                    isLastReqFin: true
                });

                console.log(self.data.pageList)
            })
        });
    },


    //上划时到底部 加载更多
    onPullDownRefresh: function () {
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
        const pageList = self.data.pageList;
        return pageList.size * (pageList.page + 1) < pageList.recordsFiltered;
    },


    /**
     * 点击键盘的搜索按钮触发
     */
    searchButton : function (element) {
        const self = this;
        self.setData({
            ["searchParam.searchTitle"]: element.detail.value,
            ["searchParam.page"]: 0
        }, () => self.loadData(false));
    }
});