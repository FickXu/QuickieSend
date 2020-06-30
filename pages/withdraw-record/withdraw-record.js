import request from '../api/request'

const app = getApp();

Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    title: '提现记录',
    list: [
      {
        id: 1,
        title: '消费',
        createDate: '2020-6-28 10:11:07',
        money: 234.5,
        status: 0
      },
      {
        id: 12,
        title: '提现',
        createDate: '2020-6-28 10:11:07',
        money: 4.5,
        status: 1
      },
      {
        id: 13,
        title: '消费',
        createDate: '2020-6-28 10:11:07',
        money: 234.5,
        status: 0
      },
      {
        id: 14,
        title: '提现',
        createDate: '2020-6-28 10:11:07',
        money: 23234.5,
        status: 1
      },
    ],
  },
  onLoad() {
    // this.queryList()
  },
  // 获取消费明细
  queryList() {
    // let params = {
    //   openId: app.globalData.openId
    // }
    // let self = this

    // request('user/queryshopaddresslist', params).then(res => {
    //   if (res.data.code == 0) {
    //     self.setData({
    //       addressList: res.data.data,
    //     })
    //   }
    // })
  },
})