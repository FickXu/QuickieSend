import {getStandardDate} from '../../utils/util'
import request from '../api/request'

const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    title: '小二快跑',
    orderStatus: [
      {
        value: 0,
        label: '待送达'
      },
      {
        value: 1,
        label: '已送达'
      }
    ],
    orderList: [],
    orderListShow: true,
    params: {
      currentPage: 1,
      pagesize: 10
    }
  },
  onLoad() {
    this.queryorderlist()
  },
  // 获取订单列表
  queryorderlist() {
    wx.showLoading({
      title: '加载中...'
    })
    let params = {
      ...this.data.params,
      statue: this.data.TabCur   // 订单状态 0, 订单失效/取消;1, 待付款;2, 已付款待发货;3, 已下单待快递拿货; 4, 已发货待收货;5, 已收货待评价;6, 已评价)
    }
    let self = this
    request('order/receivinglist', params).then(res => {
      if (res.data.code == 10000) {
        if (res.data.data.length>0 && this.data.params.currentPage >= 1) {
          let data = res.data.data
          data.forEach(item => {
            item.payAmount = item.payAmount / 100,
            item.expressTime = getStandardDate(item.expressTime, 'year')
          })
          let _orderList = this.data.orderList
          self.setData({
            orderList: _orderList.concat(data),
            orderListShow: true
          })
        } else if (res.data.data.length==0 && this.data.params.currentPage == 1) {
          self.setData({
            orderList: [],
            orderListShow: false
          })
        }
        // wx.hideLoading()
      }
    })
  },
  // 滚动到底部时触发
  bindscrolltolower() {
    this.setData({
      'params.currentPage': ++this.data.params.currentPage
    })
    this.queryorderlist()
  },
  tabSelect(e) {
    let orderStatus = e.currentTarget.dataset.id
    this.setData({
      TabCur: orderStatus,
      orderList: []
    })
    this.queryorderlist()
  },
  // 拨打用户手机
  // 打电话
  callPhone: function(e) {
    let txt = e.currentTarget.dataset.text
    wx.makePhoneCall({
    phoneNumber: txt //仅为示例，并非真实的电话号码
    })
},
  // 扫码送货
  scanSendGoods() {
    let self = this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res => {
        let params = {
          orderNo: res.result
        }
        request('order/receiving', params).then(res => {
          wx.showToast({
            title: res.data.msg
          })
          self.queryorderlist()
        })
      }
    })
  },
  // 扫码完成配送
  scanFinishReceiving() {
    let self = this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res => {
        let params = {
          orderNo: res.result
        }
        wx.showLoading({
          title: '确认中...'
        })
        request('order/receivingdelivery', params).then(res => {
          wx.showToast({
            title: res.data.msg
          })
          wx.hideLoading()
          self.queryorderlist()
        })
      }
    })
  },
  // 确认送达
  confirmReceiving(e) {
    let self = this
    let params = {
      orderNo: e.currentTarget.dataset.orderNo
    }
    wx.showLoading({
      title: '确认中...'
    })
    request('order/receivingdelivery', params).then(res => {
      wx.showToast({
        title: res.data.msg
      })
      wx.hideLoading()
      self.queryorderlist()
    })
  },
  // 取消订单
  cancelOrder(e) {
    let self = this
    wx.showModal({
      title: '取消订单',
      content: '确定取消订单吗？',
      success (res) {
        if (res.confirm) {
          let params = {
            orderId: e.currentTarget.dataset.orderId,
            openId: app.globalData.openId
          }
          request('order/canelorder', params).then(res => {
            if (res.data.code == 10000) {
              wx.showToast({
                title: res.data.msg,
                success() {
                  self.queryorderlist()
                }
              })
            }
          })
        }
      }
    })
  },
  // 确认到货
  confirmgoods(e) {
    let params = {
      orderId: e.currentTarget.dataset.orderId,
      openId: app.globalData.openId
    }
    let self = this
    request('order/confirmgoods', params).then(res => {
      if (res.data.code == 10000) {
        wx.showToast({
          title: res.data.msg,
          success() {
            self.queryorderlist()
          }
        })
      }
    })
  }
})

