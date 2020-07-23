const app = getApp();

Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    title: '法律条款'
  },

  // 用户协议
  openUserAgreementPage () {
    wx.navigateTo({
      url: './agreement-page/user-agreement/user-agreement'
    })
  },

  // 隐私协议
  openPrivacyAgreementPage () {
    wx.navigateTo({
      url: './agreement-page/privacy-agreement/privacy-agreement'
    })
  },
})