const util = require('../../../utils/util.js');
Page({
    data: {
        tabs: ["今天", "三天内", "半月内"],
        tabCode: ["TODAY", "THREE_DAYS_WITHIN", "HALF_MONTH_WITHIN"],
        pageMedicationReminder: {                     //page对象
            recordsFiltered: 0,
            data: [],
            page: 0,
            size: 10
        },
        tabIndex: 0,                         //当前tab下标
        isLastReqFin: true,                 //上次请求是否结束
        searchParam: {
            dateDays: "TODAY",               // 状态
            page: 0,                            //页码
            size: 10,                           //每页大小
        }
    },

    /**
     * 页面加载设置当前状态
     */
    onLoad: function (options) {
        const self = this;
        self.loadData();
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
     * 判断是否还有下一页
     */
    isHaveNextPage: function () {
        const self = this;
        const pageMedicationReminder = self.data.pageMedicationReminder;
        return pageMedicationReminder.size * (pageMedicationReminder.page + 1) < pageMedicationReminder.recordsFiltered;
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
                url: "medicationReminder/pageXCXClerkMedicationReminder",
                data: self.data.searchParam
            }, res => {
                //加载更多为拼接 否则覆盖
                let pageMedicationReminder = {
                    page: res.data.page,
                    size: res.data.size,
                    recordsFiltered: res.data.recordsFiltered,
                    data: isLoadMore ? self.data.pageMedicationReminder.data.concat(res.data.data) : res.data.data
                };
                self.setData({
                    pageMedicationReminder: pageMedicationReminder,
                    isLastReqFin: true
                });
            })
        });
    },

    /**
     * 切换tab
     * @param e 按钮点击事件
     */
    onchangeTab: function (e) {
        const self = this;
        let index = parseInt(e.target.id.split("tab")[1]);
        self.setData({
            tabIndex: index,
            ["searchParam.dateDays"]: self.data.tabCode[index],
            ["searchParam.page"]: 0,
        }, () => self.loadData());
    },

});