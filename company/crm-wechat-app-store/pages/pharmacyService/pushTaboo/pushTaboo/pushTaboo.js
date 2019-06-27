const util = require('../../../../utils/util.js');
Page({

  /**
   * 组件的初始数据
   */
  data: {
    orderId: 0,                         //订单Id
    initData: "",                       //订单信息
    weChatTemplate: "",                 //信息模板
    wechatNotice: 'Y',                  //微信通知开关
    wechatNoticeContent: '',            //微信内容
    messageNotice: 'Y',                 //短信通知开关
    messageNoticeContentInit: '',       //初始的短信内容
    messageNoticeContent: '',           //短信内容
    tagList: {},                        //标签
    selectTagId: 0,                     //选中的标签
    commodityIndex: 0,                  //点击的商品
  },
  /**
   * 页面加载设置当前状态
   */
  onLoad: function (options) {
    const self = this;
    self.setData({
      orderId: options.orderId,
    });

    util.doRequest({
      url: "userAndTaboo/initAdviceMsgXcx",
      data: { orderId: self.data.orderId },
    }, res => {
      self.setData({
        initData: res.data.initData,
        weChatTemplate: res.data.weChatTemplate,
        wechatNotice: res.data.initData.isSubscriptionWechat,
        tagList: res.data.initData.diseaseTagProtocolList,
        messageNoticeContent: "亲爱的【" + res.data.initData.memberName + "】，",
        messageNoticeContentInit: "亲爱的【" + res.data.initData.memberName + "】，",
      });
    })
  },
  /**
   * 完善商品使用与禁忌
   */
  perfect:function(e){
   const items= e.currentTarget.dataset.items;
    // if (items.usageAndDosage === "" || items.notes === "") {//使用与禁忌，不能为空
      this.data.commodityIndex = e.currentTarget.dataset.index;
      wx.setStorageSync("commodity", items)
      util.privateNavigateTo('../tabooEdit/tabooEdit');
    // } else {
    //   return;
    // }
  },
  /**
   * 更新商品使用禁忌和注意事项
   */
  commodityRefresh: function (commodity) {
    const self=this;
    const commodityIndex = self.data.commodityIndex;
    self.setData({
      ['initData.productProtocolList[' + commodityIndex+']']: commodity,
    });
  },
  /**
   * 跳转到添加标签页面
   */
  tagUrl:function(){
    wx.setStorageSync("tagList", this.data.tagList)
    util.privateNavigateTo('../pushAddTag/pushAddTag');
  },
  /**
   * 更新标签
   */
  tagRefresh: function (tagList){
    this.setData({
      tagList: tagList,
    });
  },
  /**
   * 微信通知开关
   */
  wechatNotice: function (e) {
    const wechatNotice = this.data.wechatNotice;
    const isSubscriptionWechat = this.data.initData.isSubscriptionWechat;
    if (isSubscriptionWechat === "N") {
      util.showToast("该用户没有关注微信", "none");
      return;
    }
    this.setData({
      wechatNotice: (wechatNotice === "Y") ? "N" : "Y"
    });
  },
  /**
   * 短信通知开关
   */
  messageNotice: function (e) {
    const messageNotice = this.data.messageNotice;
    this.setData({
      messageNotice: (messageNotice === "Y") ? "N" : "Y"
    });
  }, 
  /**
   * 点击标签
   */
  selectTag: function (e) {
    const diseaseTagId = e.currentTarget.dataset.diseaseTagId;
    const adviceDesc = e.currentTarget.dataset.adviceDesc;
    this.setData({
      selectTagId: diseaseTagId,
      messageNoticeContent: this.data.messageNoticeContentInit + adviceDesc,
      wechatNoticeContent:  adviceDesc,
    });
  },
  /**
   * 发送
   */
  formSubmit:function(e){
    const self=this;
    const wechatNoticeContent = e.detail.value.wechatNoticeContent;//微信内容
    const messageNoticeContent = e.detail.value.messageNoticeContent;//短信内容
    const messageNoticeContentInit = this.data.messageNoticeContentInit;//短信初始内容

    const wechatNotice = this.data.wechatNotice; //微信通知开关
    const messageNotice = this.data.messageNotice;  //短信通知开关

    const productProtocolList = this.data.initData.productProtocolList;  //商品list
    
    const initData = this.data.initData;                     
    const eChatTemplate = this.data.eChatTemplate;
    if (wechatNoticeContent === "" && (messageNoticeContent === messageNoticeContentInit || messageNoticeContent === "")){
      util.showToast("微信模板、短信模板不能同时为空", "none");
      return;
    }
    if (wechatNotice === "Y" && wechatNoticeContent === "") {
      util.showToast("微信模板不能为空", "none");
      return;
    }
    if (messageNotice === "Y" && (messageNoticeContent === messageNoticeContentInit || messageNoticeContent === "")) {
      util.showToast("短信模板不能为空", "none");
      return;
    }
 

    util.showModal(null, "确定发送吗？", () => {
      util.doRequest({
        url: 'userAndTaboo/saveAdviceMsgLogXcx',
        data: {
          "isWechatOn": wechatNotice,
          "isSmsOn": messageNotice, 
          "wechatContent": wechatNoticeContent,
          "smsContent": this.data.messageNoticeContent,
          "productList": productProtocolList,
          "orderId": self.data.orderId
        },
        method: 'POST'
      }, res => {
        util.privateNavigateTo("../pushSuccessful/pushSuccessful");
      })
    }, null);
  },


  
})