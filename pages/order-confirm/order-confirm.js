import {getStandardDate} from '../../utils/util'
import request from '../api/request';

const app = getApp();

Page({
  options: {
    addGlobalClass: true
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    title: "确认订单",
    // 搜索条件
    commodityList: [],
    selectedList: [],
    // 订单总价
    totalAmount: 0,
    // 订单实际应支付总价
    realAmount: 0,
    // 订单中的商品数量
    commodityTotalNumber: 0,
    modalStatus: false,
    // 筛选条件参数
    params: {
      // 收货人地址
      address: '',
      // 订单备注
      description: '',
      // 收货人电话
      mobile: '',
      // 收货人姓名
      name: '',
      // 店铺id
      shopId: '',
      // 商品数组
      skuOrderDtoArr: [
        // {
        //   // 是否活动商品
        //   isActivity: false,
        //   // 商品名称
        //   spuName: '',
        //   // 商品图片
        //   showImg: '',
        //   // 商品数量
        //   number: 0,
        //   // 单品id
        //   skuId: '',
        // }
      ],
    },
    // 免运费条件金额
    postAmount: 0,
    // 免配送费
    postStr: '',
    layoutType: 'row',
    isShow: false,
    // 优惠券
    discouont: {},
    // 优惠券金额
    discountAmount: 0,
    // 优惠券名称
    discountName: ''
  },
  onShow () {
    if (!wx.getStorageSync('shopcarList') || wx.getStorageSync('shopcarList').length == 0) {
      wx.navigateBack()
    }
    let self = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听sendData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendData', function(data) {
      self.setData({
        commodityList: data,
        'params.shopId': data[0].shopId
      })
      // self.calcualtionTotalAmount()
      self.calcualtionPostCoast()
      console.log('获取到的参数：', data)
      // 获取默认地址
      self.getDefaultAddress()
      // 获取优惠券
      self.getCoupon()
    }) 
  },
  // 获取优惠券
  getCoupon() {
    // 获取优惠券
    request('user/couponlist').then(res => {
      if (res.data.data.length > 0) {
        this.setData({
          discouont: res.data.data[0]
        })
        this.enableDiscount()
      }
    })
  },
  // 是否启用优惠券
  enableDiscount() {
    // 订单金额大于优惠券金额才能使用优惠券
    if (this.data.totalAmount*100 > this.data.discouont.amount) {
      this.setData({
        discountAmount: this.data.discouont.amount,
        discountName: this.data.discouont.name
      })
      this.calcualtionRealAmount()
    } else {
      this.setData({
        discountAmount: 0,
        discountName: ''
      })
    }
  },
  // 获取默认收货地址
  getDefaultAddress() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let params = {
      shopId: wx.getStorageSync('shopDetails').shopId
    }
    request('user/address/default', params).then(res => {
      wx.hideLoading()
      this.refreshAddresss(res.data.data)
    })
  },
  // 刷新收货地址
  refreshAddresss(params) {
    if (!params) return
    let contactAddress = `${params.areaTypeOneName} ${params.areaTypeTwoName} ${params.areaTypeThreeName} ${params.contactAddress}`

    this.setData({
      'params.address': contactAddress,
      'params.mobile': params.mobilePhone,
      'params.name': params.contact,
    })
    console.log('刷新收获地址', params)
  },
  // 选择收获地址
  openAddressListPage() {
    let self = this
    wx.navigateTo({
      url: '../address-list/address-list',
      events: {
        refreshAddresss(params) {
          self.refreshAddresss(params)
        }
      }
    })
  },
  // 备注
  textareaBInput(e) {
    let value = e.detail.value
    this.setData({
      'params.description': value
    })
  },
  // 支付流程：1.店铺是否营业 > 2.是否可以创建订单/是否可以支付 > 3.店铺是否在配送时间 > 4.创建订单 > 5.获取支付参数 > 6.唤起微信支付
  pullPay() {
    // 判断地址是否为空
    if (this.data.params.address === '') {
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none'
      })
      return
    }
    // 备注不能超过50个字
    if (this.data.params.description.length > 50) {
      wx.showToast({
        title: '备注不能超过50个字',
        icon: 'none'
      })
      return
    }
    if (!app.isShopOpen()) {
      wx.showToast({
        title: '店铺已歇业，请在店铺开业时间下单',
        icon: 'none'
      })
      return
    }
    wx.showLoading()
    // 刷新核心参数
    app.refreshCoreParams().then(res => {
      wx.hideLoading()
      let params = {
        ...res
      }
      // 是否可以创建订单并支付
      if (params.enableCreateOrder) {
        let self = this
        // 获取店铺配送时间
        let obj = app.shopEnableDeliver()
        if (obj.isShowDelivery) {
          wx.showModal({
            title: '配送时间',
            content: obj.tipStr,
            confirmText: '继续下单',
            cancelText: '取消支付',
            success(res) {
              if (res.confirm) {
                let _obj = {
                  enablePay: obj.enablePay
                }
                self.createOrderAndPay(_obj)
              }
            }
          })
        } else {
          let _obj = {
            enablePay: obj.enablePay
          }
          self.createOrderAndPay(_obj)
        }
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '系统提示：该功能未开启，敬请期待！',
          icon: 'none'
        })
      }
    })
  },
  // 创建订单并获取支付参数
  createOrderAndPay(obj) {
    this.calcualtionTotalAmount()
    wx.showLoading({
      title: '正在下单...',
    })
    let params = {
      ...this.data.params,
      couponId: this.data.discountAmount/100 < this.data.totalAmount ? this.data.discouont.id : '' 
    }
    request('order/create', params).then(res => {
      // 清空购物车
      this.removeShopCar()
      if (obj.enablePay) {
        // 获取支付参数并拉起微信支付
        this.payCreatewxorder(res.data.data.orderNo)
      } else {
        wx.showToast({
          title: '商家已关闭支付功能，请联系商家开启！',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 500);
      }
    })
  },
// 获取支付参数
  payCreatewxorder(orderNo) {
    let params = {
      orderNo: orderNo
    }
    request('pay/createwxorder', params).then(res => {
      wx.hideLoading()
      let params = {
        // 时间戳
        timeStamp: res.data.data.timeStamp,
        // 随机字符串
        nonceStr: res.data.data.nonceStr,
        // 统一下单借口返回的prepay_id，提交格式prepay_id=***
        package: res.data.data.packageValue,
        // 签名
        paySign: res.data.data.paySign,
      }
      // 唤起微信支付
      this.callPay(params)
    })
  },
  // 调用微信支付
  callPay(params) {
    wx.requestPayment({
      // 时间戳
      timeStamp: params.timeStamp,
      // 随机字符串
      nonceStr: params.nonceStr,
      // 统一下单借口返回的prepay_id，提交格式prepay_id=***
      package: params.package,
      // 签名
      paySign: params.paySign,
      signType: 'MD5',
      success: res => {
        console.log('pay success', res)
        this.paySuccess()
      },
      fial: fail => {
        console.log('pay fail', fail)
        this.payFail()
      },
      complete: complete => {
        console.log('pay complete', complete)
        // this.setData({
        //   isShow: true
        // })
      }
    })
  },
  // 清空购物车
  removeShopCar() {
    wx.removeStorageSync('shopcarList')
  },
  // 支付失败
  payFail() {
    // this.setData({
    //   isShow: false
    // })
    // 支付失败，跳转到进度页
    wx.navigateTo({
      url: '../orders/orders?type=1'
    })
  },
  // 支付成功
  paySuccess() {
    wx.navigateTo({
      url: '../pay-success/pay-success',
      success: res => {
        this.setData({
          isShow: false
        })
      }
    })
  },
  // 商品数量发生变化时
  numberChange(e) {
    let detail = e.detail
    let arr = this.data.commodityList
    let index = arr.findIndex(item => item.skuId == detail.skuId)
    arr[index] = { ...detail }
    this.setData({
      commodityList: arr
    })
    // 计算价格
    // this.calcualtionTotalAmount()
    this.calcualtionPostCoast()
  },
  // 计算实际运费
  calcualtionPostCoast() {
    let shopDetails = wx.getStorageSync('shopDetails')
    // 条件免运费金额
    let freeDisMoney = shopDetails.freeDisMoney
    // 运费
    let disMoney = shopDetails.disMoney
    // 计算商品总价
    this.calcualtionTotalAmount()
    // 如果实际价格大于条件免运费金额，则免运费，否则需要运费
    if (freeDisMoney < this.data.totalAmount * 100) {
      this.setData({
        postAmount: 0,
        postStr: '免费配送'
      })
    } else {
      // 设置运费
      this.setData({
        postAmount: disMoney/100
      })
      // 重新计算总价
      this.calcualtionTotalAmount()
    }
  },
  // 计算实际价格
  calcualtionRealAmount() {
    let discountAmount = this.data.discountAmount
    this.setData({
      realAmount: (parseInt(this.data.totalAmount * 100) - (discountAmount+'')) / 100
    })
  },
  // 计算订单总价格
  calcualtionTotalAmount() {
    let arr = this.data.commodityList
    let total = 0
    let num = 0
    let skuOrderDtoArr = []
    arr.forEach(item => {
      if (item.CURRENT_QUANTITY) {
        total += item.realPrice * 100 * item.CURRENT_QUANTITY
        num += item.CURRENT_QUANTITY
        // 订单单品参数
        let params =  {
          // 是否活动商品
          isActivity: item.isActivity,
          // 商品名称
          spuName: item.spuName,
          // 商品图片
          showImg: item.spuMainImg,
          // 商品数量
          number: item.CURRENT_QUANTITY,
          // 单品id
          skuId: item.skuId,
          // 单品规格
          skuKey: item.skuKey
        }
        skuOrderDtoArr.push(params)
      }
    });
    this.setData({
      totalAmount: total / 100 + this.data.postAmount,
      'params.skuOrderDtoArr': skuOrderDtoArr,
      commodityTotalNumber: num
    })
    this.enableDiscount()
    this.calcualtionRealAmount()
  }
})