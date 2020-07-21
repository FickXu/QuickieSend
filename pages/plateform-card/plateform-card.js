import request from '../api/request'

const app = getApp()

Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    TabCur: '',
    customBar: app.globalData.CustomBar,
    title: '平台推广',
    iconUrl: '../images/bg-scan.png',
    menuList: [
      {
        value: '',
        label: '普通用户'
      },
      {
        value: '1',
        label: '医护人员'
      },
    ]
  },

  onLoad() {
    request('user/referralcode').then(res => {})
  },

  tabSelect(e) {
    let orderStatus = e.currentTarget.dataset.id
    this.setData({
      TabCur: orderStatus
    })
    // this.queryorderlist()
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