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
    title: '接单明细',
		cuCustomBGColor: 'bg-transparent',
    details: {},
  },
  onLoad() {
    this.queryList()
  },
  // 获取消费明细
  queryList() {
    request('order/receivingbill').then(res => {
      this.setData({
        details: res.data.data,
      })
    })
  },
})