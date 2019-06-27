const util = require('../../../utils/util.js');
Page({
  data: {
    today:'',
    pageRecord: {                     //page对象
      recordsFiltered: 0,
      data: [],
      page: 0,
      size: 4
    },
    searchParam: {
      useTime:'',
      page: 0,                            //页码
      size: 4,                           //每页大小
    },
    isLastReqFin: true,
    isShowLoadMore: false
  },
  /**
   * 刷新页面
   */
  onShow : function(){
    this.setData({
      ['searchParam.useTime']: util.formatDay(new Date()),
      today: util.formatDay(new Date()),
    },()=>{
      this.loadData(false);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log(util.formatDay(new Date()));
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      ['searchParam.useTime']: e.detail.value,
      ['searchParam.page']:0,
    },()=>{
      // 发送请求后台查询
      this.loadData(false);
    })
  },
  /**
   * 加载数据
   * @param isLoadMore 是否加载更多
   */
  loadData: function (isLoadMore) {
    const self = this;
    self.setData({
      isLastReqFin: false
    }, () => {
      util.doRequest({
        url: "coupon/pageCouponVerificationRecord",
        data: self.data.searchParam
      }, res => {
        //加载更多为拼接 否则覆盖
        let pageRecord = {
          page: res.data.page,
          size: res.data.size,
          recordsFiltered: res.data.recordsFiltered,
          data: isLoadMore ? self.data.pageRecord.data.concat(res.data.data) : res.data.data
        };
        self.setData({
          pageRecord: pageRecord,
          isLastReqFin: true,
          isShowLoadMore: false
        });
      })
    });
  },
  /**
   * 上滑加载更多
   */
  pullUpLoad: function () {
    const self = this;
    console.log(1111111)
    if (self.data.isLastReqFin && self.isHaveNextPage()) {
      self.setData({
        ["searchParam.page"]: self.data.searchParam.page + 1
      }, () => {self.loadData(true)});
    }
  },

  /**
   * 判断是否还有下一页
   */
  isHaveNextPage: function () {
    const self = this;
    const pageRecord = self.data.pageRecord;
    return pageRecord.size * (pageRecord.page + 1) < pageRecord.recordsFiltered;
  },
  /**
   * 上传凭证
   */
  uploading : function(e){
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
              couponPermissionId:e.currentTarget.id
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
});
