const util = require('../../../utils/util.js');
//--蓝牙
const LAST_CONNECTED_DEVICE = 'last_connected_device';
const PrinterJobs = require('../../../printer/printerjobs');
const printerUtil = require('../../../printer/printerutil');
//--蓝牙
Page({
  data: {
    //lastDevice:false,
    //devices: [],
    connected: false,//是否连接了到蓝牙
    canWrite: false,
    verificationState:'',//  successfully-成功,failure-失败
    //failureCause:'',//失败原因
    intervalTimer:null,
    countDownSeconds:5,

    couponPermissionId:'',//优惠券使用权限id
    couponId:'',//优惠券id
    couponName:'',//优惠券名称
    couponType:'',//优惠券类型
    createTime:'',//创建时间
    couponAmountDouble:'',//优惠券面额
    couponDiscount:'',//优惠券折扣
    isCapping:'',//是否封顶
    maxCouponDiscountAmountDouble:'',//最大优惠金额
    orderFullAmountDouble:'',//订单金额满
    couponCode:'',//优惠券使用编号
    effectiveBeginTime:'',//有效时间开始
    effectiveEndTime:'',//有效时间结束
    isUse:'',//是否已使用
    isExpired:'',//是否过期
    isUnStart:'',//是否未开始
    isDisabled:'',//是否停用
    shopName:''
  },
  /**
   * 蓝牙组件改变父组件的data
   */
  changeData:function(e){
    this.setData({
      connected: e.detail.connected,
      canWrite: e.detail.canWrite,
    })

  },
  /**
   * 倒计时
   */
  countDown : function(){
    let self = this;
    let countDownSeconds =  self.data.countDownSeconds;
    let intervalTimer = setInterval(function(){
      if(countDownSeconds <= 1){
        self.toWorkbench()
      }else{
        self.setData({countDownSeconds:--countDownSeconds});
      }
    }, 1000);//调用倒计时的方法
    this.setData({intervalTimer:intervalTimer});
  },

  /**
   * 回到首页
   */
  toWorkbench:function(){
    wx.navigateBack({
      delta: 1   //默认值是1
    })
  },
  /**
   * 跳转核销记录页面
   */
  toCouponVerificationRecord : function(){
    util.privateNavigateTo("../couponVerificationRecord/couponVerificationRecord");
  },
  /**
    * 离开当前页
    */
  onUnload: function () {
    // 销毁定时器
    if (this.data.intervalTimer) {
      clearInterval(this.data.intervalTimer);
    }

  },
  /**
   * 上传凭证
   */
  uploading : function(){
    const self = this;
    wx.chooseImage({
      count: 1,                               // 上传数量
      sizeType: ['original', 'compressed'],       // 图片尺寸 原图、压缩图  
      sourceType: ['album', 'camera'],            // 选择图片的来源 相册、拍照
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        util.uploadFile(res.tempFilePaths[0],(fileId)=>{
          util.doRequest({
            url: 'coupon/uploadVerificationCertificate',
            data: {
              verificationCertificate: fileId,
              couponPermissionId:self.data.couponPermissionId
            },
            method: 'GET'
          },res => {
              util.showConfirm(null,"上传成功！")
          },err =>{
              util.showConfirm(null,"上传失败，请稍后重试！")
          })
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;

    // 获取优惠券信息
    self.findCouponInfo(options);

  },

  /**
   * 获取优惠券信息
   */
  findCouponInfo:function(options){
    let self = this;
    util.doRequest({
      url: 'coupon/findCouponInfo',
      data: {
        "couponCode": options.couponCode
      },
      method: 'GET'
    }, res => {
      if (!res.data.couponPermissionId) {
        self.setData({ verificationState: 'failure', failureCause: '优惠券不存在' }, () => {
          self.countDown();
        });
      /*} else if (res.data.isUse === 'Y') {
        self.setData({ verificationState: 'failure', failureCause: '该优惠券已被使用' }, () => {
          self.countDown();
        });*/
      } else if (res.data.isExpired === 'Y') {
        self.setData({ verificationState: 'failure', failureCause: '该优惠券已过期' }, () => {
          self.countDown();
        });
      } else if (res.data.isUnStart === 'Y') {
        self.setData({ verificationState: 'failure', failureCause: '该优惠券未到使用时间' }, () => {
          self.countDown();
        });
      } else if (res.data.isDisabled === 'Y') {
        self.setData({ verificationState: 'failure', failureCause: '该优惠券已停用' }, () => {
          self.countDown();
        });
      } else {
        self.setData({//获取初始化数据
          couponPermissionId: res.data.couponPermissionId,//优惠券使用权限id
          couponId: res.data.couponId,//优惠券id
          couponName: res.data.couponName,//优惠券名称
          couponType: res.data.couponType,//优惠券类型
          createTime :res.data.createTime,//创建时间
          couponAmountDouble: res.data.couponAmountDouble,//优惠券面额
          couponDiscount: res.data.couponDiscount,//优惠券折扣
          isCapping: res.data.isCapping,//是否封顶
          maxCouponDiscountAmountDouble: res.data.maxCouponDiscountAmountDouble,//最大优惠金额
          orderFullAmountDouble: res.data.orderFullAmountDouble,//订单金额满
          couponCode: res.data.couponCode,//优惠券使用编号
          effectiveBeginTime: res.data.effectiveBeginTime,//有效时间开始
          effectiveEndTime: res.data.effectiveEndTime,//有效时间结束
          isUse: res.data.isUse,//是否已使用
          isExpired: res.data.isExpired,//是否过期
          isUnStart: res.data.isUnStart,//是否未开始
          isDisabled: res.data.isDisabled,//是否停用
          shopName: res.data.shopName,
          verificationState : "successfully"
      });
        
        // 检测蓝牙
        this.countdown = this.selectComponent('#blueToothId');
        this.countdown.createBLEConnectionWithDeviceId();
      }

    })
  },
  /**
   * 打印小票
   */
    printTicket: function (){
      let self = this;
      let data = self.data;
      // 改变优惠券的状态以及材质
      util.doRequest({
              url: 'coupon/useCoupon',
              data: {
                  "couponCode": self.data.couponCode
              },
              method: 'GET'
          }, res => {
          let printerJobs = new PrinterJobs();
          /* printerJobs
         .print('2018年12月5日17:34')
         .print(printerUtil.fillLine())
         .setAlign('ct')
         .setSize(2, 2)
         .print('#20饿了么外卖')
         .setSize(1, 1)
         .print('切尔西Chelsea')
         .setSize(2, 2)
         .print('在线支付(已支付)')
         .setSize(1, 1)
         .print('订单号：5415221202244734')
         .print('下单时间：2017-07-07 18:08:08')
         .setAlign('lt')
         .print(printerUtil.fillAround('一号口袋'))
         .print(printerUtil.inline('意大利茄汁一面 * 1', '15'))
         .print(printerUtil.fillAround('其他'))
         .print('餐盒费：1')
         .print('[赠送康师傅冰红茶] * 1')
         .print(printerUtil.fillLine())
         .setAlign('rt')
         .print('原价：￥16')
         .print('总价：￥16')
         .setAlign('lt')
         .print(printerUtil.fillLine())
         .print('备注')
         .print("无")
         .print(printerUtil.fillLine())
         .println();*/
          printerJobs.setAlign('ct')
              .setSize(2, 2)
              .print('核销凭证')
              .setSize(1, 1)
              .setAlign('lt')
              .print()
              .print("券编号:"+data.couponCode)
              .print()
              .print("券名称:"+data.couponName)
              .print()
              .setBold(true)
              .print(data.couponType === 'FULL_REDUCE' ?  "券金额:"+data.couponAmountDouble+"元" : "券折扣:"+data.couponDiscount+"折")
              .setBold(false)
              .print()
              .print("发券时间:"+util.formatTime(new Date(data.createTime)))
              .print()
              .print("使用时间:"+util.formatTime(new Date(res.data.useTime)))
              .print()
              .print("使用门店:"+data.shopName)
              .print(printerUtil.fillLine())
              .println();
          let buffer = printerJobs.buffer();

          this.countdown.print(buffer);
      })

    },
});
