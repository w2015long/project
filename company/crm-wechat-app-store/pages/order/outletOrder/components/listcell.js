// pages/components/cell/listcell.js
const util = require('../../../../utils/util.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持  
  },
  /**
   * 组件的属性列表
   */
  properties: {
    cellData: {
      type: Object,
      value: {}
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表1
   */
  methods: {
    selectItem: function (e) {
      let id = e.currentTarget.id;
      console.log(id);
      util.privateNavigateTo('../outletOrderDetails/outletOrderDetails?orderId=' + id);
    }
  }
})
