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
    title: '医院列表',
    list: [
      // {
      //   id: 1,
      //   title: '长沙中医院',
      //   address: '位于长沙市蔡锷中路123号',
      //   distance: 23
      // },
    ],
  },
  onLoad(query) {
    let localtion = query.localtion
    this.queryList(localtion)
  },
  
  // 获取最近的医院列表
  queryList(localtion) {
    wx.showLoading({
      title: '加载中...'
    })
    let self = this
    // 获取位置
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        let params = {
          latitude: res.latitude,
          longitude: res.longitude,
          city: localtion
        }
        request('area/getlatelyarealist', params).then(res => {
          let arr = [].concat(res.data.data)
          arr.forEach(item => {
            item.distance = parseFloat(item.distance).toFixed(2) + 'km'
          })
          self.setData({
            list: arr
          })
          wx.hideLoading()
        })
      }
    })
  },

  // 选择医院
  selectHospital(e) {
    let latitude = e.currentTarget.dataset.latitude
    let longitude = e.currentTarget.dataset.longitude
    const eventChannel = this.getOpenerEventChannel()
    wx.navigateBack({
      success() {
        eventChannel.emit('refresh', {latitude: latitude, longitude: longitude})
      }
    })
  },
})