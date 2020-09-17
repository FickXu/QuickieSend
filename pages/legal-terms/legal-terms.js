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
    let url = 'https://m.quickssend.com/file/h5/userAgreement.html'
    wx.navigateTo({
      url: `../advertising/advertising?htmlUrl=${url}`
    })
  },

  // 隐私协议
  openPrivacyAgreementPage () {
    let url = 'https://m.quickssend.com/file/h5/privacyAgreement.html'
    wx.navigateTo({
      url: `../advertising/advertising?htmlUrl=${url}`
    })
  },
})