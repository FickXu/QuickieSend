import request from '../api/request'

const app = getApp()

Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    customBar: app.globalData.CustomBar,
    title: '我的二维码',
    iconUrl: ''
  },

  onLoad() {
    request('user/referralcode').then(res => {
      this.setData({
        iconUrl: res.data.data
      })
    })
  },

  // 购物详情页
  openShopingDetailPage() {
    wx.navigateTo({
      url: '../shoping-detail/shoping-detail'
    })
  },

  // 消费记录页
  openConsumeRecordPage() {
    wx.navigateTo({
      url: '../consumer-details/consumer-details'
    })
  }

})