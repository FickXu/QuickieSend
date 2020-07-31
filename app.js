//app.js
App({
	onLaunch: function() {

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }

        let modelmes = e.model; //手机品牌
        if (modelmes.indexOf('iPhone X') != -1) {　　//XS,XR,XS MAX均可以适配,因为indexOf()会将包含'iPhone X'的字段都查出来
          this.globalData.isIpx = true
        }
      }
    })
  },
  isLogin() {
    return new Promise((resolve, reject) => {
      let isLogin = wx.getStorageSync('isLogin') || false
      if (!isLogin) {
        // 用户没有登录
        wx.showModal({
          title: '提示',
          content: '用户未登录，请重新登录',
          success (res) {
            if (res.confirm) {
              wx.removeStorageSync('openId')
              wx.removeStorageSync('isLogin')
              wx.removeStorageSync('userInfo')
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        })
        reject()
      } else {
        resolve()
      }
    })
  },
	globalData: {
    // 用户是否已经登录
    isLoin: wx.getStorageSync('isLogin'),
    userInfo: wx.getStorageSync('userInfo'),
    isIpx: false,   //适配IPhoneX
	}
})