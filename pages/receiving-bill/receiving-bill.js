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
    title: '快跑账单'
  },
  // 账单明细
  openReceivingBillPage () {
    wx.navigateTo({
      url: '../run-bill/run-bill'
    })
  },
  // 平台推广
  openPlateformPage () {
    wx.navigateTo({
      url: '../plateform-card/plateform-card'
    })
  },
  // 扫码识别推荐人
  openGetReferrerPage () {
    wx.navigateTo({
      url: '../get-referrer/get-referrer'
    })
  },
})