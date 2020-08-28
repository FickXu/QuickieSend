import request from '../../api/request'
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  properties: {
  },
  observers: {
  },
  data: {
    couponList: []
  },
  lifetimes: {
    ready () {
      this.queryList()
    },
  },
  methods: {
    // 获取优惠券列表
    queryList() {
      let params = {
        shopId: wx.getStorageSync('shopDetails').shopId
      }
      // 公开劵列表
      request('coupons/publiccouponslist', params).then(res => {
        this.setData({
          couponList: res.data.data
        })
      })
    },
    // 领取优惠券
    pullCoupon() {
      wx.navigateTo({
        url: '../../pages/coupon-list/coupon-list'
      })
    }
  }
})