
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        beginTime: "",
        endTime: "",
        isNotice: "N"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            beginTime: options.noticeStartTimeString||"",
            endTime: options.noticeEndTimeString||"",
            isNotice: options.isNotice
        })
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

    bindBeginTimeChange: function (e) {
        this.setData({
            beginTime: e.detail.value
        });
        this.changePrePageData();
    },
    bindEndTimeChange: function (e) {
        this.setData({
            endTime: e.detail.value
        });
        this.changePrePageData();
    },
    bindIsNoticeChange: function (e) {
        this.setData({
            isNotice: e.detail.value ? "Y" : "N"
        });
        this.changePrePageData();
    },
    /**
     * 更新上一页的数据
     */
    changePrePageData: function () {
        let pages = getCurrentPages();
        if(pages.length > 1){
            //上一个页面实例对象
            let prePage = pages[pages.length - 2];
            //关键在这里
            const userInfo = {
                noticeStartTimeString: this.data.beginTime||"",
                noticeEndTimeString:this.data.endTime||"",
                isNotice: this.data.isNotice
            };
            prePage.returnSetData(userInfo)
        }

    },

    /**
     * 更新员工后台信息
     */
    updateNotice: function (e) {
        if(!this.data.beginTime||!this.data.endTime){
            util.showToast("请完善日期!","none");
            return;
        }
        if(util.compareTime(this.data.beginTime,this.data.endTime)){
            util.showToast("开始时间须小于结束时间","none");
            return;
        }
        util.doRequest({
            url: 'user/updateNotice',
            data: {
                "noticeStartTimeString": this.data.beginTime,
                "noticeEndTimeString": this.data.endTime,
                "isNotice": this.data.isNotice
            },
            method: 'POST'
        }, res => {
            util.showToast("更新成功!");
            wx.navigateBack({//返回
                delta:1
            })
        })
    },


});