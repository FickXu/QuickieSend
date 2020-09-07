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
    title: '广告',
    htmlUrl: ''
  },
  onLoad(query) {
    let htmlUrl = query.htmlUrl
    this.setData({
      htmlUrl: htmlUrl + '?timestamp=' + (new Date()).getTime()
    })
  }
})