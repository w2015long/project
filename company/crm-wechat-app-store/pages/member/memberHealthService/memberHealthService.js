const util = require('../../../utils/util.js');
Page({
  data: {
    dayNumber:30,/**指定天数 */
    recordNumber:0,/**健康档案人数 */
    recordWarningProtocol:{
      isHypertensionNum: 0,
      isHyperglycemiaNum: 0,
      isHypercholesterolemiaNum: 0,
    },/**预警的proocol对象 */
    patients: [],//快速检测会员数据
    pageData: {  //分页数据
      page: 0,
      size: 5,
      content: [],
      recordsFiltered: 0
    },
    searchParams: {  //搜索参数
      page: 0,
      size: 5,
    },
  },

  addReport: function () {
    wx.navigateTo({
      url: './addReport/addReport',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    const searchParams = this.data.searchParams;
    self.loadMemberHealthRecordWarningData();
    self.loadMemberHealthRecordNumberData();
    self.loadPageMemberFastDetectionData(searchParams);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 加载指定天数内的检测预警人数
   */
  loadMemberHealthRecordWarningData:function(){
    let self = this;
    util.doRequest({
      url: '/memberHealthRecord/memberHealthRecordWarning'
    }, res => {
      self.setData({ recordWarningProtocol: res.data });
    });
  },

  /**
   * 加载当前门店下会员档案的数量
   */
  loadMemberHealthRecordNumberData:function(){
    let self = this;
    util.doRequest({
      url: '/memberManager/memberHealthRecordNumber'
    }, res => {
      self.setData({ recordNumber: res.data });
    });
  },

  /**
   * 加载快速检测列表
   */
  loadPageMemberFastDetectionData: function (searchParams){
    let self = this;
    util.doRequest({
      url: '/member/pageMemberFastDetection',
      method: 'GET',
      data: searchParams,
    }, res => {
      self.setData({ 
        patients: self.data.patients.concat(res.data.data) ,
        pageData: {  //分页数据
          page: res.data.page + 1,
          size: res.data.size,
          content: [],
          recordsFiltered: res.data.recordsFiltered,
        },
      });
    });
  },

    /**
     * 上滑事件（只有在有滚动条的情况下，并且已经滑到底部的时候才能触发）
     */
  pullUpLoad: function () {
    let self = this;
    if (self.isHaveNextPage()) {
      const searchParams = self.data.searchParams;
      searchParams.page = searchParams.page + 1;
      setTimeout(() => {
        self.loadPageMemberFastDetectionData(searchParams);
      }, 800);
    }
  },

  /**
     * 是否还有下一页
     */
  isHaveNextPage: function () {
    let self = this;
    const pageData = self.data.pageData;
    return pageData.size * (pageData.page + 1) < pageData.recordsFiltered;
  },


});