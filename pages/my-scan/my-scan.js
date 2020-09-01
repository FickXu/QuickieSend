import request from '../api/request'
import {getStandardDate} from '../../utils/util'

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
    isDelivery: false,
    // 店铺可用优惠券列表
    list: []
  },
  onLoad() {
    // 获取用户角色
    this.getUserRole()
    // 获取二维码
    this.getMyScan()
    // 获取店铺可用优惠券
    this.getShopCoupons()
  },
  // 用户领券
  quickPullCoupon(e) {
    app.isLogin().then(() => {
      let dataset = e.currentTarget.dataset
      let params = {
        gouponsGroupId: dataset.id
      }
      wx.showLoading({
        title: '领取中...',
      })
      request('coupons/ledthesecurities', params).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: res.data.msg,
        })
      })
    })
  },
  // 优惠券详情
  goToRuleDetail(e) {
    let self = this
    let dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '../coupon-rule-info/coupon-rule-info',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendCouponInfo', {
          data: self.data.list[dataset.index],
          cIndex: dataset.cIndex
        })
      }
    })
  },
  // 获取店铺可用优惠券
  getShopCoupons() {
    let params = {
      shopId: wx.getStorageSync('shopDetails').shopId
    }
    request('coupons/promotecouponslist', params).then(res => {
      let arr = res.data.data
      arr.forEach(item => {
        item.timeUseEnd = getStandardDate(item.timeUseEnd, 'year')
      })
      this.setData({
        list: arr
      })
    })
  },
  // 获取二维码
  getMyScan() {
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