import {calculationMoney} from '../utils/tools'
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
      ]
    },
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

      self.calcualtionTotalAmount()
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
      shopId: this.data.params.shopId
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

  // 去支付
  pay() {
    this.calcualtionTotalAmount()
    wx.showLoading({
      title: '正在下单...',
    })
    let params = {
      ...this.data.params,
      couponId: this.data.discountAmount/100 < this.data.totalAmount ? this.data.discouont.id : '' 
    }
    console.log(params)
    request('order/create', params).then(res => {
    // 清空购物车
      this.removeShopCar()
      
      // 调用支付
      this.payCreatewxorder(res.data.data.orderNo)
    })
  },

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
      this.callPay(params)
    })
  },

  // 调用支付
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
        this.setData({
          isShow: true
        })
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

    // if (detail.CURRENT_QUANTITY == 0) {
    //   arr.splice(index, 1)
    // }

    arr[index] = { ...detail }

    this.setData({
      commodityList: arr
    })

    this.calcualtionTotalAmount()
    // console.log('支付', this.data.commodityList)
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
      totalAmount: total / 100,
      'params.skuOrderDtoArr': skuOrderDtoArr,
      commodityTotalNumber: num
    })
    
    this.enableDiscount()
    this.calcualtionRealAmount()
  }
})