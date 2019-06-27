const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabType: "memberPortrait",
        customerVisitRecords: [],
        memberOrders: [],
        aboutCustomers: [],
        memberId: false,
        faceUid: false,
        group: [],
        level: [],
        lifecycle: [],
        userDefined: [],
        disease: [],
        isEditGroup: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
        this.setData({
            memberId: option.memberId === "null" ? null : option.memberId,
            faceUid: option.faceUid === "null" ? null : option.faceUid,
            customerVisitRecordId: option.customerVisitRecordId === "null" ? null : option.customerVisitRecordId
        });
    },

    /**
     * 注册
     */
    register: function () {
        const self = this;
        if (!self.data.customerName) {
            util.showToast("请填写姓名","none");
            return;
        }
        if (!self.data.customerMobile || self.data.customerMobile.length<11) {
          util.showToast("请填写正确手机号", "none");
            return;
        }
        util.doRequest({
                url: "member/saveMemberForXCXClerkSignUp", method: "POST",
                data: {
                    name: self.data.customerName,
                    mobile: self.data.customerMobile,
                    customerVisitRecordId: self.data.customerVisitRecordId
                }
            }, res => {
                util.showToast("注册会员成功");
                self.setData({memberId: res.data.memberId});
                self.loadMemberPortrayalInfo();
            }
        );

    },

    /**
     * 拿到会员手机号码
     */
    getCustomerMobile: function (e) {
        this.setData({customerMobile: e.detail.value});
    },

    /**
     * 拿到会员姓名
     */
    getCustomerName: function (e) {
        this.setData({customerName: e.detail.value});
    },

    /**
     * 拨打电话
     */
    makeCall: function () {
        const self = this;
        if (self.data.memberInfo.mobile) {
            wx.makePhoneCall({
                phoneNumber: self.data.memberInfo.mobile, //此号码并非真实电话号码，仅用于测试
                success: function () {
                    console.log("拨打电话成功！")
                },
                fail: function () {
                    console.log("拨打电话失败！")
                }
            })
        }
    },

    /**
     * 跳转到离店记录
     */
    goToLeaveRecord: function () {
        const self = this;
        util.privateNavigateTo("/pages/member/leaveRecord/leaveRecord?customerVisitRecordId=" + self.data.customerVisitRecordId);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const self = this;
        if (self.data.memberId) {
            //加载会员画像
            self.loadMemberPortrayalInfo();
            //加载来访顾客
            util.doRequest({url: "member/customerVisitRecords?memberId=" + self.data.memberId}, res => {
                self.setData({customerVisitRecords: res.data.data});
            });
            //加载消费记录
            util.doRequest({url: "member/memberOrders?memberId=" + self.data.memberId}, res => {
                self.setData({memberOrders: res.data.data});
            });
        } else {
            //加载非会员画像
            util.doRequest({url: "member/nonmemberPortrayalInfo?faceId=" + self.data.faceUid}, res => {
                self.setData({memberInfo: res.data});
            });
            //加载非会员来访顾客
            util.doRequest({url: "member/customerVisitRecords?faceUid=" + self.data.faceUid}, res => {
                self.setData({customerVisitRecords: res.data.data});
            });
            //加载非会员消费记录
            util.doRequest({url: "member/memberOrders?faceUid=" + self.data.faceUid}, res => {
                self.setData({memberOrders: res.data.data});
            });
        }
        //加载对Ta了解
        util.doRequest({url: "member/aboutCustomer?faceUid=" + self.data.faceUid}, res => {
            self.setData({aboutCustomers: res.data.data});
        });
    },

    /**
     * 跳转去编辑会员
     */
    goToUpdateMember: function () {
        const self = this;
        util.privateNavigateTo("/pages/member/updateMember/updateMember?memberId=" + self.data.memberId);
    },

    /**
     * 加载会员画像
     */
    loadMemberPortrayalInfo: function () {
        const self = this;
        util.doRequest({url: "member/memberPortrayalInfo?memberId=" + self.data.memberId}, res => {
            let level = [], group = [], lifecycle = [], disease = [], userDefined = [];
            if (res.data.tags.length > 0) {
                res.data.tags.map((tag, index) => {
                    if (tag.tagType === "LEVEL") {
                        level.push(tag);
                    }
                    if (tag.tagType === "GROUP") {
                        group.push(tag);
                    }
                    if (tag.tagType === "LIFE_CYCLE") {
                        lifecycle.push(tag);
                    }
                    if (tag.tagType === "DISEASE") {
                        disease.push(tag);
                    }
                    if (tag.tagType === "USER_DEFINED") {
                        userDefined.push(tag);
                    }
                });
            }
            self.setData({
                memberInfo: res.data,
                level: level,
                group: group,
                lifecycle: lifecycle,
                disease: disease,
                userDefined: userDefined
            });
        });
    },

    /**
     * 切换会员分组编辑状态
     */
    editGroup: function (e) {
        const self = this;
        this.setData({isEditGroup: !self.data.isEditGroup});
        let tags = [];
        self.data.group.map((tag, index) => {
            if (tag.select) {
                tags.push(tag.tagId + "-" + tag.tagTitle);
            }
        });
        if (!self.data.isEditGroup) {
            util.doRequest({
                url: "member/editTag",
                data: {
                    "tagType": "GROUP",
                    "tags": tags.toString(),
                    "memberId": self.data.memberId
                },
                method: "POST"
            }, res => {
                util.showToast("编辑标签成功");
                self.loadMemberPortrayalInfo();
            })
        }
    },

    /**
     * 选中或者取消
     */
    selectOrCancel: function (e) {
        const self = this;
        if (!self.data.isEditGroup) {
            return;
        }
        let index = e.target.dataset.index;
        const group = self.data.group;
        group[index].select = !group[index].select;
        self.setData({
            group: group
        });
    },

    /**
     * 切换tab
     */
    changeTab: function (e) {
        this.setData({tabType: e.currentTarget.dataset.id});
    },

    /**
     * 提交对Ta了解表单
     */
    formSubmit: function (e) {
        const self = this;
        if (!e.detail.value.content) {
            util.showToast("请输入对Ta的了解", "none");
            return;
        }
        util.doRequest({
            url: "member/saveAboutCustomer",
            data: {
                content: e.detail.value.content,
                faceUid: self.data.faceUid
            }
        }, res => {
            util.showToast("发表成功");
            self.setData({content: ""});
            //重新加载对Ta了解
            util.doRequest({url: "member/aboutCustomer?faceUid=" + self.data.faceUid}, json => {
                self.setData({aboutCustomers: json.data.data});
            });
        })
    }

});