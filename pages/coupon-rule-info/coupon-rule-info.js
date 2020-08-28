import request from '../api/request'
import {convertRMB, getStandardDate} from '../../utils/util'

const app = getApp();

Page({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    title: '使用规则',
    details: {
      id: 1,
      label: '新人奖励',
      title: '满15元可用',
      limitMoney: 1500,
      content: '仅限膳食简餐类商品',
      money: 1000,
      expried: '2020-8-26',
      startTime: '2020-8-23',
      desc: '下单后在“现金券/抵用券/优惠券”中选择抵用券，每次只能使用一张，不找零不兑换，成功下单后抵用券即作废，申请退款后无法退券'
    },
  },
  onLoad(query) {
    let localtion = query.localtion
    this.queryList(localtion)
  },
  // 获取最近的医院列表
  queryList(localtion) {
    // wx.showLoading({
    //   title: '加载中...'
    // })
    
  }
})