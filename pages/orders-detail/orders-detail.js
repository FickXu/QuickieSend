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
        label: '待发货'
      },
      {
        value: 2,
        label: '待收货'
      },
      {
        value: 3,
        label: '已完成'
      }
    ],
    orderList: [],
    details: null,
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
        if (res.data.data) {
          self.setData({
            details: res.data.data
          })
        }
        wx.hideLoading()
      }
    })
  },
  tabSelect(e) {
    let orderStatus = e.currentTarget.dataset.id
    this.setData({
      TabCur: orderStatus
    })
    this.queryorderlist()
  },

  
  // 立即支付
  nowPay() {},

  // 提醒发货
  remindShip() {},

  // 确认收货
  confirmReceipt() {},

  // 删除订单
  delOrder() {},

  // 我要评价
  openAddCommentPage() {
    wx.navigateTo({
      url: '../add-comment/add-comment'
    })
  },

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
  },
})

