import request from '../api/request'

const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: '',
    title: '购物详情',
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

  // 打开提现记录
  openWithdrawPage() {
    wx.navigateTo({
      url: '../withdraw-record/withdraw-record'
    })
  },
})

