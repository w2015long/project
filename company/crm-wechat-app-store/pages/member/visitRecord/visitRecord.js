const util = require('../../../utils/util.js');
Page({
    data: {
        customerVisitList:[]
    },
    onShow: function () {
        let self = this;
        util.doRequest({
            url: '/face/faceList'
        }, res => {
            self.setData({customerVisitList: res.data});
          console.log(res.data);
        })
  },


  onPullDownRefresh: function () {
    let self = this;
    util.doRequest({
      url: '/face/faceList'
    }, res => {
      self.setData({ customerVisitList: res.data });
    })
  }
});