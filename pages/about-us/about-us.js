const app = getApp();
// pages/home/home.js
Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    title: '关于我们',
  },
  // 关于我们介绍
  openIntroducePage () {
    let url = 'https://m.quickssend.com/file/h5/Join.html'
    wx.navigateTo({
      url: `../advertising/advertising?htmlUrl=${url}`
    })
  },
  // 反馈
  openFeedbackPage () {
    wx.navigateTo({
      url: './child-page/feedback/feedback'
    })
  },
})