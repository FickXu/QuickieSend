import request from '../api/request'
import {getStandardDate} from '../../utils/util'

const app = getApp();

Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    title: '优惠券',
    list: [],
  },
  onLoad() {
    this.queryList()
  },
  // 用户领券
  quickPullCoupon(e) {
   app.isLogin().then(() => {
     let dataset = e.currentTarget.dataset
     let params = {
       gouponsGroupId: dataset.id
     }
     request('coupons/ledthesecurities', params).then(res => {
       wx.showToast({
         title: res.data.msg,
       })
     })
   })
  },
  // 公开劵列表
  queryList() {
    let params = {
      shopId: wx.getStorageSync('shopDetails').shopId
    }
    request('coupons/publiccouponslist', params).then(res => {
      let arr = res.data.data
      arr.forEach(item => {
        item.timeUseEnd = getStandardDate(item.timeUseEnd, 'year')
      })
      this.setData({
        list: arr
      })
    })
  },
  goToRuleDetail(e) {
    wx.navigateTo({
      url: '../coupon-rule-info/coupon-rule-info'
    })
  }
})