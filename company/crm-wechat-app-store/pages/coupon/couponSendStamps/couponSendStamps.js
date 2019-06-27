const util = require('../../../utils/util.js');
const PrinterJobs = require('../../../printer/printerjobs');
const printerUtil = require('../../../printer/printerutil');
const TextEncoder = require('../../../printer/textEncoding').TextEncoder;
var Buffer = require('../../../utils/buffer').Buffer;
import drawQrcode from '../../../utils/weapp.qrcode.min.js'
Page({
  data: {
    currentTab: "0", // tab切换：0-大礼包 1-优惠券
    currentTabStarte: "couponGit",
    pageUrl: "couponGiftPacks/pageCouponGiftPacks", // 分页请求路径，默认大礼包
    pageDate: { // page对象,后台返回数据对象
      recordsFiltered: 0,
      data: [],
      page: 0,
      size: 10
    },
    searchParam: { // 搜索对象
      page: 0, // 页码
      size: 10, // 每页大小
    },
    height: 0, // 滚动区别高度
    isLastReqFin: true, // 上次请求是否结束
    showModel: false,
    couponId: null, // 用于派送路径
    codeWebUrl: "",
    showBtn: false,
    shareCouponUrl: "", // 分享优惠券的路径
    isOffline: '',
    connected: false,//是否连接了到蓝牙
    isOffOrOnBlueTooth:true,  // 是否展示页面
    couponCanvasNum: 1,        // CanvasId随机数
  },

    onShow:function(){
        this.countdown = this.selectComponent('#blueToothId');
        this.countdown.createBLEConnectionWithDeviceId();
    },

  /**
   * 点击切换tab
   */
  clickTab: function(e) {
    const self = this;
    let tabUrl = "couponGiftPacks/pageCouponGiftPacks";
    let tab = "couponGit";
    if (self.data.currentTab === e.target.dataset.current) {
      return false;
    } else {

      if (e.target.dataset.current === '1') {
        tabUrl = "coupon/pageXCXClerkCoupon";
        tab = 'coupon'
      }
      self.setData({
        currentTab: e.target.dataset.current,
        pageUrl: tabUrl,
        currentTabStarte: tab,
        ["searchParam.page"]: 0,
      }, () => {
        self.loadData(false);
    })
    }
  },

  /**
   * 展开派送渠道
   */
  showTips: function(e) {
    const self = this;
    let couponId = e.target.dataset.couponId;
    let couponCode = e.target.dataset.couponCode;
    util.doRequest({
      url: 'coupon/findByShareCoupon?couponId=' + couponId,
      method: 'GET',
    }, res => {
      self.setData({
        showModel: true,
        couponId: couponId,
        shareCouponUrl: res.data,
        isOffline: e.target.dataset.isOffline,
        isOffOrOnBlueTooth:true
      });
    });
  },
  /**
   * 关闭派送通道
   */
  closeShow: function() {
    this.setData({
      showModel: false
    })
  },

  /**
  * 关闭二维码弹窗
  */
  closeBtn: function () {
    this.setData({
      showBtn: false,
      couponCanvasNum: this.data.couponCanvasNum + 1 ,
    })
  },

  /**
   * 二维码生成分享
   */
  showErweima: function(e) {
    const self = this;
    let url = "http://v.gdjkyf.com/wap/coupon/sV/" + self.data.couponId + "/coupon_sc_" + self.data.couponId;
    self.setData({
      showBtn: true,
    })
    self.drawCoupon(url, self.data.couponId);
  
  },

  /**
  * 把内容转换成二维码
  * @param text
  * @param callBack
  */
  drawCoupon(text, couponId, callBack = () => { }) {
    if (!text) {
      util.showConfirm('提示：', "优惠券编码为空");
      return;
    }
    // 设置二维码起始位置 x,y
    drawQrcode({
      canvasId: 'tuiguang' + this.data.couponCanvasNum,
      text: text,
      width: 200,
      height: 200,
      callback(e) {
        console.log('生成二维码:  ', e);
        setTimeout(() => {
          callBack();
        }, 1000);
      },  
    })
  },


  /**
   *  复制到剪贴板
   */
  copylink: function() {
    const self = this;
    wx.setClipboardData({
      data: self.data.shareCouponUrl,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            self.setData({
              showModel: false
            }, () => {
              util.showToast("链接复制成功");
          })
          }
        })
      }
    })
  },

  /**
   * 打印优惠券
   */
  printCoupon: function() {
    const self = this;

    if (!self.data.connected){
      util.showModal(null, "请打开蓝牙", () => self.openBluePrint(self));
    }else{
      util.doRequest({
        url: "coupon/findCouponUseDesc?couponId=" + self.data.couponId,
        method: 'GET',
      }, (res) => {
        self.draw(res.data.couponCode, () => {
          self.dealPrintQrCode(res.data);
        });
      }, (fail) => {
        util.showConfirm("发券失败", fail.data.errMsg);
        self.setData({
          showModel: false
        })
      });
    }
    
  },

  // 前往打开蓝牙页面
  openBluePrint: function (self){

    self.setData({
      isOffOrOnBlueTooth:false,
      showModel: false
    });


  },

 /**
  * 把内容转换成二维码
  * @param text
  * @param callBack
  */
  draw(text,callBack=()=>{}) {
     if(!text){
      util.showConfirm('提示：',"优惠券编码为空");
      return ;
     }
    // 设置二维码起始位置 x,y
    drawQrcode({
        canvasId: 'myQrcode',
        text: text,
        width: 160,
        height: 160,
      callback(e) {
        console.log('生成二维码:  ', e);
        setTimeout(() => {
           callBack();
        }, 1000);
      }
    })
  },
  /**
   * 处理打印二维码信息
   */
  dealPrintQrCode:function(couponInfo){
    let self = this;
    let uint8ClampedArray  = [];
    let arr = [];
    let codeDate = [];

    // 获得图像像素点数据 图片不能 display : none
    wx.canvasGetImageData({
      canvasId: 'myQrcode',
      x: 0,
      y: 0,
      width: 160,
      height: 160,
      success(res){
        uint8ClampedArray = res.data;
        console.log(uint8ClampedArray);

        // 黑白化 4和1
        for (let i = 0; i < uint8ClampedArray.length; i++) {
          if (i % 4 === 0) {
            let rule = 0.29900 * uint8ClampedArray[i] + 0.58700 * uint8ClampedArray[i + 1] + 0.11400 * uint8ClampedArray[i + 2];
            if (rule > 200) {
              uint8ClampedArray[i] = 0;
            } else {
              uint8ClampedArray[i] = 1;
            }
            arr.push(uint8ClampedArray[i]);
          }
        }

        // 每8个像素点组成一个字节
        for (let k = 0; k < arr.length; k += 8) {
          let temp = arr[k] * 128 + arr[k + 1] * 64 + arr[k + 2] * 32 + arr[k + 3] * 16 + arr[k + 4] * 8 + arr[k + 5] * 4 + arr[k + 6] * 2 + arr[k + 7] * 1
          codeDate.push(temp);
        }
        console.log("codeDate:",codeDate);
        // 数据转为ArrayBuffer对象   居中对齐，打印光栅位图（正常模式,位图宽度以双字节表示的低位数值[8*20=160px]...），数据，，初始化
        self._cmds = [].concat([27, 97, 49], [29, 118, 48, 0, 20, 0, 160, 0], codeDate, [27, 74, 3], [27, 64]);
        self._printCoupon = couponInfo;
        self.printTicket();
      },
      fail(res) {
        console.log("生成二维码失败:",res);
      }
    });


  },

  // 打印
  printTicket: function () {
    let self = this;
    let coupon = this._printCoupon;
    if(! coupon && !this.data.connected){
      return;
    }
    let printerJobs = new PrinterJobs();
    let productName = coupon.applyProductType === 'ALL_PRODUCTS' ? "适用范围:适用商品（全部商品)" : (coupon.applyProductType === 'EXCLUDE_PRODUCTS' ? '适用范围:全部商品(排除商品:' + coupon.productNames + ')' : '适用范围:适用商品(' + coupon.productNames + ')')
    productName = productName + " 优惠券仅限在有效期内适用，过期则无法适用；一张订单只能使用一张优惠券；";

    let you = ""; 
    if (coupon.couponType === 'FULL_REDUCE'){
      you = coupon.specifiedBeginTimeStr + "-" + coupon.specifiedEndTimeStr
    }
    if (coupon.couponType === 'DISCOUNT'){
      you = "自领取起" + coupon.specifiedDayNum +"日内可用";
    }

    printerJobs.setSize(2, 2)
       .setBold(true)
       .printUnLf(coupon.couponType === 'FULL_REDUCE' ? coupon.couponAmountDouble : coupon.couponDiscount)
       .setBold(false)
       .setSize(1, 1)
       .printUnLf(coupon.couponType === 'FULL_REDUCE' ? '元' : '折')
       .print(coupon.isLimitedUse === 'Y' ? '  订单满' + coupon.orderFullAmountDouble + '元可用' : '无限制')
       .print()
       .print("券编号:" + coupon.couponCode)
       .print()
      .print("有效期:" + you)
       .print()
       .print("适用门店:" + coupon.shopNames )
       .print()
       .print(productName)
       .print();
    let beginText =  Array.from(new Uint8Array(printerJobs._queue));
    let endText =  Array.from(new Uint8Array(printerJobs.clear().print().print("到店消费结算时出示此二维码").print(printerUtil.fillLine()).println()._queue));
    const buffer =  new Uint8Array(Buffer.from(beginText.concat(this._cmds).concat(endText), 'gb2312')).buffer;
    console.log("打印优惠券",buffer);
    self.countdown.print(buffer);
    self.closeBtn();
  },

  /**
    * 蓝牙组件改变父组件的data
    */
  changeData: function (e) {
    this.setData({
      connected: e.detail.connected,
      canWrite: e.detail.canWrite,
      isOffOrOnBlueTooth:true,
    })

  },

  /**
   * 跳转礼包详情页面
   */
  findDeatils: function(e) {
    wx.navigateTo({
      url: '../couponGiftPacksDetails/couponGiftPacksDetails?couponGiftPacksId=' + e.target.dataset.couponGiftPacksId,
    })
  },

  /**
   * 跳转到优惠券支持/不支持页面
   */
  findCouponProduct: function(e) {
    const self = this;
    let couponId = e.target.dataset.couponId;
    wx.navigateTo({
      url: '../couponDetails/couponDetails?couponId=' + couponId,
    })
  },

  /**
   * 判断是否还有下一页
   * @returns {boolean}
   */
  isHaveNextPage: function() {
    const self = this;
    const pageDate = self.data.pageDate;
    return pageDate.size * (pageDate.page + 1) < pageDate.recordsFiltered;
  },

  /**
   * 上滑加载更多
   */
  pullUpLoad: function() {
    const self = this;

    if (self.data.isLastReqFin && self.isHaveNextPage()) {
      self.setData({
        ["searchParam.page"]: self.data.searchParam.page + 1,
      }, () => self.loadData(true));
    } else {
      util.showToast("已没有更多了！！！", "none");
    }
  },

  /**
   * 后台请求商品数据  isLoadMore: 是否加载更多
   * @param isLoadMore
   */
  loadData: function(isLoadMore) {
    const self = this;
    self.setData({
      isLastReqFin: false
    }, () => {
      util.doRequest({
        url: self.data.pageUrl,
        method: 'POST',
        data: self.data.searchParam
      }, res => {
        //加载更多为拼接 否则覆盖
        let pageData = {
          page: res.data.page,
          size: res.data.size,
          recordsFiltered: res.data.recordsFiltered,
          data: isLoadMore ? self.data.pageDate.data.concat(res.data.data) : res.data.data
        };
    self.setData({
      pageDate: pageData,
      isLastReqFin: true,
    });
  })
  })

  },

  /**
   * 初始化页面
   */
  onLoad: function() {
    const self = this;
    // 获取用户屏幕尺寸
    let height = 0;
    let barheight = 0;
    wx.getSystemInfo({
      success: function(res) {
        height = res.screenHeight; // 屏幕高度 
        barheight = res.statusBarHeight; // 状态栏高度
      }
    });

    height = height - barheight - 100;
    self.setData({
      height: height,
    });

    this.loadData(false);
  }
});