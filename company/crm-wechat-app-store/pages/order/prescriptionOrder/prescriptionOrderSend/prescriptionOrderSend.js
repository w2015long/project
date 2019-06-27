// pages/test/orders/pat-orders/prescriptionOrderSend.js
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
      array: ['Android', 'IOS', 'ReactNativ', 'WeChat', 'Web'],
      index: 0,
      prescriptionOrder : {},
      logistics : [],
      logisticsValue : [],
      logisticsCompany : '',
      logisticsOrderNum : '',
      logisticsCompanyCode : '',
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        self.getInternalstorageObject();
        self.getFindAllLogistics();
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

    /**
     * 获取所有物流公司
     */
    getFindAllLogistics : function () {
        let self = this;
        util.doRequest({
            url: 'prescriptionOrder/findAllXCXLogistics',
            method: 'GET'
        }, res => {

            let dataList = [];
            let dataValue = [];
            for (let itme in res.data){
                dataList.push(itme); //键
                dataValue.push(res.data[itme]);  //值
            }
            self.setData({
                logisticsCompany : dataList[0],
                logisticsCompanyCode : dataValue[0],
                logistics: dataList ,
                logisticsValue : dataValue
            });
        })
    },

    /**
     * 监听普通picker选择器
     */
    listenerPickerSelected: function(e) {
        let self = this;
        //改变index值，通过setData()方法重绘界面
        this.setData({
            logisticsCompany : self.data.logistics[e.detail.value],
            logisticsCompanyCode  : self.data.logisticsValue[e.detail.value],
            index : e.detail.value
        });


    },

    //监听输入时件
    listenerInputEvent : function(element) {
        let self = this;
        self.setData({
            logisticsOrderNum: element.detail.value
        });

        if(self.data.logisticsOrderNum){
            self.setData({
                hideButton: false
            });
        }else {
            self.setData({
                hideButton: true
            });
        }
        console.log(self.data)
    },

    //点击复制按钮试触发
    copyValue:function(e) {
        var self=this;
        wx.setClipboardData({
            data: self.data.logisticsOrderNum,
            success: function(res) {
            }
        })
    },

    /**
     * 提交发货
     * @param e
     */
    deliveryButton :function(e) {
        var self = this;

        util.showModal(null, "是否确认发货？", () => {

            util.doRequest({
                url: 'prescriptionOrder/send',
                data : {
                    prescriptionOrderId :self.data.prescriptionOrder.prescriptionOrderId ,
                    logisticsCompany : self.data.logisticsCompany,
                    logisticsOrderNum : self.data.logisticsOrderNum,
                    logisticsCompanyCode : self.data.logisticsCompanyCode
                },
                method: 'POST'
            }, res => {
                /**
                 * 更新上一页的数据
                 */
                let pages = getCurrentPages();

                if (pages.length > 1) {
                    //上一个页面实例对象
                    let prePage = pages[pages.length - 2];
                    prePage.returnData(3)
                }
                wx.navigateBack();//返回上一页
                util.showToast("发货成功!");
            });
        }, null);

    }
});