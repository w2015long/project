// pages/order/prescriptionOrder/deployDrug/deployDrug.js
const app = getApp();
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentState: 0,
    submitBtnTitle: '',
    imgUrls: [],
    // 订单项数据
    items: [],
    // 所有数据
    deployItems : {},
    isAllSelected:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.currentState = Number(options.state) || 0;
    this.setData({
      currentState: Number(options.state) || 0
    });
    var self = this;
    // 获取本地缓存参数
    var deployItems = wx.getStorageSync("orderObj");
    // 删除缓存
    wx.removeStorageSync("orderObj");

    self.setData({
      deployItems : deployItems
    });
    // 根据订单ID查询订单项
    self.findItems(deployItems.prescriptionOrderId);
    
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    switch (this.data.currentState) {
      case 0:
        wx.setNavigationBarTitle({
          title: '调配药品',
        });
        this.setData({
          submitBtnTitle: '完成调配'
        })
        break;

      case 1:
        wx.setNavigationBarTitle({
          title: '调配药品',
        })
        this.setData({
          submitBtnTitle: '完成调配'
        })
        break;
      default:
        break;
    };
    
    
  },


  /**
   * 根据订单ID查询订单项
   */
  findItems: function (prescriptionOrderId){
    var self = this;
    prescriptionOrderId = 1 ;
      util.doRequest({
        url: 'prescriptionOrder/findPrescriptionOrderItem',
        data :{
          "prescriptionOrderId": prescriptionOrderId
        }
      }, res => {
          self.setData({
            items: res.data
          })
        for(let i=0;i<self.data.items.length;i++){
          let item = self.data.items[i];
          item.record='未完成';
        } 
        self.setData({
          items: self.data.items
        })
      })
    
  },


  /**
   * 按钮点击事件，修改状态
   */
  touchToChange: function (event){
    var self= this;
    console.log(self.data.items);
    console.log(event.currentTarget.dataset.record);
    console.log(event.currentTarget.dataset.index);
    var record = event.currentTarget.dataset.record;
    var index = event.currentTarget.dataset.index;
    var items = self.data.items;
    if (record == "未完成"){
      items[index].record = '完成';
      self.setData({
        items: self.data.items
      })
    } else if (record == "完成")(
      items[index].record = '未完成',
    self.setData({
      items: self.data.items
    })
    )
    
    // 判断是否全部选中
     var count = 0;
      for (let j = 0; j < items.length; j++) {
      if (items[j].record == "完成") {
        count++;
      }
    }
    if (count == items.length) {
      self.setData({
        currentState: 1,
        isAllSelected: true,
      })
    }
    if (count != items.length) {
      self.setData({
        currentState: 0,
        isAllSelected: false,
      })
    }
  },
 

  /**
   * 完成调配
   */
  submitAction: function (e) {  
    if (this.data.currentState == 1) {
      wx.showModal({
        title: '',
        content: '完成调配？',
        success: function (res) {
          util.doRequest({
            url: 'prescriptionOrder/alterOrderState',
            data: {
              "prescriptionOrderId": this.data.deployItems.prescriptionOrderId,
              "dispensingRemark": this.data.deployItems.dispensingRemark
            }
          },res=>{
            
            let pages = getCurrentPages();
            if (pages.length > 1) {
              //上一个页面实例对象
              let prePage = pages[pages.length - 2];
              prePage.returnData(1)
            }
            wx.navigateBack();//返回上一页
            util.showToast("调配成功");
          })
        },
        fail: function (res) {

        }
      })
    } 

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})