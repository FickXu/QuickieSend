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
    ]
  },
  onLoad() {
    this.queryWithdrawlList()
  },
  // 获取提现列表
  queryWithdrawlList() {
    request('user/money/withdrawallist').then(res => {
      self.setData({
        orderList: res.data.data
      })
    })
  },

  // 打开提现记录
  openWithdrawPage() {
    app.isLogin().then(() => {
      wx.navigateTo({
        url: '../withdraw-record/withdraw-record'
      })
    })
  },

  // 提现页面
  openWithdrawalPage() {
    app.isLogin().then(() => {
      wx.navigateTo({
        url: '../withdraw/withdraw'
      })
    })
  },
})

