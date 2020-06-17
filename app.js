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
	globalData: {
    userInfo: null,
    // 默认图片-联系我们
    defalultImageUrlLXWM: 'https://dssjewel.com/file/basic/lxwm.png',
    // 默认图片-客服跟进
    defalultImageUrlKFGJ: 'https://dssjewel.com/file/basic/4.png',
    // 默认图片-空托
    defalultImageUrlTz: 'https://dssjewel.com/file/basic/tzdefault.png',
    // 默认图片-gia
    defalultImageUrlGia: 'https://dssjewel.com/file/basic/giadefault.png',
    openId: wx.getStorageSync('openId'),
    isIpx: false,   //适配IPhoneX
    loginCode: 0
	}
})