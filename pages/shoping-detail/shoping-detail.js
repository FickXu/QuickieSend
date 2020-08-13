import request from '../api/request'
import {getStandardDate} from '../../utils/util'

const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: '',
    title: '推广收入',
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
    // 可提现金额
    balance: ''
  },
  onLoad() {
    this.queryInfoList()
  },

  // 获取提现列表
  queryInfoList() {
    request('user/money/referrerreward').then(res => {
      let list = res.data.data
      let rList = list.mallCustomerReferrerRewards
      if (rList.length > 0) {
        rList.forEach(item => {
          item.payTime = getStandardDate(item.payTime, 'year')
        })
      }
      this.setData({
        balance: list.balance/100,
        orderList: rList
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

