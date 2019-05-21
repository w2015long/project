var { articles } = require('../../../data/db.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaying:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var articleId = options.articleId;
    var article = articles[articleId];
    //处理收藏状态
    var collect_articel = wx.getStorageSync('collect_articel');
    //缓存对应的id 到data中 
    this.data[articleId] = articleId;
    /**
     * "0":false,
     * "1":true
     */
    var isCollected = false; 
    if (!collect_articel){
      this.data[articleId] = false;
      wx.setStorageSync('collect_articel', this.data)
    }else{
      isCollected = !!collect_articel[articleId]
    }
    //监听音乐相关事件
    var BackgroundAudioManager = wx.getBackgroundAudioManager();
    BackgroundAudioManager.onPlay(function(){
      this.setData({
        isPlaying: true
      })
    }.bind(this));
    BackgroundAudioManager.onPause(function(){
      this.setData({
        isPlaying: false
      })
    }.bind(this))
  
    this.setData({ ...article, isCollected: isCollected});
  },
  //收藏
  tapCollect:function(){
    
    var collect_articel = wx.getStorageSync('collect_articel');
    var isCollected = collect_articel[this.data.articleId];
    //改变storage里面的数据
    collect_articel[this.data.articleId] = !isCollected;
    wx.setStorageSync('collect_articel', collect_articel);
    ////改变视图页面
    this.setData({
      isCollected:!isCollected
    },function(){
      wx.showToast({
        title: isCollected　? '取消收藏' : '收藏成功' ,
      })
    }.bind(this))
  },

  /**
   * 处理分享
   */
  tapShare:function(){
    var list = ['分享到朋友圈','分享到微博','分享到QQ']
    wx.showActionSheet({
      itemList: list ,
      success(res){
        wx.showToast({
          title:list[res.tapIndex]+'成功'
        })
      }
    })
  },
  /**
   * 处理背景音乐
   */
  tapMusic:function(){
  
    var BackgroundAudioManager = wx.getBackgroundAudioManager();

    var isPlaying = this.data.isPlaying;
    if(isPlaying){
      BackgroundAudioManager.pause();
      this.setData({
        isPlaying:false
      })
    }else{
      var music = articles[this.data.articleId].music;
     
      BackgroundAudioManager.src = music.src;
      BackgroundAudioManager.title = music.title;
      BackgroundAudioManager.coverImgUrl = music.cover;

      // BackgroundAudioManager.play();
      this.setData({
        isPlaying: true
      })    
    }
  }
})