const util = require('../../../utils/util.js');
Page({
    data: {
        userCountData: [],
        isShowUserCountBox: false,
        isCurrentSelectItem: false,
        currentUserName: '我的会员',
        memberTagList: {},
        currentActiveTag: "GROUP_-1",
        userId: -1,
        memberDataList: []
    },
    onLoad: function () {
        let self = this;
        self.loadMemberCountData();
        self.loadMemberTagData(-1);
    },
    showUserCountBox: function () {
        let self = this;
        self.setData({isShowUserCountBox: !this.data.isShowUserCountBox});
    },
    loadMemberTag: function (event) {
        let self = this;
        const userName = event.currentTarget.dataset.userName;
        // -2 加载该门店的所有会员标签 -1 默认加载当前登录店员的会员标签
        const userId = userName === '所有会员' ? -2 : event.currentTarget.dataset.userId;
        self.setData({
            currentUserName: userName,
            userId: userId,
            isShowUserCountBox: !this.data.isShowUserCountBox,
            currentActiveTag: "GROUP_-1"
        });
        self.loadMemberTagData(userId);
    },
    loadMemberTagData: function (userId) {
        let self = this;
        util.doRequest({
            url: '/memberManager/memberTag?userId=' + userId
        }, res => {
            self.setData({memberTagList: res.data});
        })
    },
    loadMemberCountData: function () {
        let self = this;
        util.doRequest({
            url: '/memberManager/memberCount'
        }, res => {
            self.setData({userCountData: res.data});
        })
    },
    loadMember: function (event) {
        let self = this;
        const memberCount = event.currentTarget.dataset.memberCount;
        const tagType = event.currentTarget.dataset.tagType;
        const tagObjectId = event.currentTarget.dataset.tagObjectId;
        const selectedTagIndex = event.currentTarget.dataset.currentIndex;
        if (memberCount === 0) {
            return;
        }
        const currentActiveTag = tagType + "_" + tagObjectId;
        if (self.data.currentActiveTag === currentActiveTag) {
            return;
        }
        if (memberCount > 20) {
          self.setData({ selectedTagIndex: selectedTagIndex, tagType: tagType});
        }
        if ("GROUP" === tagType) {
            self.loadMemberData({memberGroupingId: tagObjectId, sysUserId: self.data.userId}, currentActiveTag);
        } else {
            self.loadMemberData({lifeCycleId: tagObjectId, sysUserId: self.data.userId}, currentActiveTag);
        }
    },
    loadMemberData: function (data, currentActiveTag) {
        let self = this;
        util.doRequest({
            url: 'memberManager/listMember',
            method: 'POST',
            data: data
        }, res => {
            self.setData({memberDataList: res.data, currentActiveTag: currentActiveTag});
        })
    },
    goToMemberQuery:function (event){
        const self = this;
      util.privateNavigateTo("../memberQuery/memberQuery?index=" + self.data.selectedTagIndex+"&tagType="+self.data.tagType);
    },
    searchMember: function () {
        util.privateNavigateTo('../memberQuery/memberQuery');
    }
});