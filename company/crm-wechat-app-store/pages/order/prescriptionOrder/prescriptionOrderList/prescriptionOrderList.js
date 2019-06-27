const app = getApp();
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buttons: [
            "待调配", "待煎煮", "待包装", "待发货", "已发货", "已完成"
        ],
        tabIndex: 0,
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 100,
        show: false,
        showAlertView: false,
        scrollTop: 0,
        isForLeft: true,
        winWidth: app.globalData.windowWidth,
        isLastReqFin: true,                 //上次请求是否结束
        params: {},
        page: 0,
        size: 3,
        recordsFiltered: 0,
        contentDatas: [],
        remarkParam: {prescriptionOrderId: 0, orderStat: "", merchantsRemark: ""},
    },

    /**
     * 返回该页面前更新列表 zhongzheng
     * index：参考onchangeTab()对应的值
     */
    returnData: function (index) {
        if (!index) {
            return;
        }
        const self = this;
        self.setData({tabIndex: index});
        self.loadPageMember(index, 0);
    },

    onchangeTab: function (e) {//按钮点击事件
        var index = 0;
        switch (e.target.id) {
            case "btn0":
                index = 0;
                break;
            case "btn1":
                index = 1;
                break;
            case "btn2":
                index = 2;
                break;
            case "btn3":
                index = 3;
                break;
            case "btn4":
                index = 4;
                break;
            case "btn5":
                index = 5;
                break;
            default:
                break;
        }
        const self = this;
        self.setData({tabIndex: index, contentDatas: []});
    },
    onchangeSection: function (e) {
        var index = 0;
        switch (e.currentTarget.id) {
            case "sec0":
                index = 0;
                break;
            case "sec1":
                index = 1;
                break;
            case "sec2":
                index = 2;
                break;
            case "sec3":
                index = 3;
                break;
            case "sec4":
                index = 4;
                break;
            case "sec5":
                index = 5;
                break;
            default:
                break;
        }
        const self = this;
        self.setData({tabIndex: index});

    },

    swiperScreen: function (e) {//swiper切屏事件
        this.setData({
            tabIndex: e.detail.current
        });
        if (e.detail.current == 3) {
            if (this.data.isForLeft) {//从左边往右边滑动swiper到4这个位置，让scroll-view滑动到最大位置，使其他到tab可以看见
                let self = this;
                self.setData({
                    scrollTop: this.data.winWidth,
                    isForLeft: false
                });
            }

        }
        if (!this.data.isForLeft && e.detail.current == 2) {//从右边往左边滑动swiper到3这个位置，让scroll-view滑动到最大位置，使其他到tab可以看见
            let self = this;
            self.setData({
                scrollTop: 0,
                isForLeft: true
            });
        }

        const self = this;
        self.setData({contentDatas: []});
        self.loadPageMember(e.detail.current, 0);
    },

    selectItemDetail: function (e) {
        const self = this;
        //拿到集合中对应的对象的下标
        let index = e.currentTarget.id;
        let number = Math.abs(index);
        //获取对象
        const orderObj = self.data.contentDatas[number];

        console.log(orderObj);
        wx.navigateTo({
            url: '../prescriptionOrderDetail/prescriptionOrderDetail?prescriptionOrderId=' + orderObj.prescriptionOrderId,
        })
    },

    //根据处方订单状态跳转页面统一入口
    prescriptionOrderStateUnifiedEntrance: function (e) {
        let self = this;
        //拿到集合中对应的对象的下标
        let index = e.currentTarget.id;
        let number = Math.abs(index);
        //获取对象
        const orderObj = self.data.contentDatas[number];
        if (this.data.tabIndex === 2) {
            wx.showModal({
                title: '',
                content: '确认药品是否包装？',
                cancelText: '取消',
                confirmText: '确定',
                success: function (result) {
                        util.doRequest({
                            url: 'prescriptionOrder/prescriptionOrderPacking',
                            data: {
                              "prescriptionOrderId": orderObj.prescriptionOrderId //订单id
                            },
                            method: 'GET'
                        }, res => {
                                self.returnData(2);
                            util.showToast("成功 完成包装!");
                        })
                },
                fail: function (err) {

                }
            })
        } else {
            /* 其他订单状态在这里处理 */

            //把对象存放在内存中(以键值的形式存放)，在目标的js中把对象拿出来  const data = wx.getStorageSync("orderObj"); 清除对象 wx.removeStorageSync("orderObj");
            wx.setStorageSync('orderObj', orderObj);
            if (orderObj.orderStat === '待煎煮') {
                util.privateNavigateTo('../prescriptionOrderDecoction/prescriptionOrderDecoction');
            }
            if (orderObj.orderStat === '待发货') {
                util.privateNavigateTo('../prescriptionOrderSend/prescriptionOrderSend');
            }
            if (orderObj.orderStat === '待调配') {
              util.privateNavigateTo('../deployDrug/deployDrug');
            }
        }

    },

    showTabItems: function () {
        let isshow = !this.data.show;
        this.setData({
            show: isshow
        })
    },

    /**
     * 显示商家备注框前调用该函数
     */
    sellerMark: function (e) {
        const self = this;
        let cellData = e.detail.cellData;

        // 根据订单状态给reamarkParam 商家备注对象 赋值
        switch (cellData.orderStat) {
            case "待调配":
                self.setData({
                    remarkParam: {
                        prescriptionOrderId: cellData.prescriptionOrderId,
                        orderStat: cellData.orderStat,
                        merchantsRemark: cellData.dispensingRemark
                    }
                });
                break;
            case "待包装":
                self.setData({
                    remarkParam: {
                        prescriptionOrderId: cellData.prescriptionOrderId,
                        orderStat: cellData.orderStat,
                        merchantsRemark: cellData.packRemark
                    }
                });
                break;
            default :
                self.setData({
                    remarkParam: {
                        prescriptionOrderId: cellData.prescriptionOrderId,
                        orderStat: cellData.orderStat,
                        merchantsRemark: ""
                    }
                });
        }

        let isshow = !this.data.show;
        this.setData({
            showAlertView: true,
            show: isshow
        })
    },


    /**
     * 监听商家备注输入
     * @param e
     */
    endInput: function (e) {
        const self = this;
        const remarkParam = self.data.remarkParam;
        self.setData({
            remarkParam: {
                prescriptionOrderId: remarkParam.prescriptionOrderId,
                orderStat: remarkParam.orderStat,
                merchantsRemark: e.detail.value
            }
        });
        self.setData({
            showAlertView: false,
            show: false
        })
    },

    /**
     * 分页加载列表
     */
    loadPageMember: function (state, page) {
        let self = this;
        const params = self.data.params;
        params.page = page;
        params.size = self.data.size;
        params.orderStat = state == null ? "0" : state.toString();
        self.setData({
            isLastReqFin: false
        }, () => {
            util.doRequest({
                url: 'prescriptionOrder/pagePrescriptionOrder',
                method: 'POST',
                data: params
            }, res => {
                for (let i = 0; i < res.data.data.length; i++) {
                    let obj = res.data.data[i];
                  obj.orderTotalAmountDouble = obj.orderTotalAmountDouble === null?0.00:obj.orderTotalAmountDouble.toFixed(2);
                  obj.freightAmountDouble = obj.freightAmountDouble===null?0.00: obj.freightAmountDouble.toFixed(2);
                }

                if (page === 0) {
                    self.setData({contentDatas: []});
                }

                self.setData({
                    isLastReqFin: true,
                    page: page,
                    recordsFiltered: res.data.recordsFiltered,
                    contentDatas: self.data.contentDatas.concat(res.data.data)
                });
            })
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        //  "待调配", "待煎煮", "待包装", "待发货", "已发货", "已完成"  对应 0,1,2,3,4,5
        self.setData({
            tabIndex: Number(options.state || 0)
        });

        // 根据状态获取列表
        self.loadPageMember(options.state, 0);
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    PullDownRefresh: function () {
        const self = this;
        self.setData({contentDatas: []});
        self.loadPageMember(self.data.tabIndex, 0);
    },

    /**
     * 上滑事件（只有在有滚动条的情况下，并且已经滑到底部的时候才能触发）
     */
    pullUpLoad: function () {
        const self = this;
        if (self.data.isLastReqFin && self.isHaveNextPage()) {
            self.loadPageMember(self.data.tabIndex, self.data.page + 1);
        }
    },
    /**
     * 是否还有下一页
     */
    isHaveNextPage: function () {
        let self = this;
        return self.data.size * (self.data.page + 1) < self.data.recordsFiltered;
    },

    /**
     * 修改商家备注 统一处理
     */
    updateMerchantsRemark: function (e) {
        // 获取
        const self = this;
        const params = self.data.remarkParam;
        util.doRequest({
            url: 'prescriptionOrder/updateMerchantsRemark',
            method: 'POST',
            data: params
        }, res => {
            const self = this;
            self.setData({contentDatas: []});
            self.loadPageMember(self.data.tabIndex, 0);
        })
    }
});