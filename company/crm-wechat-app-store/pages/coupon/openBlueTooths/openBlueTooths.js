Page({
    data:{
        connected:false,
    },

    // 打开蓝牙后
    changeData:function(){
      wx.showModal({
        title: '提示',
        content:"已成功连接蓝牙打印机！",
        showCancel: false,
        confirmText:"返回首页",
        success:function(res){
          if (res.confirm) {
            wx.navigateBack();
          } 
        }
      })
    },


  printTicket:function(){

  },


  onShow: function () {
    
  },
})