import request from '../api/request'

const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: '',
    title: '我的订单',
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
        value: 3,
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
    orderListShow: true,
    isShow: false,
  },
  onShow() {
    this.queryorderlist()
  },

  onLoad(params) {
    let type = params.type || ''
    let value = ''
    switch (type) {
      case '待支付':
        value = 1
        break;
      case '待发货':
        value = 3
        break;
      case '待收货':
        value = 5
        break;
      case '已完成':
        value = 6
        break;
      default:
        value = ''
        break;
    }
    this.setData({
      TabCur: value
    })
    wx.setStorageSync('openId', params.openid || wx.getStorageSync('openId'))
    // this.queryorderlist()
  },
  // 获取订单列表
  queryorderlist() {
    wx.showLoading({
      title: '加载中...'
    })
    let params = {
      status: this.data.TabCur   // 订单状态 0, 订单失效/取消;1, 待付款;2, 已付款待发货;3, 已下单待快递拿货; 4, 已发货待收货;5, 已收货待评价;6, 已评价)
    }
    let self = this
    request('order/list', params).then(res => {
      if (res.data.code == 10000) {
        if (res.data.data.length > 0) {
          let data = res.data.data
          data.forEach(item => {
            item.payAmount = item.payAmount / 100
          })
          self.setData({
            orderList: data,
            orderListShow: true
          })
        } else {
          self.setData({
            orderList: [],
            orderListShow: false
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
  // 商品详情
  goToGoodsDetail(e) {
    let orderNo = e.currentTarget.dataset.orderNo

    wx.navigateTo({
      url: `../../pages/orders-detail/orders-detail?orderNo=${orderNo}`
    })
  },
  // 立即支付
  nowPay(e) {
    if (!app.isShopOpen()) {
      wx.showToast({
        title: '店铺已歇业，请在店铺开业时间支付',
        icon: 'none'
      })
      return
    }
    wx.showLoading()
    // 刷新核心参数
    app.refreshCoreParams().then(res => {
      wx.hideLoading()
      let params = {
        ...res
      }
      // 是否可以支付
      if (params.enablePay) {
        let self = this
        // 获取店铺配送时间
        let obj = app.shopEnableDeliver()
        if (obj.isShowDelivery) {
          wx.showModal({
            title: '配送时间',
            content: obj.tipStr,
            confirmText: '继续支付',
            cancelText: '取消支付',
            success(res) {
              if (res.confirm) {
                self.pullWXPay(e)
              }
            }
          })
        } else {
          self.pullWXPay(e)
        }
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '商家已关闭支付功能，请联系商家开启！',
          icon: 'none'
        })
      }
    })
  },
  // 拉起支付
  pullWXPay(e) {
    wx.showLoading({
      title: '正在支付...',
    })
    let orderNo = e.currentTarget.dataset.orderNo
    let params = {
      orderNo: orderNo
    }
    request('pay/createwxorder', params).then(res => {
      wx.hideLoading()
      let params = {
        // 时间戳
        timeStamp: res.data.data.timeStamp,
        // 随机字符串
        nonceStr: res.data.data.nonceStr,
        // 统一下单借口返回的prepay_id，提交格式prepay_id=***
        package: res.data.data.packageValue,
        // 签名
        paySign: res.data.data.paySign,
        orderNo: orderNo
      }
      this.callPay(params)
    })
  },
  // 调用支付
  callPay(params) {
    let self = this
    wx.requestPayment({
      // 时间戳
      timeStamp: params.timeStamp,
      // 随机字符串
      nonceStr: params.nonceStr,
      // 统一下单借口返回的prepay_id，提交格式prepay_id=***
      package: params.package,
      // 签名
      paySign: params.paySign,
      signType: 'MD5',
      success: res => {
        console.log('pay success', res)
        app.subscribeMessage(['YA25e78anNWEGVJS8tP6-1FXe5AAWyIf1WwYhYzm1As']).finally(() => {
          self.paySuccess(params.orderNo)
        })
      },
      fial: fail => {
        console.log('pay fail', fail)
        this.payFail()
      },
      complete: complete => {
        console.log('pay complete', complete)
        // this.setData({
        //   isShow: true
        // })
      }
    })
  },
  
   // 支付失败
  payFail() {
    // this.setData({
    //   isShow: false
    // })
    // 支付失败，跳转到进度页
    // wx.navigateTo({
    //   url: '../orders/orders?type=1'
    // })
  },
  
  // 支付成功
  paySuccess(orderNo) {
    wx.navigateTo({
      url: `../pay-success/pay-success?orderNo=${orderNo}`,
      success: res => {
        this.setData({
          isShow: false
        })
      }
    })
    this.queryorderlist()
  },

  // 提醒发货
  remindShip() {},

  // 确认收货
  confirmReceipt() {},

  // 删除订单
  delOrder() {},

  // 我要评价
  openAddCommentPage(e) {
    this.goToGoodsDetail(e)
    // let self = this
    // let index = e.currentTarget.dataset.index
    // let data = this.data.orderList[index]
    // wx.navigateTo({
    //   url: `../add-comment/add-comment`,
    //   events: {
    //     refresh: () => {
    //       self.queryorderlist()
    //     }
    //   },
    //   success(res) {
    //     res.eventChannel.emit('sendOrderInfo', {orderInfo: data})
    //   }
    // })
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
            orderNo: e.currentTarget.dataset.orderNo,
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

