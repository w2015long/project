
const app = getApp();
const util = require('../../../utils/util.js');
const {MOBILE_IN_FOUR_NUM} = require('../../../utils/commonReg');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iconFileId:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    const self = this;
        this.setData({
            avatarUrl: options.avatarUrl||"",
        });
        self.loadUserDetail();
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
     * 加载员工后台信息
     */
    loadUserDetail: function () {
        let self = this;
        util.doRequest({url:'user/findAssistantInfo'},res=>{
            const userInfo= res.data||{};
            self.setData({
                iconFileId: userInfo.iconFileId,
                noticeEndTimeString: userInfo.noticeEndTimeString||"",
                noticeStartTimeString:userInfo.noticeStartTimeString||"",
                isNotice: userInfo.isNotice,
                mobile: userInfo.mobile,
                sex: userInfo.sex,
                mobileLessFormat: userInfo.mobile && userInfo.mobile.replace(MOBILE_IN_FOUR_NUM, '$1****$2')
            });

        })
    },
    /**
     * 选中图片或者拍照
     */
    chooseImageTap: function(){
        let _this = this;
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#0c0c0c",
            success: function (res) {
                if (!res.cancel) {
                    if (res.tapIndex === 0) {
                        _this.chooseWxImage('album')
                    } else if (res.tapIndex === 1) {
                        _this.chooseWxImage('camera')
                    }
                }
            }
        });
    },
    /**
     * 更新员工头像设置
     * @param fileId
     * @param tempFilePaths
     */
    saveIconFileId: function (fileId,tempFilePaths) {
        let self = this;
        util.doRequest({url:'user/updateIconFileId?iconFileId='+fileId,},res=>{
            util.showToast("更新成功!");
            self.setData({
                iconFileId: tempFilePaths,
            })
        })
    },

    /**
     * 上传图片
     * @param type
     */
    chooseWxImage:function(type){

        let self = this;
        wx.chooseImage({
            count:1,
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function (chooseImageRes) {
                wx.uploadFile({
                    url: util.webRoot+"file/uploadFile",
                    filePath: chooseImageRes.tempFilePaths[0],
                    name: 'file',
                    header:{
                      'token':wx.getStorageSync(util.token)
                    },
                    formData: {
                        'user': 'test'
                    },
                    success: function (res) {
                        let data =  JSON.parse(res.data);
                        if (res.statusCode !== 200) {
                            wx.showModal({
                                title: '提示',
                                content: '上传失败',
                                showCancel: false
                            });
                            return;
                        }
                        self.saveIconFileId(data.fileId,chooseImageRes.tempFilePaths[0]);
                    },fail:function(err){
                        wx.showModal({
                            title: '提示',
                            content: '上传失败',
                            showCancel: false
                        });
                        console.log(err)
                    }
                })
            }
        })
    },

    /**
     * 返回该页面钱更新该值
     * @param userInfo
     */
    returnSetData: function(userInfo){
        if(!userInfo){
            return;
        }
        this.setData({
            noticeEndTimeString: userInfo.noticeEndTimeString,
            noticeStartTimeString:userInfo.noticeStartTimeString,
            isNotice: userInfo.isNotice,
        })
    }
});