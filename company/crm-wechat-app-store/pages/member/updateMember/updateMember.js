const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sexArray: ["MALE", "FEMALE", "SECRET"],
        index: 0,
        showSexArray: ["男性", "女性", "保密"],
        date: '1995-6-15',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({memberId: options.memberId});
    },

    /**
     * 改变性别
     */
    bindPickerChange: function (e) {
        this.setData({index: e.detail.value});
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const self = this;
        self.loadMemberInfo();
    },

    loadMemberInfo: function () {
        const self = this;
        util.doRequest({url: "member/getMemberInfo?memberId=" + self.data.memberId}, res => {
            let _index = 0;
            let date = self.data.date;
            if (res.data.sex) {
                self.data.sexArray.map((item, index) => {
                    if (item === res.data.sex) {
                        _index = index;
                    }
                });
            }
            if (res.data.birthdayString) {
                date = res.data.birthdayString;
            }
            self.setData({
                index: _index,
                memberInfo: res.data,
                date: date
            });
        });
    },

    /**
     * 修改
     */
    formSubmit: function (e) {
        const self = this;
        util.showModal(null,"确定修改吗?",()=>{
            let formData = e.detail.value;
            formData = Object.assign({}, formData, {
                memberId: self.data.memberId,
                sex: self.data.sexArray[self.data.index],
                birthdayString: self.data.memberInfo.birthdayString ? self.data.memberInfo.birthdayString : self.data.date
            });
            util.doRequest({
                url: "member/updateMemberInfo",
                method: "POST",
                data: formData
            }, res => {
                util.showToast("修改成功");
                self.loadMemberInfo();
            });
        })
    },


    /**
     * 更新日期的值
     */
    bindDateChange: function (e) {
        const self = this;
        let memberInfo = self.data.memberInfo;
        memberInfo = Object.assign({}, memberInfo, {
            birthdayString: e.detail.value
        });
        this.setData({memberInfo: memberInfo});
    }

});