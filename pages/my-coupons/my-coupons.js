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
    let dataset = e.currentTarget.dataset
    let self = this
    wx.navigateTo({
      url: '../coupon-rule-info/coupon-rule-info',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        // 这里因为公开券列表接口和我的优惠券接口列表返回的不同的数据结构，而详情页面都是取列表的数据，所以需要重新处理下数据结构，传到优惠券详情页面
        let details = {
          groupBless: self.data.list[dataset.index].name,
          groupName: self.data.list[dataset.index].name,
          timeUseBegin: self.data.list[dataset.index].startTime,
          timeUseEnd: self.data.list[dataset.index].endTime,
          gouponsGroupItemEsModelList: [
            {
              amount: self.data.list[dataset.index].amount,
              conditions: self.data.list[dataset.index].conditions,
              useWay: self.data.list[dataset.index].useWay,
              useShopName: self.data.list[dataset.index].useShopName,
              useGoodTypeName: self.data.list[dataset.index].useGoodTypeName,
              useSpuName: self.data.list[dataset.index].useSpuName,
              groupBless: '',
            }
          ]
        }
        res.eventChannel.emit('sendCouponInfo', {
          data: details,
          cIndex: dataset.cIndex
        })
      }
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