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
  onLoad() {

    this.queryList()
  },
  // 获取消费明细
  queryList() {
    // 获取位置
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        let params = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        request('area/getlatelyarealist', params).then(res => {
          let arr = [].concat(res.data.data)
          this.setData({
            list: arr
          })
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