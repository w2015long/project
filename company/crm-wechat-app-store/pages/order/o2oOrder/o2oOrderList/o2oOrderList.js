const util = require('../../../../utils/util.js');
Page({
    data: {
        tabs: ["待付款", "待发货", "已发货", "已完成", "已关闭"],
        tabCode: ["UNPAID", "WAIT_SEND", "SEND", "FINISH", "CLOSE"],
        pageO2oOrder: {                     //page对象
            recordsFiltered: 0,
            data: [],
            page: 0,
            size: 10
        },
        tabIndex: 0,                        //当前tab下标
        showRemarkModel: false,             //是否展示备注弹窗,默认弹窗
        isLastReqFin: true,                 //上次请求是否结束
        searchParam: {
            orderState: "UNPAID",               //订单状态
            isComment: "",                      //是否评价
            page: 0,                            //页码
            size: 10,                           //每页大小
        },
        remark: "",                              //当前打开弹框的备注
        orderId: null,                           //当前选中的orderId
        height : 0
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
            ["searchParam.orderState"]: self.data.tabCode[index],
            ["searchParam.page"]: 0,
        }, () => self.loadData());
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
        const pageO2oOrder = self.data.pageO2oOrder;
        return pageO2oOrder.size * (pageO2oOrder.page + 1) < pageO2oOrder.recordsFiltered;
    },

    /**
     * 加载数据
     * @param isLoadMore 是否加载更多
     */
    loadData: function (isLoadMore) {
        //TODO:caixuan 上滑加载更多转圈样式待调整
        const self = this;
        self.setData({
            isLastReqFin: false
        }, () => {
            util.doRequest({
                url: "order/o2oPageOrder",
                data: self.data.searchParam
            }, res => {
                //加载更多为拼接 否则覆盖
                let pageO2oOrder = {
                    page: res.data.page,
                    size: res.data.size,
                    recordsFiltered: res.data.recordsFiltered,
                    data: isLoadMore ? self.data.pageO2oOrder.data.concat(res.data.data) : res.data.data
                };
                self.setData({
                    pageO2oOrder: pageO2oOrder,
                    isLastReqFin: true,
                    isShowLoadMore: false
                });
            })
        });
    },

    /**
     * 页面加载设置当前状态
     */
    onLoad: function (options) {
        const self = this;
        let initIndex = Number(options.state || 0);


        // 获取用户屏幕尺寸
        let height = 0;
        let barheight = 0;
        wx.getSystemInfo({
            success:function(res){
                height = res.screenHeight;
                barheight=res.statusBarHeight;
            }
        });
        height = height - barheight - 100 ;

        self.setData({
            height: height,
            tabIndex: initIndex,
            ['searchParam.orderState']: self.data.tabCode[initIndex]
        }, () => {
            self.loadData();
        })
    },

    selectItemDetail: function () {
        wx.navigateTo({
            url: './wshop-orderDetail?state=' + this.data.tabIndex,
        })
    },

    setTenantMark: function (e) {
        this.setData({
            orderId: e.detail.orderId,
            showRemarkModel: true,
        })
    },

    printReceipt: function () {
        wx.navigateTo({
            url: './option-wshop?title=打印小票',
        })
    },

    senderProduct: function () {
        wx.navigateTo({
            url: './option-wshop?title=订单发货',
        })
    },

    checkLogistics: function () {
        wx.navigateTo({
            url: '../pat-orders/operation-pat?state=4',
        })
    },

    endInput: function (e) {
        this.setData({
            showRemarkModel: false
        })
    },

    /**
     * 更新输入框的值
     * @param e
     */
    updateRemarkValue: function (e) {
        this.setData({remark: e.detail.value})
    },
    /**
     * 修改备注
     */
    updateRemark: function () {
        const self = this;
        util.doRequest({
            url: "order/updateAdminRemark",
          data: { orderId: self.data.orderId, adminRemark: self.data.remark}
        }, res => {
            self.setData({
                ["searchParam.page"]: 0,
            }, () => self.loadData());

        })
    }


});