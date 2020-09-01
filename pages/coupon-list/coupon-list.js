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
  // 公开劵列表
  queryList() {
    let params = {
      shopId: wx.getStorageSync('shopDetails').shopId
    }
    request('coupons/publiccouponslist', params).then(res => {
      let arr = res.data.data
      arr.forEach(item => {
        console.log('item.timeUseEnd',item.timeUseEnd)
        item.timeUseEnd = getStandardDate(item.timeUseEnd, 'year')
        if (item.gouponsGroupItemEsModelList.length>0) {
           item.gouponsGroupItemEsModelList.forEach(item => {
            item.useWayStr = app.getCouponDesc(item.useWay)
          })
        }
      })
      this.setData({
        list: arr
      })
    })
  },
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
  }
})