// pages/test/orders/components/pat-cell.js
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
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        optionUrl: ''
    },

    attached: function () {
    },


    /**
     * 组件的方法列表
     */
    methods: {
        selectItem: function () {
            this.triggerEvent("action");
        },
        opreateMedchine: function () {
            this.triggerEvent("opreate");
        },
        sellerMark: function () {
            console.log(this.data.cellData);
            this.triggerEvent("mark", {cellData: this.data.cellData});
        }
    }
});
