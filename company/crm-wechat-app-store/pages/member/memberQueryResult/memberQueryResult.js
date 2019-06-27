const app = getApp();
const util = require('../../../utils/util.js');
Page({
    data: {
        params: {},
        myMemberCount: 0,
        onlySearchMyUserMember: false,
        hidden: true,
        scrollTop: 0,
        pageMember: {
            page: 0,
            size: 10,
            content: [],
            recordsFiltered: 0
        },
    },
    onLoad: function () {
        let self = this;
        self.getSearchParmas();
        self.loadPageMember(self.data.pageMember.page);
        self.getMyMemberCount();
        self.setData({
            windowHeight: app.globalData.windowHeight,
            windowWidth: app.globalData.windowWidth
        });
    },
    /**
     * 获取筛选的查询参数
     */
    getSearchParmas: function () {
        let self = this;
        const data = wx.getStorageSync("searchData");
        wx.removeStorageSync("searchData");
        self.setData({params: data});
    },
    /**
     * 分页加载会员
     */
    loadPageMember: function (page) {
        let self = this;
        const params = self.data.params;
        const pageMember = self.data.pageMember;
        params.page = page;
        params.size = pageMember.size;
        params.onlySearchMyUserMember = self.data.onlySearchMyUserMember ? 'Y' : 'N';
        util.doRequest({
            url: '/memberManager/searchMember',
            method: 'POST',
            data: params
        }, res => {
            const pageMember = self.data.pageMember;
            self.setData({
                pageMember: {
                    page: page,
                    size: pageMember.size,
                    content: pageMember.content.concat(res.data.data),
                    recordsFiltered: res.data.recordsFiltered
                },
                hidden: true
            });
        })
    },
    /**
     * 查询我的会员总数
     */
    getMyMemberCount: function () {
        let self = this;
        util.doRequest({
            url: '/memberManager/myMemberCount',
            method: 'POST',
            data: self.data.params
        }, res => {
            self.setData({myMemberCount: res.data});
        })
    },
    /**
     * 只查询我的会员
     */
    searchMyMember: function () {
        let self = this;
        self.setData({
            onlySearchMyUserMember: !self.data.onlySearchMyUserMember,
            pageMember: {
                page: 0,
                size: 10,
                content: [],
                recordsFiltered: 0
            }
        });
        self.loadPageMember(self.data.pageMember.page);
    },
    /**
     * 上滑事件（只有在有滚动条的情况下，并且已经滑到底部的时候才能触发）
     */
    pullUpLoad: function () {
        let self = this;
        if (self.isHaveNextPage()) {
            const page = self.data.pageMember.page + 1;
            self.setData({hidden: false});
            setTimeout(() => {
                self.loadPageMember(page);
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