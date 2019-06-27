const app = getApp();
const util = require('../../../utils/util.js');
Page({
    data: {
        userCountData: [],
        isShowUserCountBox: false,
        currentUserName: '我的会员',
        hidden: true,
        scrollTop: 0,
        pageMember: {
            page: 0,
            size: 10,
            content: [],
            recordsFiltered: 0
        },
        params: {
            page: 0,
            size: 10,
            onlySearchMyUserMember: 'Y'
        },
        showMemberListBox: false,
        checkedAll: false,
        selectedMemberNum: 0,
        userList: [],
        selectedUserId: -1
    },
    onLoad: function () {
        let self = this;
        const params = self.data.params;
        self.loadMemberCountData();
        self.loadPageMember(params.page, params.size);
        self.loadUser();
        self.setData({
            windowHeight: app.globalData.windowHeight,
            windowWidth: app.globalData.windowWidth
        });
    },
    showUserCountBox: function () {
        let self = this;
        self.setData({isShowUserCountBox: !this.data.isShowUserCountBox});
    },
    loadUser: function () {
        let self = this;
        util.doRequest({
            url: '/memberManager/listUser'
        }, res => {
            self.setData({userList: res.data});
        });
    },
    selectUser: function (event) {
        const self = this;
        const userId = event.currentTarget.dataset.userId;
        self.setData({selectedUserId: userId});
    },
    loadMember: function (event) {
        let self = this;
        const userName = event.currentTarget.dataset.userName;
        const params = {page: 0, size: 10};

        if (userName === '所有会员') {
            params.isSearchAllMember = 'Y';
        } else if (userName === '未分配') {
            params.isUnDistribution = 'Y';
        } else if (userName === '我的会员') {
            params.onlySearchMyUserMember = 'Y';
        } else {
            params.sysUserId = event.currentTarget.dataset.userId;
        }

        self.setData({
            currentUserName: userName,
            isShowUserCountBox: !self.data.isShowUserCountBox,
            params: params,
            pageMember: {
                page: 0,
                size: 10,
                content: [],
                recordsFiltered: 0
            }
        });
        self.loadPageMember(params.page, params.size);
    },
    loadPageMember: function (page, size) {
        let self = this;
        const params = self.data.params;
        params.page = page;
        params.size = size;
        util.doRequest({
            url: 'memberManager/searchMember',
            method: 'POST',
            data: params
        }, res => {
            const pageMember = self.data.pageMember;
            self.setData({
                pageMember: {
                    page: page,
                    size: size,
                    content: pageMember.content.concat(res.data.data),
                    recordsFiltered: res.data.recordsFiltered
                },
                memberList: pageMember.content.concat(res.data.data),
                hidden: true
            });
        });
    },
    loadMemberCountData: function () {
        let self = this;
        util.doRequest({
            url: '/memberManager/memberCount'
        }, res => {
            self.setData({userCountData: res.data});
        });
    },
    selectMember: function (event) {
        const self = this;
        const index = event.currentTarget.dataset.index;
        let pageMember = self.data.pageMember;
        let memberList = pageMember.content;
        memberList[index].selected = !memberList[index].selected;

        //全选
        let selectedNum = 0;
        memberList.forEach(function (value) {
            if (value.selected) {
                selectedNum++;
            }
        });
        self.setData({
            pageMember: {
                page: pageMember.page,
                size: pageMember.size,
                content: memberList,
                recordsFiltered: pageMember.recordsFiltered
            },
            selectedMemberNum: selectedNum
        });
        if (pageMember.content.length === selectedNum) {
            self.setData({checkedAll: true});
        } else {
            self.setData({checkedAll: false});
        }
    },
    selectedAll: function () {
        const self = this;
        let pageMember = self.data.pageMember;
        let memberList = pageMember.content;
        const checkedAll = !self.data.checkedAll;
        memberList.forEach(function (value, key) {
            if (checkedAll) {
                memberList[key].selected = true;
            } else {
                memberList[key].selected = false;
            }
        });
        self.setData({
            pageMember: {
                page: pageMember.page,
                size: pageMember.size,
                content: memberList,
                recordsFiltered: pageMember.recordsFiltered
            },
            selectedMemberNum: memberList.length,
            checkedAll: checkedAll
        });
    },
    assignMember: function () {
        let self = this;
        self.setData({showMemberListBox: !self.data.showMemberListBox});
    },
    submit: function () {
        let self = this;
        if (self.data.selectedUserId === -1) {
            util.showToast("请选择店员");
            return;
        }

        // 获取要提交的参数
        let pageMember = self.data.pageMember;
        let memberList = pageMember.content;
        let memberIds = [];
        memberList.forEach(function (value, key) {
            if (value.selected) {
                memberIds.push(value.memberId);
            }
        });
        if (memberIds.length === 0) {
            util.showToast("请选择会员");
            return;
        }

        util.doRequest({
            url: 'memberManager/assignMember',
            method: 'POST',
            data: {memberIds: memberIds, userId: self.data.selectedUserId}
        }, res => {
            const params = self.data.params;
            params.page = 0;
            params.size = 10;

            self.setData({
                showMemberListBox: !self.data.showMemberListBox,
                checkedAll: false,
                selectedUserId: -1,
                selectedMemberNum: 0,
                params: params,
                pageMember: {
                    page: 0,
                    size: 10,
                    content: [],
                    recordsFiltered: 0
                }
            });
            self.loadMemberCountData();
            self.loadPageMember(params.page, params.size);
        });
    },
    /**
     * 上滑事件（只有在有滚动条的情况下，并且已经滑到底部的时候才能触发）
     */
    pullUpLoad: function () {
        let self = this;
        if (self.isHaveNextPage()) {
            const pageMember = self.data.pageMember;
            self.setData({hidden: false});
            setTimeout(() => {
                self.loadPageMember(pageMember.page + 1, pageMember.size);
            }, 800)
        }
    },
    /**
     * 是否还有下一页
     */
    isHaveNextPage: function () {
        let self = this;
        const pageMember = self.data.pageMember;
        return pageMember.size * (pageMember.page + 1) < pageMember.recordsFiltered;
    },
    /**
     * 定位数据（实际高度）
     * @param event
     */
    scroll: function (event) {
        let self = this;
        self.setData({
            scrollTop: event.detail.scrollTop
        });
    },
});