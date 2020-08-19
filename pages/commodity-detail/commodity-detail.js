import request from '../api/request'
import {getStandardDate} from '../../utils/util'

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    customBar: app.globalData.CustomBar,
    title: '商品详情',
    // 商品id
    id: '',
    detail: {},
    swiperList: [],
    // 规格选择
    showSelectStandard: false,
    // 已选规格
    SPEC_OBJ: {},
    // 页面显示的已选规格
    standardLabel: '请选择规格',
    // 显示购物车
    showShopCar: false,
    // 购物车数据
    shopcarList: [],
    // 购物车商品数量
    shopCarCommodityNums: 0,
    // 购物车商品的总价
    totalAmount: 0,
    // 单品详情
    tempDetail: {},
    // 评论列表
    commentList: [],
    // 是否为活动商品
    isLimitedBuying: false,
    // 抢购开始时间
    limitedStartTime: [],
    // 抢购结束时间
    limitedEndTime: [],
    // 活动id
    mallActivityId: '',
    // 免配送费金额
    freeDisMoney: '',
    // 配送费
    disMoney: '',
    // 单品库存
    inventoryQty: -1
  },

  // 选择规格时商品数量发生变化
  numberChange(e) {
    let detail = e.detail
    this.setData({
      detail: detail
    })
  },

  // 购物车中商品数量发生变化  CURRENT_QUANTITY
  numberChange1(e) {
    let detail = e.detail
    let shopcarList = wx.getStorageSync('shopcarList')

    let index = shopcarList.findIndex(item => item.skuId == detail.skuId)
    shopcarList[index].CURRENT_QUANTITY = detail.CURRENT_QUANTITY

    if (detail.CURRENT_QUANTITY == 0) {
      shopcarList.splice(index, 1)
    }

    wx.setStorage({
      key: 'shopcarList',
      data: shopcarList
    })

    this.setData({
      shopcarList: shopcarList
    })

    // 计算购物车商品数量
    this.getShopCarCommodityNums()

    // 计算购物车商品总价格
    this.computeTotalAmount()
  },

  // 查看所有评论
  allComment() {
    wx.navigateTo({
      url: `../../pages/comment-list/comment-list?detailId=${this.data.detail.id}`,
      fail(err) {
        console.log(err)
      }
    })
  },

  // 页面显示的已选中规格
  getStandardLabes() {
    let label = []
    for (let key in this.data.SPEC_OBJ) {
      label.push(this.data.SPEC_OBJ[key].label)
    }
    this.setData({
      standardLabel: label.join(',')
    })
  },

  // 选择规格
  selectStandard(e) {
    let parentValue = e.currentTarget.dataset.parentValue
    let value = e.currentTarget.dataset.value
    let label = e.currentTarget.dataset.label
    let params = {
      ...this.data.SPEC_OBJ,
    }
    params[parentValue] = {
      label: label,
      value: value
    }

    // 保存选中的规格
    this.setData({
      SPEC_OBJ: params,
      detail: {
        ...this.data.detail,
        SPEC_OBJ: params
      }
    })

    // 页面显示的规格
    this.getStandardLabes()

    // 获取单品
    this.getCommodityBySpec()

    console.log('已选规格：', this.data.SPEC_OBJ)
  },

  // 根据规格获取单品
  getCommodityBySpec() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let params = {
      skuKey: this.data.standardLabel.split(',').join('-'),
      spuId: this.data.detail.spuId,
      shopId: this.data.detail.shopId
    }
    request('shop/shopspupagespecinfo', params).then(res => {
      let params = {
        ...res.data.data
      }
      params.realPrice = params.realPrice / 100
      params.showPrice = params.showPrice / 100
      this.setData({
        tempDetail: params,
        inventoryQty: params.inventoryQty
      })
      wx.hideLoading()
    })
  },

  // 显示选择规格弹窗
  shopCarModal() {
    this.setData({
      showShopCar: !this.data.showShopCar
    })
    if (this.data.showShopCar) {
      this.setData({
        shopcarList: wx.getStorageSync('shopcarList')
      })
    }
  },

  // 关闭规格选择弹窗
  hideShopCarModal(e) {
    this.setData({
      showShopCar: false
    })
  },
  // 显示选择规格弹窗
  showSelectStandardModal() {
    this.setData({
      showSelectStandard: true,
      detail: {
        ...this.data.detail,
        CURRENT_QUANTITY: 1
      }
    })
  },
  // 关闭规格选择弹窗
  hideSelectStandardModal(e) {
    this.setData({
      showSelectStandard: false,
      // 重置已选规格
      SPEC_OBJ: {},
      // 页面显示的已选规格
      standardLabel: '请选择规格'
    })
    if (this.data.isLimitedBuying === 'false') {
      this.setData({
        inventoryQty: 0,
        tempDetail: {}
      })
    }
  },
  noQty() {
    // wx.showToast({
    //   title: '当前商品库存大于0才可以添加到购物车',
    //   icon: 'none'
    // })
  },
  // 添加到购物车
  shopingCart() {
    if (this.data.isLimitedBuying === 'false') {
      // 商品的默认数量为0，添加购物车需要选择完整规格
      let specKeys = Object.keys(this.data.detail.SPEC_OBJ)
      if (!this.data.detail.SPEC_OBJ || specKeys.length != this.data.detail.mallSpuSpecModelList.length) {
        wx.showToast({
          title: '请选择商品规格',
          icon: 'none'
        })
        return
      }
  
      // 商品的默认数量为1，添加购物车需要选择商品数量
      if (!this.data.detail.CURRENT_QUANTITY) {
        wx.showToast({
          title: '请选择商品数量',
          icon: 'none'
        })
        return
      }
    }

    let self = this
    // 获取购物车数据
    let shopcarList = wx.getStorageSync("shopcarList") || []
    // 检查购物车是否有同一单品
    let skuIndex = shopcarList.findIndex(item => this.data.isLimitedBuying === 'true'? this.data.detail.skuId == item.skuId : this.data.tempDetail.skuId == item.skuId)
    if (skuIndex > -1) {
      // 存在同一单品时合并到购物车
      shopcarList[skuIndex].CURRENT_QUANTITY += this.data.detail.CURRENT_QUANTITY
    } else {
      let params = {
        isActivity: this.data.isLimitedBuying === 'true' ? true : false,
        shopId: this.data.detail.shopId,
        spuMainImg: this.data.detail.spuMainImg,
        spuName: this.data.detail.spuName,
        CURRENT_QUANTITY: this.data.detail.CURRENT_QUANTITY,
        // 实际售价为realPrice,展示价为showPrice。在商品详情中realPrice和showPrice相等时，只显示一个价格
        showPrice: this.data.isLimitedBuying==='true'?this.data.detail.showPrice:this.data.tempDetail.showPrice,
        // 实际售价为realPrice,展示价为showPrice。在活动商品中actPrice才是实际售价
        realPrice: this.data.isLimitedBuying==='true'?this.data.detail.realPrice:this.data.tempDetail.realPrice,
        skuId: this.data.isLimitedBuying==='true'?this.data.detail.skuId:this.data.tempDetail.skuId,
        skuKey: this.data.isLimitedBuying==='true'?this.data.detail.skuKey:this.data.tempDetail.skuKey,
        mallActivityId: this.data.mallActivityId
      }
      shopcarList.push(params)
    }
    wx.setStorage({
      key: 'shopcarList',
      data: shopcarList,
      success() {
        wx.showToast({
          title: '已添加到购物车'
        })
        // 隐藏弹窗
        self.hideSelectStandardModal()
        // 计算商品数量
        self.getShopCarCommodityNums()
        // 计算购物车商品总价格
        self.computeTotalAmount()
      }
    })
  },

  // 清空购物车
  clearShopCar() {
    let self = this

    let shopcarList = wx.getStorageSync('shopcarList')

    if (shopcarList) {
      wx.showModal({
        title: '提示',
        content: '确定要清空购物车吗',
        success(res) {
          if (res.confirm) {
            wx.removeStorage({
              key: 'shopcarList',
              success() {
                // 计算商品数量
                self.getShopCarCommodityNums()

                // 计算购物车商品总价格
                self.computeTotalAmount()

                self.setData({
                  shopcarList: wx.getStorageSync('shopcarList') || []
                })
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '购物车是空的哦',
        icon: 'none'
      })
    }
  },

  // 获取购物车商品数量
  getShopCarCommodityNums() {
    let arr = wx.getStorageSync('shopcarList') || []
    let num = 0
    arr.forEach(item => {
      num += item.CURRENT_QUANTITY
    })
    // 购物车商品数量
    this.setData({
      shopCarCommodityNums: num
    })
  },
  stopBubble() {},
  // 计算购物车商品总价
  computeTotalAmount() {
    let arr = wx.getStorageSync('shopcarList') || []
    let price = 0
    
    arr.forEach(item => {
      price += item.realPrice * 100 * item.CURRENT_QUANTITY
    })

    this.setData({
      totalAmount: price / 100
    })
  },
  // 获取评论列表
  queryCommentList() {
    wx.showLoading({
      title: '加载中...'
    })
    let params = {
      spuId: this.data.detail.id
    }
    request('order/commentlist', params).then(res => {
      this.setData({
        commentList: res.data.data
      })
      wx.hideLoading()
    })
  },
  // 提交订单
  openConfirmOrderPage() {
    // 用户是否已经登录
    let isLogin = wx.getStorageSync('isLogin') || false
    if (!isLogin) {
      wx.showModal({
        title: '提示',
        content: '用户未登录，是否登录？',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return
    }
    // 购物车中是否有商品
    if (!wx.getStorageSync('shopcarList') || wx.getStorageSync('shopcarList').length == 0) {
      wx.showToast({
        title: '购物车中没有商品哦~',
        icon: 'none'
      })
      return
    }
    let self = this
    wx.navigateTo({
      url: '../order-confirm/order-confirm',
      events: {
        clearShopCar() {
          self.clearShopCar()
        }
      },
      success(res) {
        let params = wx.getStorageSync('shopcarList')
        res.eventChannel.emit('sendData', params)
      }
    })
  },
  // 查询活动商品详情
  queryActivityCommodityInfo(id) {
    request(`shop/activityspupageinfo/${id}`).then(res => {
      let detail = res.data.data
      detail.id = res.data.data.spuId
      // 活动商品中actPrice为实际售价
      detail.showPrice = res.data.data.realPrice/100
      detail.realPrice = res.data.data.actPrice/100
      
      this.setData({
        detail: detail,
        inventoryQty: detail.inventoryQty,
        mallActivityId: detail.mallActivityId,
        limitedStartTime: getStandardDate(detail.startTime, 'hm').split(':'),
        limitedEndTime: getStandardDate(detail.endTime, 'hm').split(':')
      })

      this.queryCommentList()
    })
  },
  // 商家-商品-分页查询热卖商品详情
  querySpuInfo(id) {
    request(`shop/shopspupageviewer/${id}`).then(res => {
      let detail = res.data.data
      detail.id = res.data.data.spuId
      detail.realPrice = res.data.data.realPrice/100
      detail.showPrice = res.data.data.showPrice/100
      detail.CURRENT_QUANTITY = 1
      detail.SPEC_OBJ = {}
      this.setData({
        detail: detail,
        limitedStartTime: getStandardDate(detail.startTime, 'hm').split(':'),
        limitedEndTime: getStandardDate(detail.endTime, 'hm').split(':')
      })
      this.queryCommentList()
    })
  },
  // 设置起送金额
  settingFreeDisMoney() {
    let amount = wx.getStorageSync('shopDetails').freeDisMoney/100
    this.setData({
      freeDisMoney: amount
    })
  },
  // 设置配送费
  settingDisMoney() {
    let amount = wx.getStorageSync('shopDetails').disMoney/100
    this.setData({
      disMoney: amount
    })
  },
  onShow: function () {
    // 计算商品数量
    this.getShopCarCommodityNums()
    // 计算商品总价格
    this.computeTotalAmount()
    // 设置免配送费金额
    this.settingFreeDisMoney()
    // 设置配送费
    this.settingDisMoney()
  },
  onLoad: function (query) {
    // let self = this
    // 是否为活动商品
    let isLimitedBuying = query.isLimitedBuying
    let id = query.id
    this.setData({
      isLimitedBuying: isLimitedBuying,
      id: id
    })
    if (query.isLimitedBuying === 'true' || query.isActivity === 'true') {
      // 活动商品或广告商品
      this.queryActivityCommodityInfo(id)
    } else {
      // 热卖商品
      this.querySpuInfo(id)
    }
    // 购物车信息
    // 计算商品数量
    this.getShopCarCommodityNums()
    // 计算商品总价格
    this.computeTotalAmount()
    // 设置免费送费
    this.settingFreeDisMoney()
    // 设置配送费
    this.settingDisMoney()
  }
})