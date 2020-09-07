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
    htmlUrl: 'https://m.quickssend.com/file/h5/Join.html'
  },
  onLoad() {
    let htmlUrl = this.data.htmlUrl
    this.setData({
      htmlUrl: htmlUrl + '?timestamp=' + (new Date()).getTime()
    })
  }
})