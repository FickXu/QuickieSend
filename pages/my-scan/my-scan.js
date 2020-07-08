import request from '../api/request'

const app = getApp()

Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    customBar: app.globalData.CustomBar,
    title: '我的二维码',
    iconUrl: '../images/bg-scan.png'
  },

  onLoad() {
    request('user/referralcode').then(res => {})
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