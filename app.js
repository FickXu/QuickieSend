import request from './pages/api/request'
App({
	onLaunch: function() {
    // 获取系统信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }

        let modelmes = e.model; //手机品牌
        if (modelmes.indexOf('iPhone X') != -1) {　　//XS,XR,XS MAX均可以适配,因为indexOf()会将包含'iPhone X'的字段都查出来
          this.globalData.isIpx = true
        }
      }
    })
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: '下载失败',
        icon: 'none'
      })
    })
  },
  // 消息订阅
  subscribeMessage(tempIds) {
    wx.requestSubscribeMessage({
      tmplIds: tempIds,
      success (res) {
        console.log('消息订阅', res)
      },
      fail (err) {
        console.log('消息订阅fail', err)
      }
    })
  },
  // 是否已经登录
  isLogin() {
    return new Promise((resolve, reject) => {
      let isLogin = wx.getStorageSync('isLogin') || false
      if (!isLogin) {
        // 用户没有登录
        wx.showModal({
          title: '提示',
          content: '用户未登录，请重新登录',
          success (res) {
            if (res.confirm) {
              wx.removeStorageSync('openId')
              wx.removeStorageSync('isLogin')
              wx.removeStorageSync('userInfo')
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        })
        reject()
      } else {
        resolve()
      }
    })
  },
  // 获取系统核心参数
  getCoreparams() {
    return new Promise(resolve => {
      request('dic/coreparam').then(res => {
        // this.globalData['wechat.applet.open.order'] = res.data.data['wechat.applet.open.order']
        // this.globalData['wechat.applet.pay.order'] = res.data.data['wechat.applet.pay.order']
        let data = res.data.data
        let obj = {
          // 是否可以创建订单
          enableCreateOrder: data['wechat.applet.open.order'] === 'Y' ? true : false,
          // 是否可以支付
          enablePay: data['wechat.applet.open.pay'] === 'Y' ? true : false,
        }
        resolve(obj)
      })
    })
  },
  // 刷新核心参数，调用业务接口时可能用到
  refreshCoreParams() {
    return this.getCoreparams()
  },
  // 店铺是否在营业
  isShopOpen() {
    let statue = wx.getStorageSync('shopDetails').isBus.toString() === '1' ? true : false
    return statue
  },
  // 判断订单是否超出配送时间
  shopEnableDeliver() {
    let obj = {
      // 是否显示配送时间提示
      isShowDelivery: false,
      // 提示内容
      tipStr: ''
    }
    // 配送开始时间
    let beginShopHours = wx.getStorageSync('shopDetails').beginShopHours
    // let beginShopHours = '5:00'
    let beginHours = beginShopHours.split(':')[0]
    let beginMinutes = beginShopHours.split(':')[1]
    // 配送结束时间
    let endShopHours = wx.getStorageSync('shopDetails').endShopHours
    // let endShopHours = '15:00'
    let endHours = endShopHours.split(':')[0]
    let endMinutes = endShopHours.split(':')[1]
    // 当前时间：小时
    let currentHours = new Date().getHours() 
    // 当前时间：分钟
    let currentMinutes = new Date().getMinutes() 
    // 当前未到配送时间
    if (currentHours < beginHours || (currentHours == beginHours && currentMinutes < beginMinutes)) {
      obj.isShowDelivery = true
      obj.tipStr = `订单不在配送时间，将在${beginShopHours}开始配送`
    }
    // 超出配送时间
    if (currentHours > endHours || (currentHours == endHours && currentMinutes > endMinutes)) {
      obj.isShowDelivery = true
      obj.tipStr = `订单超过配送时间，将在次日${beginShopHours}开始配送`
    }
    return obj
  },
  // 优惠券描述项
  getCouponDesc(value) {
    let str = ''
    switch (value) {
      case 1:
        str = '全场通用'
        break;
      case 2:
        str = '指定店铺'
        break;
      case 3:
        str = '指定分类'
        break;
      case 4:
        str = '指定商品'
        break;
      case 5:
        str = '指定店铺指定分类'
        break;
      case 6:
        str = '指定店铺指定商品'
        break;
      case 7:
        str = '指定店铺指定分类指定商品'
        break;
      case 8:
        str = '指定分类指定商品'
        break;
      default:
        str = ''
        break;
    }
    return str
  },
	globalData: {
    // 用户是否已经登录
    isLoin: wx.getStorageSync('isLogin'),
    userInfo: wx.getStorageSync('userInfo'),
    isIpx: false,   //适配IPhoneX
    'wechat.applet.open.order': '',
    'wechat.applet.open.pay': '',
    
	}
})