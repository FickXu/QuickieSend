import request from '../api/request'

const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '扫码识别推荐人',
    details: null,
    promotionId: ''
  },
  // 扫码送货
  scanGetReferrer() {
    let self = this
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        let params = {
          promotionId: res.path.split('?')[1].split('=')[1]
        }
        wx.showLoading({
          title: '查询中...',
        })
        request('base/findcustomerbypromotionid', params).then(res => {
          self.setData({
            details: res.data.data,
            promotionId: params.promotionId
          })
        })
      }
    })
  }
})

