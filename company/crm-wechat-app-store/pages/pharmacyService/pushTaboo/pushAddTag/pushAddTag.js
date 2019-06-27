const util = require('../../../../utils/util.js');
Page({

  /**
   * 组件的初始数据
   */
  data: {
    tagList: "",                          //上一页标签 
    thisTagIndexList: [],                 //本页的标签index 
    selectTagList: [],                    //选中的标签 
    keyword: "",                          //搜索条件
    pageDiseaseTag: {                     //page对象
      recordsFiltered: 0,
      data: [],
      page: 0,
      size: 10
    },
    isLastReqFin: true,                   //上次请求是否结束
    searchParam: {
      keyword: "",                        //搜索条件
      page: 0,                            //页码
      size: 10,                           //每页大小
    }
  },
  /**
    * 页面加载设置当前状态
    */
  onLoad: function (options) {
    const self = this;
    self.setData({
      tagList: wx.getStorageSync("tagList"),
    })
    wx.removeStorageSync("tagList");
    self.loadData();
  },
  /**
   * 搜索
   */
  tagSearch: function (e) {
    const self = this;
    self.setData({
      ["searchParam.keyword"]: e.detail.value,
    })
    self.loadData();
  },
  /**
       * 加载数据
       * @param isLoadMore 是否加载更多
       */
  loadData: function (isLoadMore) {
    const self = this;
    util.doRequest({
      url: "userAndTaboo/pageDiseaseTagXcx",
      data: self.data.searchParam 

    }, res => {
      //加载更多为拼接 否则覆盖
      let pageDiseaseTag = {
        page: res.data.page,
        size: res.data.size,
        recordsFiltered: res.data.recordsFiltered,
        data: isLoadMore ? self.data.pageDiseaseTag.data.concat(res.data.data) : res.data.data
      };
      self.setData({
        pageDiseaseTag: pageDiseaseTag,
        isLastReqFin: true,
        isShowLoadMore: false
      });
    })
  },
  /**
  * 上滑加载更多
  */
  pullUpLoad: function () {
    const self = this;
    if (self.data.isLastReqFin && self.isHaveNextPage()) {
      self.setData({
        ["searchParam.page"]: self.data.searchParam.page + 1
      }, () => self.loadData(true));
    }
  },
  /**
   * 判断是否还有下一页
   */
  isHaveNextPage: function () {
    const self = this;
    const pageDiseaseTag = self.data.pageDiseaseTag;
    return pageDiseaseTag.size * (pageDiseaseTag.page + 1) < pageDiseaseTag.recordsFiltered;
  },
  formSubmit: function (e) {
    const self = this;
    const thisTagIndexList = self.data.thisTagIndexList;//选中的标签
    const tagList = self.data.tagList;//上一页标签

    
      tagList.map((items, indexs) => {//循环上一页标签
        thisTagIndexList.map((item, index) => {//循环选中的标签
          if (items.diseaseTagId === item.diseaseTagId){
            self.data.thisTagIndexList.splice(index, 1);//从index为i的位置开始，删除1个元素
          }
        });
      });
    self.setData({
      tagList: tagList.concat(thisTagIndexList)
    });

    /**
         * 更新上一页的数据
         */
    let pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      let prePage = pages[pages.length - 2];
      prePage.tagRefresh(self.data.tagList);
      wx.navigateBack();
    }
  },
  /**
   * 点击标签
   * 统计点击的标签，改变一点击的标签
   */
  bindtapTag: function (e) {
    const self = this;
    const pageDiseaseTag = self.data.pageDiseaseTag;
    const indexList = self.data.thisTagIndexList;
    const index = e.currentTarget.dataset.index;
    for (let i = 0; i < indexList.length;i++){
      if (indexList[i].diseaseTagId === e.currentTarget.dataset.diseaseTagId) {
        self.data.thisTagIndexList.splice(i, 1);//从index为i的位置开始，删除1个元素
        self.setData({
          ["pageDiseaseTag.data[" + index + "].itemSelected"]: ""
        });
          return;
      }
    }
    self.setData({
      thisTagIndexList: self.data.thisTagIndexList.concat(e.currentTarget.dataset.item) ,
      ["pageDiseaseTag.data[" + index+"].itemSelected"]: "item-selected"
    });
  },
})