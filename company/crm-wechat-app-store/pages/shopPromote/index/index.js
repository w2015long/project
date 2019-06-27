const util = require('../../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopPromoteUrl: ""
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const self = this;
        // util.doRequest({url: "weChatCard/geMemberCardCodeUrl?generalizeChannel=0"}, (res) => {
        util.doRequest({url: "shopUserPromote/getUserPromoteUrl"}, (res) => {
            self.setData({shopPromoteUrl: res.data});
        });
    },
    downloadPic: function () {
        let url = this.data.shopPromoteUrl;
        if (url) {
            wx.downloadFile({
                url: url,
                success: function (res) {
                    var rr = res.tempFilePath;
                    wx.saveImageToPhotosAlbum({
                        filePath: rr,
                        success(res) {
                            wx.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000
                            })
                        }
                    })
                }
            })
        }
    },
});