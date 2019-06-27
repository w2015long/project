const util = require('../../../utils/util.js');
Page({
    data: {
        sucscribe: {                     //page对象
            recordsFiltered: 0,
            data: [],
            page: 0,
            size: 10
        },
        isLastReqFin: true,                 //上次请求是否结束
        searchParam: {
            searchString: "",                      //会员名称  会员手机号  操作人
            page: 0,                            //页码
            size: 10,                           //每页大小
        }
    },

    onLoad: function () {
        const self = this;
        self.loadData();
    },
    /**
     * 判断是否还有下一页
     */
    isHaveNextPage: function () {
        const self = this;
        const sucscribe = self.data.sucscribe;
        return sucscribe.size * (sucscribe.page + 1) < sucscribe.recordsFiltered;
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
                url: "medicationReminder/pageXCXClerkMemberMedicationsSubscribe",
                data: self.data.searchParam,
            }, res => {
                //加载更多为拼接 否则覆盖
                let sucscribe = {
                    page: res.data.page,
                    size: res.data.size,
                    recordsFiltered: res.data.recordsFiltered,
                    data: isLoadMore ? self.data.sucscribe.data.concat(res.data.data) : res.data.data
                };
                self.setData({
                    sucscribe: sucscribe,
                    isLastReqFin: true,
                    isShowLoadMore: false
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
                ["searchParam.page"]: self.data.searchParam.page + 1
            }, () => self.loadData(true));
        }
    },
    /**
     * 搜索
     */
    searchFun: function (e) {
        const self = this;
        self.setData({["searchParam.searchString"]: e.detail.value},
            () => self.loadData())
    },
    /**
     * 是否发送 开关
     */
    switch1Change: function (e) {
        const self = this;
        let isOn = e.detail.value ? "Y" : "N";
        let index = e.target.id;
        let subscribeId = self.data.sucscribe.data[index].subscribeId;
        util.doRequest({
            url: "medicationReminder/updateXCXClerkMemberMedicationsSubscribe",
            data: {subscribeId: subscribeId, isOn: isOn},
            method: "POST"
        }, res => {

        })
    },
});
