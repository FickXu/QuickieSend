import request from '../api/request'
import {getStandardDate} from '../../utils/util'

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
    details: {},
    cIndex: -1
  },
  onLoad(query) {
    let self = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendCouponInfo', function(data) {
      console.log('优惠券详情', data)
      data.data.timeUseBegin = getStandardDate(data.data.timeUseBegin, 'year')
      data.data.timeUseEnd = getStandardDate(data.data.timeUseEnd, 'year')
      self.setData({
        details: data.data,
        cIndex: data.cIndex
      })
    })
  },
})