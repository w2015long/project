// pages/test/orders/pat-orders/prescriptionOrderDecoction.js
const app = getApp();
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      winHeight: app.globalData.windowHeight,
      winWidth: app.globalData.windowWidth,
      hideButton : true,
      decoctionNumWaterQuantity : 0,
      immersingTime : 0,
      dispensingTime: 0,
      immersingTemperature : 0,
      prescriptionOrder : {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let self = this;
      self.getInternalstorageObject();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
    /**
     * 获取内存对象
     */
    getInternalstorageObject: function () {
        let self = this;
        const data = wx.getStorageSync("orderObj");
        wx.removeStorageSync("orderObj");
        self.setData({prescriptionOrder: data});
    },

    //监听输入时件
    listenerInputEvent : function(element){
        let self = this;
        if(element.currentTarget.dataset.inputValue === 'decoctionNumWaterQuantity'){
            self.setData({
                decoctionNumWaterQuantity : element.detail.value
            });
        }else  if(element.currentTarget.dataset.inputValue === 'immersingTime'){
            self.setData({
                immersingTime : element.detail.value
            });
        }else  if(element.currentTarget.dataset.inputValue === 'dispensingTime'){
            self.setData({
                dispensingTime : element.detail.value
            });
        }else  if(element.currentTarget.dataset.inputValue === 'immersingTemperature'){
            self.setData({
                immersingTemperature : element.detail.value
            });
        }

        if(self.data.decoctionNumWaterQuantity && self.data.immersingTime && self.data.dispensingTime && self.data.immersingTemperature ){
            self.setData({
                hideButton : false
            });
        }else {
            self.setData({
                hideButton : true
            });
        }
    },


    /**
     * 弹出确认框
     */
    submitAction: function () {
        let self = this;
        util.showModal(null, "药品确认煎煮？", () => {
                   if(!(/^[0-9]*$/.test(self.data.decoctionNumWaterQuantity))){
                       wx.showToast({
                           title: '煎煮水量不能输入非数字',
                           icon: 'none',
                           duration: 2000
                       });
                       return ;
                   }
                   if(!(/^[0-9]*$/.test(self.data.immersingTime))){
                       wx.showToast({
                           title: '药泡时间不能输入非数字',
                           icon: 'none',
                           duration: 2000
                       });
                       return ;
                   }
                   if(!(/^[0-9]*$/.test(self.data.dispensingTime))){
                       wx.showToast({
                           title: '煎药时间不能输入非数字',
                           icon: 'none',
                           duration: 2000
                       });
                       return ;
                   }
                   if(!(/^[0-9]*$/.test(self.data.immersingTemperature))){
                       wx.showToast({
                           title: '煎药温度不能输入非数字',
                           icon: 'none',
                           duration: 2000
                       });
                       return ;
                   }

                 let prescriptionOrder =   self.data.prescriptionOrder;
                   prescriptionOrder.decoctionNumWaterQuantity = self.data.decoctionNumWaterQuantity;
                   prescriptionOrder.immersingTime = self.data.immersingTime;
                   prescriptionOrder.dispensingTime = self.data.dispensingTime;
                   prescriptionOrder.immersingTemperature = self.data.immersingTemperature;

                   util.doRequest({
                       url: 'prescriptionOrder/decoction',
                       method: 'POST',
                       data: prescriptionOrder,
                   }, res => {
                       /**
                        * 更新上一页的数据
                        */
                       let pages = getCurrentPages();

                       if (pages.length > 1) {
                           //上一个页面实例对象
                           let prePage = pages[pages.length - 2];
                           prePage.returnData(1)
                       }
                       wx.navigateBack();//返回上一页
                       util.showToast("调配成功");
                   });
                }, null);
    },


});