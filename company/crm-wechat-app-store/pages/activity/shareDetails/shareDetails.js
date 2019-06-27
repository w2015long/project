const util = require('../../../utils/util.js');
Page({
    data: {
        promoteActivity: {},
        isLastReqFin: true,                 //上次请求是否结束
        openSettingBtnHidden: true,         // 隐藏授权按钮
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const self = this;
        let wechatPromoteActivityId = self.options.wechatPromoteActivityId;
        // 从后台获取列表
        self.loadData(wechatPromoteActivityId);
    },

    /**
     * 加载数据
     */
    loadData: function (wechatPromoteActivityId) {
        const self = this;
        self.setData({
            isLastReqFin: false
        }, () => {
            util.doRequest({
                url: "promotionActivities/weChatPromoteActivityDetails?wechatPromoteActivityId=" + wechatPromoteActivityId,
            }, res => {
                console.log(res);
                self.setData({promoteActivity: res.data});
            })
        });
    },

    /**
     * 复制内容
     */
    copyPromoteContent: function () {
        let promoteContent = this.data.promoteActivity.promoteContent;
        wx.setClipboardData({
            data: promoteContent,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        console.log(res.data)
                    }
                })
            }
        })
    },
    /**
     * 下载校验
     */
    downloadValidate: function (option) {
        let self = this;
        let promoteActivity = self.data.promoteActivity;
        if ('进行中' === promoteActivity.activityState) {
            self.downloadAuthorize(option);
        } else {
            util.showModal("提示", "抱歉，该活动" + promoteActivity.activityState);
        }
    },
    /**
     * 获取相册授权
     */
    downloadAuthorize: function (option) {
        let self = this;
        //获取相册授权
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {//这里是用户同意授权后的回调
                            self.downloadPosters(option);
                        },
                        fail() {//这里是用户拒绝授权后的回调
                            util.showModal("温馨提示", "亲,下载海报需要用户授权哦!", function () {
                                self.setData({openSettingBtnHidden: false});
                            });
                        }
                    })
                } else {//用户已经授权过了
                    self.downloadPosters(option);
                }
            }
        });
    },
    /**
     * 下载海报
     */
    downloadPosters: function (option) {
        let self = this;
        wx.showLoading({
            title: '下载保存中..',
        });
        let index = option.target.id;
        let promoteActivity = self.data.promoteActivity;
        let wechatPromoteActivityId = self.data.promoteActivity.wechatPromoteActivityId;
        let fileUrl = "";
        let productId = "";
        if (index === "0") {
            fileUrl = self.data.promoteActivity.posterPic1;
            productId = self.data.promoteActivity.productId1;
        } else if (index === "1") {
            fileUrl = self.data.promoteActivity.posterPic2;
            productId = self.data.promoteActivity.productId2;
        } else if (index === "2") {
            fileUrl = self.data.promoteActivity.posterPic3;
            productId = self.data.promoteActivity.productId3;
        } else if (index === "3") {
            fileUrl = self.data.promoteActivity.posterPic4;
            productId = self.data.promoteActivity.productId4;
        } else if (index === "4") {
            fileUrl = self.data.promoteActivity.posterPic5;
            productId = self.data.promoteActivity.productId5;
        } else if (index === "5") {
            fileUrl = self.data.promoteActivity.posterPic6;
            productId = self.data.promoteActivity.productId6;
        } else if (index === "6") {
            fileUrl = self.data.promoteActivity.posterPic7;
            productId = self.data.promoteActivity.productId7;
        } else if (index === "7") {
            fileUrl = self.data.promoteActivity.posterPic8;
            productId = self.data.promoteActivity.productId8;
        } else if (index === "8") {
            fileUrl = self.data.promoteActivity.posterPic9;
            productId = self.data.promoteActivity.productId9;
        }
        util.doRequest({
            url: "promotionActivities/downloadPosters?wechatPromoteActivityId=" + wechatPromoteActivityId + "&productId=" + productId + "&fileUrl=" + fileUrl,
        }, res => {
            self.downloadFile(res.data);
        });
    },

    downloadFile: function (url) {
        wx.downloadFile({
            url: url,
            success: function (res) {
                console.log(res);
                var path = res.tempFilePath;
                wx.hideLoading();
                wx.saveImageToPhotosAlbum({
                    filePath: path,
                    success(res) {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                })
            },
            fail: function () {
                wx.showToast({
                    title: '保存失败,生成不成功',
                });
                wx.hideLoading();
            }
        })
    },
    handleSetting: function (e) {
        let that = this;
        // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
        if (!e.detail.authSetting['scope.writePhotosAlbum']) {
            wx.showModal({
                title: '警告',
                content: '若不打开授权，则无法将图片保存在相册中！',
                showCancel: false
            });
            that.setData({
                openSettingBtnHidden: false
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '您已授权，赶紧将图片保存在相册中吧！',
                showCancel: false
            });
            that.setData({
                openSettingBtnHidden: true
            })
        }
    },
    //图片点击事件
    imgYu: function (event) {
        let index = event.currentTarget.id;//获取 图片索引
        let productProtocolList = this.data.promoteActivity.productProtocolList || [];//获取data-list
        let picList = [];
        for (let i = 0; i < productProtocolList.length; i++) {
            picList.push(productProtocolList[i].posterPic.replace("_100X100", ""));
        }
        //图片预览
        wx.previewImage({
            current: picList[index], // 当前显示图片的http链接
            urls: picList // 需要预览的图片http链接列表
        })
    }
});
