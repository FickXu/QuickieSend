import {getStandardDate} from '../../utils/util'
import request from '../api/request'

const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: '',
    title: '订单详情',
    orderStatus: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 1,
        label: '待支付'
      },
      {
        value: 4,
        label: '待发货'
      },
      {
        value: 5,
        label: '待收货'
      },
      {
        value: 6,
        label: '已完成'
      }
    ],
    orderList: [],
    details: null,
    isShow: false,
    overTime: '30:00'
  },
  onLoad(params) {
    let orderNo = params.orderNo
    // let value = ''
    // switch (type) {
    //   case '待发货':
    //     value = 1
    //     break;
    //   case '待收货':
    //     value = 2
    //     break;
    //   case '已完成':
    //     value = 3
    //     break;
    //   default:
    //     value = ''
    //     break;
    // }
    // this.setData({
    //   TabCur: value
    // })
    this.queryorderInfo(orderNo)
  },
  // 获取订单列表
  queryorderInfo(orderNo) {
    wx.showLoading({
      title: '加载中...'
    })
    let params = {
      orderNo: orderNo
    }
    let self = this
    request('order/info', params).then(res => {
      if (res.data.code == 10000) {
        let obj = res.data.data
        obj.submitTime = getStandardDate(obj.submitTime, 'year')
        self.setData({
          details: obj
        })
        wx.hideLoading()
        this.setInterval()
      }
    })
  },

  onUnload() {
    this.clearInterval()
  },

  // 计时器
  setInterval() {
    let subTime = new Date(this.data.details.submitTime).getTime()
    let overTime = subTime + 30 * 60 * 1000
    this.data.timeInterval = setInterval(() => {
      let time = getStandardDate(overTime - new Date().getTime(), 'ms')
      this.setData({
        overTime: time
      })
      console.log('time', time)
    }, 1000)
  },

  // 清空定时器
  clearInterval() {
    clearInterval(this.data.timeInterval)
  },
  
  // 我要评价
  openAddCommentPage(e) {
    let self = this
    let index = e.currentTarget.dataset.index
    let data = this.data.details.mallOrderInfoList[index]
    wx.navigateTo({
      url: `../add-comment/add-comment`,
      events: {
        refresh: () => {
          self.queryorderInfo(data.orderNo)
        }
      },
      success(res) {
        let params = {
          ...data
        }
        res.eventChannel.emit('sendOrderInfo', {orderInfo: params})
      }
    })
  },

  
  // 立即支付
  nowPay() {
    // this.setData({
    //   isShow: true
    // })
  },

  // 支付失败
  payFail() {
    this.setData({
      isShow: false
    })
    // // 支付失败，跳转到进度页
    // wx.navigateTo({
    //   url: '../orders/orders?type=1'
    // })
  },
  
  // 支付成功
  paySuccess() {
    wx.navigateTo({
      url: '../pay-success/pay-success',
      success: res => {
        this.setData({
          isShow: false
        })
        res.eventChannel.emit('sendOrderInfo', { orderInfo: this.data.details })
      }
    })
  },

  // 提醒发货
  remindShip() {},

  // 确认收货
  confirmReceipt() {},

  // 删除订单
  delOrder() {},

  // 再次购买
  buyAgin() {},


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
          request('order/cancel', params).then(res => {
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
  },
})

