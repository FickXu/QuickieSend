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
    commodityList: [
      {
        spuId: 1,
        spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
        spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
        showPrice: 88.0,
        postType: '免费配送'
      }
    ],
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
    isShow: false
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
    }) 
  },

  // 获取默认收货地址
  getDefaultAddress() {
    let params = {
      shopId: this.data.params.shopId
    }
    request('user/address/default', params).then(res => {
      this.refreshAddresss(res.data.data)
    })
  },

  // 刷新收货地址
  refreshAddresss(params) {
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
    
    let params = {
      ...this.data.params
    }
    
    request('order/create', params).then(res => {
      
      // 清空购物车
      this.removeShopCar()
      
      // 调用支付
      this.setData({
        isShow: true
      })

    })
    console.log(this.data.params)
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

    this.calcualtionTotalAmount()
    // console.log('支付', this.data.commodityList)
  },

  // 计算实际价格
  calcualtionRealAmount() {
    let discountAmount = 0
    this.setData({
      realAmount: (this.data.totalAmount * 100 - discountAmount) / 100
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
        }
        skuOrderDtoArr.push(params)
      }
    });

    this.setData({
      totalAmount: total / 100,
      'params.skuOrderDtoArr': skuOrderDtoArr,
      commodityTotalNumber: num
    })

    this.calcualtionRealAmount()
  }
})