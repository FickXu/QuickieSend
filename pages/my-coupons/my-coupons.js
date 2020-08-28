import request from '../api/request'
import {convertRMB, getStandardDate} from '../../utils/util'

const app = getApp();

Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    title: '我的卡券',
    list: [],
    orderStatus: [
      {
        value: '',
        label: '全部'
      },
      {
        value: '0',
        label: '未使用'
      },
      {
        value: '1',
        label: '已使用'
      },
      {
        value: '2',
        label: '已过期'
      }
    ],
    TabCur: ''
  },
  onLoad() {
    this.queryList()
  },
  // 立即使用
  openHomePage() {
    wx.navigateTo({
      url: '../home/home',
    })
  },
  // 获取我的优惠券列表
  queryList() {
    wx.showLoading({
      title: '加载中...'
    })
    let params = {
      shopId: wx.getStorageSync('shopDetails').shopId,
      statue: this.data.TabCur
    }
    request('coupons/couponlist', params).then(res => {
      wx.hideLoading()
      let arr = res.data.data
      if (arr.length > 0) {
        arr.forEach(item => {
          item.endTime = getStandardDate(item.endTime, 'year')
        })
      }
      this.setData({
        list: arr
      })
    })
  },
  // 优惠券详情
  goToRuleDetail(e) {
    wx.navigateTo({
      url: '../coupon-rule-info/coupon-rule-info'
    })
  },
  tabSelect(e) {
    let orderStatus = e.currentTarget.dataset.id
    this.setData({
      TabCur: orderStatus
    })
    this.queryList()
  },
})