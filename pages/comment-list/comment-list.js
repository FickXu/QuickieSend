import request from '../api/request'

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    customBar: app.globalData.CustomBar,
    title: '商品评价列表',
    // 评论列表
    commentList: []
  },

  onLoad(query) {
    let detailId = query.detailId
    this.queryCommentList(detailId)
  },

  // 获取评论列表
  queryCommentList(id) {
    wx.showLoading({
      title: '加载中...'
    })
    let params = {
      spuId: id
    }
    request('order/commentlist', params).then(res => {
      this.setData({
        commentList: res.data.data
      })
      wx.hideLoading()
    })
  },
})