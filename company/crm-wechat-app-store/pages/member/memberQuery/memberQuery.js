const util = require('../../../utils/util.js');
Page({
    data: {
        levelData: [],
        groupData: [],
        lifeCycleData: [],
        userDefinedData: [],
        tagDatas: []
    },
    onLoad: function (option) {
        let self = this;
        self.loadTags(option);
    },
    loadTags: function (option) {
        let self = this;
        util.doRequest({
            url: '/memberManager/tags'
        }, res => {
            self.setData({tagDatas: res.data});
            self.buildTagData(res.data, option);
        })
    },
    selectTag: function (event) {
        let self = this;
        const tagType = event.currentTarget.dataset.tagType;
        const index = event.currentTarget.dataset.index;
        if (tagType === 'LIFE_CYCLE') {
            self.data.lifeCycleData[index].select = !self.data.lifeCycleData[index].select;
            self.setData({lifeCycleData: self.data.lifeCycleData});
        } else if (tagType === 'LEVEL') {
            self.data.levelData[index].select = !self.data.levelData[index].select;
            self.setData({levelData: self.data.levelData});
        } else if (tagType === 'GROUP') {
            self.data.groupData[index].select = !self.data.groupData[index].select;
            self.setData({groupData: self.data.groupData});
        } else if (tagType === 'USER_DEFINED') {
            self.data.userDefinedData[index].select = !self.data.userDefinedData[index].select;
            self.setData({userDefinedData: self.data.userDefinedData});
        }
    },
    buildTagData: function (data,option) {
        let self = this;
        const levelData = [];
        const groupData = [];
        const lifeCycleData = [];
        const userDefinedData = [];

        data.forEach(function (value, key) {
            if (value.tagType === 'LIFE_CYCLE') {
                lifeCycleData.push(value);
            } else if (value.tagType === 'LEVEL') {
                levelData.push(value);
            } else if (value.tagType === 'GROUP') {
                groupData.push(value);
            } else if (value.tagType === 'USER_DEFINED') {
                userDefinedData.push(value);
            }
        });
        self.setData({
            levelData: levelData,
            groupData: groupData,
            lifeCycleData: lifeCycleData,
            userDefinedData: userDefinedData
        });
        if(option){
            self.initSelectTag(option);
        }
    },
    initSelectTag:function(option){
        let self = this;
        const tagType = option.tagType;
        const index = option.index;
        if (tagType === 'LIFE_CYCLE') {
            self.data.lifeCycleData[index].select = !self.data.lifeCycleData[index].select;
            self.setData({lifeCycleData: self.data.lifeCycleData});
        } else if (tagType === 'LEVEL') {
            self.data.levelData[index].select = !self.data.levelData[index].select;
            self.setData({levelData: self.data.levelData});
        } else if (tagType === 'GROUP') {
            self.data.groupData[index].select = !self.data.groupData[index].select;
            self.setData({groupData: self.data.groupData});
        } else if (tagType === 'USER_DEFINED') {
            self.data.userDefinedData[index].select = !self.data.userDefinedData[index].select;
            self.setData({userDefinedData: self.data.userDefinedData});
        }
    },
    formSubmit: function (e) {
        let self = this;
        const data = self.buildSubmitData(e);
        wx.setStorageSync("searchData", data);
        util.privateNavigateTo('../memberQueryResult/memberQueryResult');
    },
    formReset: function () {
        let self = this;
        self.buildTagData(self.data.tagDatas);
    },
    buildSubmitData(e) {
        let self = this;
        const levelIds = [];
        const memberGroupingIds = [];
        const userDefinedTagIds = [];
        const lifeCycleIds = [];
        self.data.levelData.forEach(function (value, key) {
            if (value.select) {
                levelIds.push(value.tagId);
            }
        });
        self.data.groupData.forEach(function (value, key) {
            if (value.select) {
                memberGroupingIds.push(value.tagId);
            }
        });
        self.data.lifeCycleData.forEach(function (value, key) {
            if (value.select) {
                lifeCycleIds.push(value.tagId);
            }
        });
        self.data.userDefinedData.forEach(function (value, key) {
            if (value.select) {
                userDefinedTagIds.push(value.tagId);
            }
        });
        return {
            name: e.detail.value.memberName,
            mobile: e.detail.value.mobile,
            levelIds: levelIds,
            memberGroupingIds: memberGroupingIds,
            userDefinedTagIds: userDefinedTagIds,
            lifeCycleIds: lifeCycleIds
        };
    }
});