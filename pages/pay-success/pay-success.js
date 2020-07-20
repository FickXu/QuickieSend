const app = getApp();

Page({
  options: {
    addGlobalClass: true
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    title: "支付成功",
    // 搜索条件
    commodityList: [],
    layoutType: 'row',
  },

  onLoad() {
    let self = this
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('sendOrderInfo', function(data) {
      console.log(data)
      self.setData({
        commodityList: data.orderInfo.mallOrderInfoList,
      })
    })
  },

  // 返回首页
  openHomePage() {
    // 获取当前页面栈
    let pages = getCurrentPages()
    wx.navigateBack({
      delta: pages.length - 1
    })
  }
})