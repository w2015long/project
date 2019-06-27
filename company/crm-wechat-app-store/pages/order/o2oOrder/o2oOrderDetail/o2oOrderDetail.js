// pages/test/orders/wshop-orders/wshop-orderDetail.js
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderState: '',
    orderNum:'',
    createTimeStr:'',
    memberRemark : '',
    adminRemark : '',
    discountAmount:'',
    productCount : '',
    productTotalAmount:'',
    orderTotalAmount:'',
    sex :'',
    memberLevelName:'',
    memberName:'',
    iconPicture:'',
    mobile:'',
    receiverAddr:'',
    items:[],
    freightAmount:'',
    name:'',
    orderId:0,
    logisticsOrderNum:'',
    logisticsCompanyCode:'',
    hiddenMore: true,
    orderDetail:null,
    orderActualAmount:0,  //订单实付金额
  },
  showMoreProducts:function() {
    this.setData({
      hiddenMore: !this.data.hiddenMore
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.findOrderItem(options.orderId);
  },
  /**
   * 查询订单详情页数据
   */
  findOrderItem: function (orderIds){
    var orderId = orderIds;
    var self =this;
    util.doRequest({
      url: "order/findOrderItem",
      data: { "orderId": orderId }
    },res=>{
      console.log(res.data)
        self.setData({
          orderState: res.data.orderState,
          orderNum : res.data.orderNum,
          createTimeStr: res.data.createTimeStr,
          memberRemark : res.data.memberRemark,
          adminRemark : res.data.adminRemark,
          discountAmount: res.data.discountAmount.toFixed(2),
          productCount : res.data.productCount,
          productTotalAmount: res.data.productTotalAmount.toFixed(2),
          orderTotalAmount: res.data.orderTotalAmount.toFixed(2),
          freightAmount: res.data.freightAmount.toFixed(2),
          sex : res.data.sex,
          memberLevelName: res.data.memberLevelName,
          memberName: res.data.memberName,
          iconPicture: res.data.iconPicture,
          items: res.data.orderItems,
          mobile: res.data.mobile,
          receiverAddr: res.data.receiverAddr,
          name: res.data.name,
          orderId: res.data.orderId,
          logisticsOrderNum: res.data.logisticsOrderNum,
          logisticsCompanyCode: res.data.logisticsCompanyCode,
          orderDetail: res.data,
          orderActualAmount:res.data.orderActualAmount

        })
      if (self.data.adminRemark == null) {
        self.setData({
          adminRemark: '无'
        })
      };
      if (self.data.memberRemark == null) {
        self.setData({
          memberRemark: '无'
        })
      }
      var status = '';
      switch (res.data.orderState){
        case "UNPAID":
          status = "待付款";
          break;
        case "WAIT_SEND":
          status = '待发货';
          break;
        case "SEND":
          status = '已发货';
          break;
        case "FINISH":
          status = '已完成';
          break;
        case "CLOSE":
          status = '已关闭';
          break;
        default:
          break;
      }
      self.setData({
        orderState: status
      })

    })
  },
  
  /**
   * 联系客户
   */
  contactClient:function(){
    var client =  this.data.mobile;
    wx.makePhoneCall({
      phoneNumber: client,
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
  /**
   * 复制地址
   */
  copyAddress:function(){
    var address = this.data.receiverAddr;
    wx.setClipboardData({
      data: address,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) 
          }
        })
      }
    })
  },

  /**
   * 取消订单
   */
  cancelTheList : function(){
    let self = this;
    let orderId = self.data.orderDetail.orderId
    util.showModal(null,"是否确定取消？",() =>{
      util.doRequest({
        url: "order/cancelOrder",
        data: { "orderId": orderId }
      }, res => {
        self.findOrderItem(orderId);
      })
    },null);

    
  },

  /**查看物流 */
  checkTheLogistics:function(){
    let self = this;
    var shipperCode = this.data.orderDetail.logisticsCompanyCode;
    var logisticCode = self.data.orderDetail.logisticsOrderNum;
    util.privateNavigateTo('../../../common/logistics/logistics?shipperCode=' + shipperCode + '&logisticCode=' + logisticCode);
  },


  /**
   * 确认发货 
   */
  confirmTheDelivery:function(){
    var orderId = this.data.orderDetail.orderId;
    util.privateNavigateTo("/pages/order/o2oOrder/o2oOrderSend/o2oOrderSend?orderId=" + orderId);
  }
  /**
   * TODO:图片默认处理图片
   */

  
})