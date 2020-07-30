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
    // this.queryorderlist()
  },
  // 获取订单列表
  queryorderlist() {
    wx.showLoading({
      title: '加载中...'
    })
    // mallOrderInfoList: [,…]
    // 0: {orderInfoNo: "YY20071616434974320067_1", orderNo: "YY20071616434974320067", skuId: 7, skuKey: null,…}
    // costPrice: null
    // createBy: 1
    // createDate: "2020-07-16T08:43:50.000+0000"
    // finalPrice: null
    // image: "http://yykjoss.oss-cn-shenzhen.aliyuncs.com/jpg/2020/07/16/c6e2dc76-eb55-4660-9568-37846e9a14af.jpg"
    // modifiedBy: null
    // modifiedDate: null
    // name: "长沙小龙虾"
    // orderInfoNo: "YY20071616434974320067_1"
    // orderNo: "YY20071616434974320067"
    // price: 30
    // qty: 1
    // skuCode: null
    // skuId: 7
    // skuKey: null
    // specName: "中辣-大份"
    // taxPrice: null
    // totalMoney: null

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
    wx.showLoading({
      title: '正在下单...',
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
      }
      this.callPay(params)
    })
  },

  // 调用支付
  callPay(params) {
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
        this.paySuccess()
      },
      fial: fail => {
        console.log('pay fail', fail)
        this.payFail()
      },
      complete: complete => {
        console.log('pay complete', complete)
        this.setData({
          isShow: true
        })
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
  paySuccess() {
    // wx.navigateTo({
    //   url: '../pay-success/pay-success',
    //   success: res => {
    //     this.setData({
    //       isShow: false
    //     })
    //   }
    // })
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

