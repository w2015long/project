const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        faceList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            memberId: options.memberId
        });
    },

    changeIcon: function (e) {
        const self = this;
        util.showModal(null, "确定更换吗?", () => {
            util.doRequest({
                url: "member/updateMemberIcon?memberId=" + self.data.memberId + "&icon=" + e.currentTarget.dataset.faceFileid
            }, res => {
                util.showToast("更换成功！");
            });
        });
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const self = this;
        util.doRequest({
            url: "member/memberFaceList?memberId=" + self.data.memberId
        }, (res) => {
            self.setData({
                faceList: res.data
            });
        })
    }

});