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
    // 起送金额
    freeDisMoney: 0,
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
    discountName: '',
    // 已选商品spuId，不包含活动商品,
    spuIdArr: [],
    // 是否显示优惠券弹窗
    showCouponList: false,
    // 优惠券列表
    couponList: [],
    // 当前已选优惠券的index
    currentCouponIndex: -1
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
        'params.shopId': wx.getStorageSync('shopDetails').shopId
      })
      self.calcualtionPostCoast()
      console.log('获取到的参数：', data)
      // 获取商品spuid
      self.getCommoditySpuIds()
      // 获取优惠券
      self.getCoupon()
    }) 
    // 获取默认地址
    self.getDefaultAddress()
  },
  // 展示优惠券列表
  showCouponListModal() {
    this.setData({
      showCouponList: !this.data.showCouponList
    })
    this.getCoupon()
  },
  // 获取商品的spuId集合
  getCommoditySpuIds() {
    let arr = []
    let data = this.data.commodityList
    data.forEach(item => {
      if (!item.isActivity) {
        arr.push({
          spuId: item.spuId,
          skuId: item.skuId,
          number: item.CURRENT_QUANTITY
        })
      }
    })
    this.setData({
      spuArr: arr
    })
  },
  // 选择要使用的优惠券
  selectCoupon(e) {
    let index = e.currentTarget.dataset.index
    let conditions = this.data.couponList[index].conditions
    if (this.data.totalAmount*100 < conditions) {
      wx.showToast({
        title: `订单满${conditions/100}元才可以使用该优惠券哦~`,
        icon: 'none'
      })
    } else {
      this.setData({
        currentCouponIndex: index,
        discouont: this.data.couponList[index],
        showCouponList: false
      })
      // 是否启用优惠
      this.enableDiscount()
    }
  },
  // 获取用户订单能使用优惠劵列表
  getCoupon() {
    let params = {
      shopId: wx.getStorageSync('shopDetails').shopId,
      spuArr: this.data.spuArr
    }
    request('coupons/couponorderlist', params).then(res => {
      let arr = []
      if (res.data.data.length > 0) {
        arr = res.data.data
        arr.forEach(item => {
          item.endTime = getStandardDate(item.endTime, 'year')
          item.useWayStr = app.getCouponDesc(item.useWay)
        })
      }
      this.setData({
        couponList: arr
      })
    })
  },
  // 是否启用优惠券
  enableDiscount() {
    // 订单金额大于条件金额并且大于优惠券金额才能使用优惠券
    if (this.data.totalAmount*100 >= this.data.discouont.conditions && this.data.totalAmount*100 >= this.data.discouont.amount) {
      this.setData({
        discountAmount: this.data.discouont.amount,
        discountName: this.data.discouont.name
      })
      this.calcualtionRealAmount()
    } else {
      this.setData({
        discountAmount: 0,
        discountName: '',
        discouont: {},
        currentCouponIndex: -1
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
    if (!params) {
      this.setData({
        'params.address': '请添加收货地址'
      })
      return
    } else {
      let contactAddress = `${params.areaTypeOneName} ${params.areaTypeTwoName} ${params.areaTypeThreeName} ${params.contactAddress}`
  
      this.setData({
        'params.address': contactAddress,
        'params.mobile': params.mobilePhone,
        'params.name': params.contact,
      })
      console.log('刷新收获地址', params)
    }
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
  // 新增收货地址
  openAddAddressPage() {
    wx.navigateTo({
      url: '../modify-address/modify-address',
      events: {
        refresh: () => {
          this.getDefaultAddress()
        }
      },
      success: res => {
        let params = {
          isEdit: false
        }
        res.eventChannel.emit('sendData', params)
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
            enablePay: params.enablePay
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
  // 订阅模板消息
  // subscribeMessage(obj) {
  //   app.subscribeMessage(['YA25e78anNWEGVJS8tP6-1FXe5AAWyIf1WwYhYzm1As']).finally(() => {
  //     this.createOrderAndPay(obj)
  //   })
  // },
  // 创建订单并获取支付参数
  createOrderAndPay(obj) {
    this.calcualtionTotalAmount()
    let self = this
    wx.showLoading({
      title: '正在下单...',
      success: () => {
        let params = {
          ...self.data.params,
          couponId: self.data.discountAmount/100 < self.data.totalAmount ? self.data.discouont.id : '' 
        }
        request('order/create', params).then(res => {
          // 清空购物车
          self.removeShopCar()
          if (obj.enablePay) {
            // 获取支付参数并拉起微信支付
            self.payCreatewxorder(res.data.data.orderNo)
          } else {
            wx.showToast({
              title: '商家已关闭支付功能，请联系商家开启！',
              icon: 'none'
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1200);
          }
        })
      }
    })
  },
// 获取支付参数
  payCreatewxorder(orderNo) {
    let self = this
    wx.showLoading({
      title: '订单已生成...',
      success: () => {
        let params1 = {
          orderNo: orderNo
        }
        request('pay/createwxorder', params1).then(res => {
          wx.hideLoading()
          let params2 = {
            // 时间戳
            timeStamp: res.data.data.timeStamp,
            // 随机字符串
            nonceStr: res.data.data.nonceStr,
            // 统一下单借口返回的prepay_id，提交格式prepay_id=***
            package: res.data.data.packageValue,
            // 签名
            paySign: res.data.data.paySign,
          }
          self.callPay({...params1, ...params2})
        })
      }
    })
  },
  // 调用微信支付
  callPay(params) {
    let self = this
    wx.showLoading({
      title: '支付中...',
      success: () => {
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
            wx.showToast({
              title: '支付成功',
              icon: 'none'
            })
            setTimeout(() => {
              self.paySuccess(params.orderNo)
            }, 700);
          },
          fial: fail => {
            console.log('pay fail', fail)
            self.payFail()
          },
          complete: complete => {
            wx.hideLoading()
            console.log('pay complete', complete)
            // 支付取消
            if (complete.errMsg === 'requestPayment:fail cancel') {
              wx.showToast({
                title: '支付已取消',
                icon: 'none'
              })
              setTimeout(() => {
                self.payFail()
              }, 700);
            }
          }
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
    // 支付失败，跳转到订单页
    wx.navigateTo({
      url: '../orders/orders?type=1'
    })
  },
  // 支付成功
  paySuccess(orderNo) {
    wx.navigateTo({
      url: `../pay-success/pay-success?orderNo=${orderNo}`,
      success: res => {
        app.subscribeMessage(['YA25e78anNWEGVJS8tP6-1FXe5AAWyIf1WwYhYzm1As'])
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
    // 获取优惠券参数
    this.getCommoditySpuIds()
    // 计算实际运费
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
    if (freeDisMoney <= this.data.totalAmount * 100) {
      this.setData({
        freeDisMoney: freeDisMoney /100,
        postAmount: 0,
        postStr: '免费配送'
      })
    } else {
      // 设置运费
      this.setData({
        freeDisMoney: freeDisMoney /100,
        postAmount: disMoney/100
      })
    }
    // 重新计算总价
    this.calcualtionTotalAmount()
  },
  // 计算实际价格
  calcualtionRealAmount() {
    let discountAmount = this.data.discountAmount
    this.setData({
      realAmount: (parseInt(this.data.totalAmount * 100) - (discountAmount+'')) / 100 + this.data.postAmount
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
          skuKey: item.skuKey,
          // 活动id
          mallActivityId: item.mallActivityId
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