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
    wx.navigateTo({
      url: './child-page/introduce/introduce'
    })
  },
  // 反馈
  openFeedbackPage () {
    wx.navigateTo({
      url: './child-page/feedback/feedback'
    })
  },
})