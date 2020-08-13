import request from '../api/request'

const app = getApp()

Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    customBar: app.globalData.CustomBar,
    title: '我的二维码',
    iconUrl: '',
    // 是否为推广人员
    isDelivery: false
  },

  onLoad() {
    this.getUserRole()
    request('user/referralcode').then(res => {
      this.setData({
        iconUrl: res.data.data
      })
    })
  },
  
  // 是否为推广人员
  getUserRole() {
    let params = {
      shopId: wx.getStorageSync('shopDetails').shopId
    }
    request('user/ispromoters', params).then(res => {
      this.setData({
        isDelivery: res.data.data
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