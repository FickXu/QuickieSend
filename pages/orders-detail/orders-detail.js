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
    orderList: [
      {
        id: 1,
        orderNo: 92859834589384,
        statueName: '代付款',
        statueId: 0,
        contactAddress: '北京市 朝阳区 dddd',
        orderNums: 1,
        orderOriginalPrice: 109,
        busOrderInfoList: [
          {
            id: 2,
            goodsImg: '../images/rich.png',
            goodsTypeName: '香香大米',
            name: '香香大米',
            price: 109,
            goodsDesc: '1kg,进口',
            goodsDiscount: 2,
            goodsRealPrice: 109
          },
          {
            id: 2,
            goodsImg: '../images/rich.png',
            goodsTypeName: '香香大米',
            name: '香香大米',
            price: 109,
            goodsDesc: '1kg,进口',
            goodsDiscount: 2,
            goodsRealPrice: 109
          }
        ]
      },
      {
        id: 1,
        orderNo: 92859834589384,
        statueName: '待发货',
        statueId: 1,
        contactAddress: '北京市 朝阳区 dddd',
        orderNums: 1,
        orderOriginalPrice: 109,
        busOrderInfoList: [
          {
            id: 2,
            goodsImg: '../images/rich.png',
            goodsTypeName: '香香大米',
            name: '香香大米',
            price: 109,
            goodsRealPrice: 109,
            goodsDesc: '1kg,进口',
            goodsDiscount: 2
          }
        ]
      },
      {
        id: 1,
        orderNo: 92859834589384,
        statueName: '待收货',
        statueId: 2,
        contactAddress: '北京市 朝阳区 dddd',
        orderNums: 1,
        orderOriginalPrice: 109,
        busOrderInfoList: [
          {
            id: 2,
            goodsImg: '../images/rich.png',
            goodsTypeName: '香香大米',
            name: '香香大米',
            price: 109,
            goodsDesc: '1kg,进口',
            goodsDiscount: 2,
            goodsRealPrice: 109,
          }
        ]
      },
      {
        id: 1,
        orderNo: 92859834589384,
        statueName: '已完成',
        statueId: 3,
        contactAddress: '北京市 朝阳区 dddd',
        orderNums: 3,
        orderOriginalPrice: 109,
        busOrderInfoList: [
          {
            id: 2,
            goodsImg: '../images/rich.png',
            goodsTypeName: '香香大米',
            name: '香香大米',
            price: 109,
            goodsDesc: '1kg,进口',
            goodsDiscount: 2,
            goodsRealPrice: 109
          }
        ]
      }
    ],
    // 默认图片-空托
    defalultImageUrlTz: app.globalData.defalultImageUrlTz,
  },
  onLoad(params) {
    let type = params.type
    let value = ''
    switch (type) {
      case '待发货':
        value = 1
        break;
      case '待收货':
        value = 2
        break;
      case '已完成':
        value = 3
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
    let params = {
      goodsType: this.data.TabCur,   // 订单状态 0, 订单失效/取消;1, 待付款;2, 已付款待发货;3, 已下单待快递拿货; 4, 已发货待收货;5, 已收货待评价;6, 已评价)
      openId: app.globalData.openId
    }
    let self = this
    request('order/queryorderlist', params).then(res => {
      if (res.data.code == 0) {
        if (res.data.data) {
          self.setData({
            orderList: res.data.data
          })
        } else {
          self.setData({
            orderList: []
          })
        }
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
    let goodsInfo = {
      orderInfo: e.currentTarget.dataset.orderInfo,
      goods: e.currentTarget.dataset.goodsItem,
      status: {
        id: e.currentTarget.dataset.goodsItemStatusId,
        name: e.currentTarget.dataset.goodsItemStatusName
      }
    }

    wx.navigateTo({
      url: '../../pages/orders-detail/orders-detail',
      events: {
        acceptParams: function (data) {
          console.log('accept params:', data)
        }
      },
      success: function (res) {
        res.eventChannel.emit('acceptParams', goodsInfo)
      },
      fail (err) {
        console.log(err)
      }
    })
    // wx.navigateTo({
    //   url: '../../pages/orders-detail/orders-detail'
    // })
    // let self = this
    // 先选择地址
    // wx.navigateTo({
    //   url: '../../pages/address-list/address-list',
    //   events: {
    //     setShippingAddress: function (data) {
    //       console.log('已选地址:', data)
    //       let params = {
    //         shopCarIds: shopCarIds,
    //         shopAddressId: data.id,
    //         openId: app.globalData.openId
    //       }
    //       request('order/placeshopcar', params).then(res => {
    //         if (res.data.code == 0) {
    //           wx.showToast({
    //             title: res.data.msg,
    //             success() {
    //               // 打开先下操作窗口
    //               self.setData({
    //                 modalShow: true
    //               })
    //             }
    //           })
    //         }
    //       })
    //     }
    //   },
    //   success: function (res) {
    //     res.eventChannel.on('setShippingAddress')
    //   },
    //   fail (err) {
    //     console.log(err)
    //   }
    // })
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
            if (res.data.code == 0) {
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
      if (res.data.code == 0) {
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

