const util = require('../../../../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cellData: {
            type: Object,
            value: {}
        },
        state: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        selectItem: function () {
            this.triggerEvent("action");
        },
        setTenantMark: function (e) {
            console.log(e);
            this.triggerEvent("mark", {
                orderId: e.currentTarget.dataset.orderId
            });
        },
        printReceipt: function () {
            this.triggerEvent("print");
        },
        senderProduct: function (e) {
          let orderId = e.currentTarget.dataset.orderId;
          util.privateNavigateTo("/pages/order/o2oOrder/o2oOrderSend/o2oOrderSend?orderId=" + orderId);
        },
        checkLogistics: function () {
            
        },
        goToOrderDetail: function (e) {
            let orderId = e.currentTarget.dataset.orderId;
            util.privateNavigateTo("/pages/order/o2oOrder/o2oOrderDetail/o2oOrderDetail?orderId="+orderId);
        }
    }
});
