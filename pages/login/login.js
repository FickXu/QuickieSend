import request from '../api/request'

var WXBizDataCrypt = require('../../RdWXBizDataCrypt/RdWXBizDataCrypt.js')

const app = getApp()

Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    loginPageInfo: {
      iconUrl: '../images/bg-login.png',
      title: '账户登录',
      btnText1: '立即登录',
      btnText2: '暂不登录',
      // sessionKey: ''
      // 用户加密信息
      encryptedData: '',
      // 加密算法的初始向量
      iv: ''
    },
    isAuthorPhone: false,
    // 是否显示用户信息授权按钮
    isAuth: false,
    // 用户信息
    userInfo: {},
    // 手机号码信息
    phoneInfo: {}
  },

  // 返回前一页
  pageBack: function () {
    wx.navigateBack()
  },

  // 获取用户信息
  bindgetuserinfo: function(e) {
    console.log('我是授权按钮：', e.detail)

    let userInfo = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }

    this.setData({
      'loginPageInfo.encryptedData': userInfo.encryptedData,
      'loginPageInfo.iv': userInfo.iv
    })
  
    this._getUserInfo()
  },

  // 获取用户授权
  customerAuthor(encryptedData, iv, data) {
    let params = {
      appid: 'wxec62e934c43063ab',
      secret: '4869bbe98e309bd0822be8ce31e3e8da',
      grant_type: 'authorization_code',
      js_code: data.code
    }

    let pc = new WXBizDataCrypt(params.appid, data.sessionKey)
    let userInfo = pc.decryptData(encryptedData, iv)
    
    return userInfo
  },

  // 微信登录获取code
  _wxLogin: function(data) {
    return new Promise((resolve, reject) => {
      // 微信登录获取code
      wx.login({
        success: res => {
          let params = {
            code: res.code,
            ...data
          }
          // 通过code获取session_key和openid
          request('auth/sessioninfo', params).then(res => {
            if (res.data.code == 10000) {
              let data = res.data.data
              resolve(Object.assign(params, data))
            } else {
              reject(res)
            }
          })
        }
      })
    })
  },

  // 微信登录
  _getUserInfo: function() {
    let self = this

    self._wxLogin().then(res => {
      let _encryptedData = self.data.loginPageInfo.encryptedData
      let _iv = self.data.loginPageInfo.iv
      
      let userInfo = self.customerAuthor(_encryptedData, _iv, res)
      console.log('解密后的用户信息：', userInfo)

      // 缓存到本地的openId，持久化登录
      wx.setStorage({
        key: 'openId',
        data: userInfo.openId || ''
      })

      // 弹出手机号授权确认
      self.setData({
        isAuthorPhone: true,
        // 写入用户信息
        userInfo: userInfo
      })
    })
  },

  // 获取手机号
  getPhoneNumber(e) {
    let self = this

    self._wxLogin().then(res => {
      let _encryptedData = e.detail.encryptedData
      let _iv = e.detail.iv
      let phoneInfo = self.customerAuthor(_encryptedData, _iv, res)

      // console.log('解密后的手机号：', phoneInfo)
      // 解密后关闭弹窗
      self.setData({
        isAuthorPhone: false
      })

      // 用户注册
      let params = {
        ...self.data.userInfo,
        phone: phoneInfo.phoneNumber
      }

      params.watermark && delete params.watermark

      // console.log('用户注册信息：', params)
      request('auth/login', params).then(res => {
        if (res.data.code == 10000) {
          wx.navigateBack()
          wx.setStorage({
            key: 'isLogin',
            data: true
          })
          wx.setStorage({
            key: 'userInfo',
            data: res.data.data
          })
        }
      })

    })
  }

})