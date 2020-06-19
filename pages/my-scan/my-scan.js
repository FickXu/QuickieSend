import request from '../api/request'

var WXBizDataCrypt = require('../../RdWXBizDataCrypt/RdWXBizDataCrypt.js')

const app = getApp()

Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    apis:  {
      login: 'base/info',
      auth: 'auth'
    },
    customBar: app.globalData.CustomBar,
    title: '我的二维码',
    iconUrl: '../images/bg-scan.png'
  },

})