const util = require('../../../../utils/util.js');
var startX = 0;
var startY = 0;
var touchMoveX = 0;
var touchMoveY = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',//订单id
        orderNum: '',//订单编号
        receiverAddr: '',//收货地址
        indexOne: [],//记录编辑第几件商品
        batchList: [],//商品项
        orderNumber: 1,//商品数量
        btnBack: 'btn-back',//确认发货按钮颜色控制
        startPoint: [0, 0],
        showCustomModel: false,
        delLeft: 0,
        startX: 0, //开始坐标
        startY: 0,
        lotNums: [],
        weight: 1000,
        logisticsCompanyName: "",
        logisticsCompanyCode: "",
        wechatLogistics: {},
        isSelfExtract: "N"
    },
    /**
     * 选择物流公司
     */
    selectLogistic: function (e) {
        let logisticsCompanyName = e.currentTarget.dataset.logisticsCompanyName;
        let logisticsCompanyCode = e.currentTarget.dataset.logisticsCompanyCode;
        this.setData({logisticsCompanyName: logisticsCompanyName, logisticsCompanyCode: logisticsCompanyCode});
    },
    /**
     * 改变 重量
     */
    changeWeight: function (e) {
        this.setData({weight: e.detail.value});
    },
    /**
     * 手动输入批号
     */
    quantityInput: function (e) {
        const batchlistindex = e.currentTarget.dataset.batchlistindex;
        const sendbatchindex = e.currentTarget.dataset.sendbatchindex;
        let batchList = this.data.batchList;
        if (e.detail.value > batchList[batchlistindex].quantity) {
            util.showToast("数值大于购买商品数量！", "none");
            return;
        }
        batchList[batchlistindex].sendBatchList[sendbatchindex].quantity = e.detail.value;
        this.setData({
            batchList: batchList,
        });
    },
    /**
     * 删除批号
     */
    delBind: function (e) {
        let index = e.currentTarget.dataset.lotindex;
        if (this.data.modelOrderItem.sendBatchList.length < 2) {
            util.showToast("至少要填一个批号！", "none");
            return;
        }
        this.data.modelOrderItem.sendBatchList.splice(index, 1);
        this.setData({
            modelOrderItem: this.data.modelOrderItem
        })
    },
    /**
     * 填写批号
     */
    batchNumberInput: function (e) {
        const batchlistindex = e.currentTarget.dataset.batchlistindex;
        const sendbatchindex = e.currentTarget.dataset.sendbatchindex;
        let batchList = this.data.batchList;
        batchList[batchlistindex].sendBatchList[sendbatchindex].batchNumber = e.detail.value;
        this.setData({
            batchList: batchList,
        });
    },
    /**
     * 控制弹窗
     */
    switchModel: function () {
        this.setData({
            showCustomModel: !this.data.showCustomModel
        })
    },

    /**
     * 添加批号 商品列表
     */
    addLotNum: function (e) {
        const batchlistindex = e.currentTarget.dataset.batchlistindex;
        let batchList = this.data.batchList;
        let sendBatchList = batchList[batchlistindex].sendBatchList;
        const num = batchList[batchlistindex].quantity;
        var counts = 0;
        sendBatchList.map((item, index) => {//循环统计已填商品数量
            counts = counts + parseInt(item.quantity);
        });
        if (counts >= num) {
            util.showToast("请减少其他批号数量！", "none");
            return;
        }
        let batchNumber = e.currentTarget.dataset.productBatchNumbers[sendBatchList.length];
        sendBatchList.push({
            orderId: this.data.orderId,
            orderItemId: batchList[batchlistindex].orderItemId,
            batchNumber: batchNumber,
            quantity: 1,
            productId: batchList[batchlistindex].productId
        });
        this.setData({batchList: batchList})
    },
    /**
     * 减  数量
     */
    reduce: function (e) {
        const batchlistindex = e.currentTarget.dataset.batchlistindex;
        const sendbatchindex = e.currentTarget.dataset.sendbatchindex;
        let batchList = this.data.batchList;
        let counts = 0;
        batchList[batchlistindex].sendBatchList.map((item, index) => {//循环统计已填商品数量
            counts = counts + parseInt(item.quantity);
        });
        if (counts <= 1) {
            util.showToast("数量不能低于1！", "none");
            return;
        }
        let quantity = batchList[batchlistindex].sendBatchList[sendbatchindex].quantity - 1;
        if (quantity) {
            batchList[batchlistindex].sendBatchList[sendbatchindex].quantity = quantity;
        } else {
            // 删除该批次号
            batchList[batchlistindex].sendBatchList.splice(sendbatchindex, 1);
        }
        this.setData({
            batchList: batchList,
        })
    },
    /**
     * 加 数量
     */
    plus: function (e) {
        const batchlistindex = e.currentTarget.dataset.batchlistindex;
        const sendbatchindex = e.currentTarget.dataset.sendbatchindex;
        let batchList = this.data.batchList;
        const num = batchList[batchlistindex].quantity;
        var counts = 0;
        batchList[batchlistindex].sendBatchList.map((item, index) => {//循环统计已填商品数量
            counts += parseInt(item.quantity);
        });
        if (counts >= num) {
            util.showToast("不能大于商品数量[" + num + "]！", "none");
            return;
        }

        batchList[batchlistindex].sendBatchList[sendbatchindex].quantity = parseInt(batchList[batchlistindex].sendBatchList[sendbatchindex].quantity) + 1;
        this.setData({
            batchList: batchList,
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        util.doRequest({
            url: 'order/weChatOrdersSend',
            data: {
                "orderId": options.orderId
            },
            method: 'GET'
        }, res => {
            res.data.orderItems.map((item, index) => {//循环每件商品，且初始一条批号
                const sendBatchList = item.sendBatchList;
                this.data.batchList.push({
                    orderItemId: item.orderItemId, quantity: item.quantity, productId: item.productId,
                    fileId: item.fileId,
                    productName: item.productName,
                    spec: item.spec,
                    unit: item.unit,
                    productCode: item.productCode,
                    sendBatchList: sendBatchList,
                    productBatchNumbers: item.productBatchNumbers
                });
            });
            this.setData({//获取初始化数据
                orderId: res.data.orderId,
                orderNum: res.data.orderNum,
                receiverAddr: res.data.receiverAddr,
                logisticsCompanyName: res.data.logisticsCompanyName,
                logisticsCompanyCode: res.data.logisticsCompanyCode,
                weight: res.data.weight,
                wechatLogistics: res.data.wechatLogistics,
                isSelfExtract: res.data.isSelfExtract,
                selfExtractNum: res.data.selfExtractNum,
                batchList: this.data.batchList,
            })
        })
    },

    /**
     * 校验是否有误
     */
    formSubmit: function () {
        let batchList = this.data.batchList;
        for (let i = 0; i < batchList.length; i++) {
            const num = batchList[i].quantity;//获取当前商品总数量
            let counts = 0;
            batchList[i].sendBatchList.map((item, index) => {//循环统计已填商品数量
                console.log(item.batchNumber);
                if (!item.batchNumber) {
                    util.showToast(batchList[i].productName + "商品第" + (index + 1) + "个批号为空，请填写批号！", "none");
                    return;
                }
                counts = counts + parseInt(item.quantity);
            });

            if (num != counts) {
                util.showToast("您还有[" + (num - counts) + "]件" + batchList[i].productName + "商品未填写批号！", "none");
                return;
            }
            if (num < counts) {
                util.showToast("不能大于商品数量[" + num + "]！", "none");
                return;
            }
        }

        if (this.data.isSelfExtract === "N") {
            if (!this.data.weight) {
                util.showToast("请填写商品重量！", "none");
                return;
            }
            if (!this.data.logisticsCompanyCode) {
                util.showToast("请选择物流公司！", "none");
                return;
            }
        }

        this.confirmSend();
    },
    /**
     * 发货
     */
    confirmSend: function () {
        const data = this.data;


        util.showModal("提示", "确定发货吗？", () => {
            util.doRequest({
                url: 'order/updateSendOrder',
                data: {
                    "orderId": data.orderId,
                    "orderNum": data.orderNum,//订单编号
                    "orderItems": data.batchList,//发货批号
                    "weight": data.weight,//重量
                    "logisticsCompanyCode": data.logisticsCompanyCode//物流公司
                },
                method: 'POST'
            }, res => {
                util.showToast("发货成功！");
                setTimeout(function () {
                    util.privateNavigateTo("/pages/order/o2oOrder/o2oOrderList/o2oOrderList?state=1");
                }, 1000);
            })
        }, null);
    },
    viewTouchMove: function (e) {
        var that = this;

        var index = e.currentTarget.dataset.tag,//当前索引
            startX = that.data.startX;//开始X坐标
        startY = that.data.startY;//开始Y坐标
        touchMoveX = e.changedTouches[0].clientX;//滑动变化坐标
        touchMoveY = e.changedTouches[0].clientY;//滑动变化坐标
        var angle = that.angle({X: startX, Y: startY}, {X: touchMoveX, Y: touchMoveY});

        that.data.modelOrderItem.sendBatchList.forEach(function (v, i) {

            v.isTouchMove = false;
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {

                if (touchMoveX > startX) //右滑
                {
                    v.isTouchMove = false
                }
                else //左滑
                {
                    v.isTouchMove = true
                }
            }
        });
        that.setData({
            modelOrderItem: that.data.modelOrderItem
        })
    },


    viewTouchStart: function (e) {
        let tag = e.currentTarget.dataset.tag;
        this.data.modelOrderItem.sendBatchList.forEach(function (v, i) {

            if (v.isTouchMove)//只操作为true的
                v.isTouchMove = false;

        });

        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
        })
    },
    viewTouchEnd: function (e) {
    },

    angle: function (start, end) {
        var _X = end.X - start.X;
        var _Y = end.Y - start.Y;
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);

    },

    /**
     * 选择批次号
     */
    bindProductBatchNumber: function (e) {
        const batchlistindex = e.currentTarget.dataset.batchlistindex;
        const sendbatchindex = e.currentTarget.dataset.sendbatchindex;
        const productBatchNumbersIndex = e.detail.value;
        let batchList = this.data.batchList;
        let productBatchNumber = batchList[batchlistindex].productBatchNumbers[productBatchNumbersIndex];
        for (let i = 0; i < batchList[batchlistindex].sendBatchList.length; i++) {
            if (batchList[batchlistindex].sendBatchList[i].batchNumber === productBatchNumber) {
                console.log(batchList[batchlistindex].sendBatchList[i].batchNumber);
                util.showToast("该批号已存在！", "none");
                return;
            }
        }
        batchList[batchlistindex].sendBatchList[sendbatchindex].batchNumber = productBatchNumber;
        this.setData({batchList: batchList});
    }
});