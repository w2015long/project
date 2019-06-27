const app = getApp();
const util = require('../../../../utils/util.js');
var a = 0;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        winHeight: app.globalData.windowHeight,
        winWidth: app.globalData.windowWidth,
        buttons: [
            "全部", "待处理", "已取消", "配送中", "已完成"
        ],
        modalData: [
            {title: "锁定"},
            {title: "待处理"},
            {title: "订单取消"},
            {title: "京东已收款"},
            {title: "超时未支付系统取消"},
            {title: "系统取消订单"},
            {title: "等待付款"},
            {title: "等待出库"},
            {title: "已付款"},
            {title: "配送中"},
            {title: "已妥投"},
            {title: "已完成"},
        ],
        tabIndex: 0,                                //tab下的订单状态下标
        modalIndex: null,                           //模态框下的订单状态下标
        isShowModal: true,                          //是否显示模态框
        isLastReqFin: true,                         //上次请求是否结束
        searchParams: {                             //搜索参数
            page: 0,
            size: 10,
            orderStatus: ''
        },
        pageJdOrder: {                               //京东订单page数据
            page: 0,
            size: 10,
            recordsFiltered: 0,
            content: [],
        },
    },

    /**
     *  顶部导航栏点击触发事件
     */
    onchangeTab: function (e) {//按钮点击事件
        let self = this;
        let status = '';
        let index = 0;
        let modalIndex = 999;
        switch (e.target.id) {
            case "btn0":
                status = '';
                index = 0;
                break;
            case "btn1":
                status = '41000';
                index = 1;
                modalIndex = 1;
                break;
            case "btn2":
                status = '20020';
                index = 2;
                modalIndex = 2;
                break;
            case "btn3":
                status = '33040';
                index = 3;
                modalIndex = 9;
                break;
            case "btn4":
                status = '90000';
                index = 4;
                modalIndex = 11;
                break;
            default:
                break;
        }
        self.setData({
            isShowModal: true,
            tabIndex: index,
            modalIndex: modalIndex,
            ["searchParams.page"]: 0,
            ["searchParams.orderStatus"]: status
        }, () => {
            self.pageJdOreder()
        });
    },


    //控制模态框是否隐藏
    actonModal: function () {
        let self = this;
        self.setData({
            isShowModal: !self.data.isShowModal
        })
    },


    //模态框内的搜索状态点击事件
    onModelItemsSelsect: function (e) {
        let subscript = e.currentTarget.id;
        let self = this;
        let status = '';
        let index = 0;
        let buttonsIndex = 999;
        switch (subscript) {
            case "0":
                status = '20010';
                index = 0;
                break;
            case "1":
                status = '41000';
                index = 1;
                buttonsIndex = 1;
                break;
            case "2":
                status = '20020';
                index = 2;
                buttonsIndex = 2;
                break;
            case "3":
                status = '34000';
                index = 3;
                buttonsIndex = 2;
                break;
            case "4":
                status = '20040';
                index = 4;
                break;
            case "5":
                status = '20060';
                index = 5;
                break;
            case "6":
                status = '31000';
                index = 6;
                break;
            case "7":
                status = '32000';
                index = 7;
                break;
            case "8":
                status = '31020';
                index = 8;
                break;
            case "9":
                status = '33040';
                index = 9;
                buttonsIndex = 3;
                break;
            case "10":
                status = '33060';
                index = 10;
                break;
            case "11":
                status = '90000';
                index = 11;
                buttonsIndex = 4;
                break;
            default:
                break;
        }

        self.setData({
            modalIndex: index,
            tabIndex: buttonsIndex,
            ["searchParams.page"]: 0,
            ["searchParams.orderStatus"]: status,
            isShowModal: true
        });
        self.pageJdOreder();

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        self.pageJdOreder();
    },


    // 分页加载京东订单：
    pageJdOreder: function (isLoadMore) {
        const self = this;
        self.setData({
            isLastReqFin: false
        }, () => {
            util.doRequest({
                url: 'jdO2oOrder/pageJdOrdersList',
                method: 'GET',
                data: self.data.searchParams,
            }, res => {
                for (let i = 0; i < res.data.data.length; i++) {
                    let obj = res.data.data[i];
                    obj.orderTountDouble = obj.orderBuyerPayableMoneyDouble + obj.orderReceivableFreightDouble - obj.orderDiscountMoneyDouble;
                    obj.orderTountDouble = obj.orderTountDouble.toFixed(2);
                    obj.orderBuyerPayableMoneyDouble = obj.orderBuyerPayableMoneyDouble.toFixed(2);
                    obj.orderReceivableFreightDouble = obj.orderReceivableFreightDouble.toFixed(2);
                    obj.orderDiscountMoneyDouble = obj.orderDiscountMoneyDouble.toFixed(2);
                }

                //加载更多为拼接 否则覆盖
                let pageJdOrder = {
                    page: res.data.page,
                    size: res.data.size,
                    recordsFiltered: res.data.recordsFiltered,
                    content: isLoadMore ? self.data.pageJdOrder.content.concat(res.data.data) : res.data.data
                };
                self.setData({
                    pageJdOrder: pageJdOrder,
                    isLastReqFin: true,
                });
                console.log(self.data);
            })
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
            self.pageJdOreder(true);
        }
    },
    /**
     * 是否还有下一页
     */
    isHaveNextPage: function () {
        let self = this;
        const pageJdOrder = self.data.pageJdOrder;
        return pageJdOrder.size * (pageJdOrder.page + 1) < pageJdOrder.recordsFiltered;
    },

    /**
     * 跳转到京东订单详情页面
     */
    jumpJdO2oOrderDetails: function (e) {
        let self = this;
        let index = e.currentTarget.id;
        let number = Math.abs(index);
        const orderObj = this.data.pageJdOrder.content[number];
        util.privateNavigateTo('../jdO2oOrderDetails/jdO2oOrderDetails?jdO2oOrderId='+orderObj.jdO2oOrderId);
    },
});