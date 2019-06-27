Component({
    properties: {//组件内部属性
        modalHidden: {
            type: Boolean,
            value: true
        },
        modalTitle:{
          type:String,
          value:'系统提示'
        }
    },
    data: {//组件内部的数据
        text: "text"
    },
    methods: {//组件内部的方法
        modal_click_hidden: function () {
            this.setData({
                modalHidden: true
            });
        },
        sure: function () {
            this.setData({
                modalHidden: true
            });
            console.log(this.data.text);
        }
    }
});