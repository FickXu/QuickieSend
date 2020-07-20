import request from '../api/request'

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    customBar: app.globalData.CustomBar,
    title: '商品详情',
    // detail:{"id":62,"shopSpuId":"21-62","spuId":62,"spuMainImg":"spuMainImg","spuBannerImgList":[{"id":168,"spuId":62,"spuInfoImg":"spuBannerImgArr","orderNo":1,"imgType":2}],"mallSpuSpecModelList":[{"value":"52","label":null,"spuId":62,"id":52,"childs":[{"value":"81","label":"单开门","id":81,"spuSpecId":52},{"value":"82","label":"双开门","id":82,"spuSpecId":52}]}],"spuInfoImgList":[{"id":167,"spuId":62,"spuInfoImg":"spuInfoImgArr","orderNo":1,"imgType":1}],"spuCode":"001","spuAbstract":"spuAbstract","goodsTypeIdOne":37,"goodsTypeIdTwo":38,"goodsTypeIdThree":null,"goodsTypeIdFour":null,"goodsTypeIdFive":null,"goodsTypeIdOneName":"家电","goodsTypeIdTwoName":"冰箱","goodsTypeIdThreeName":"","goodsTypeIdFourName":"","goodsTypeIdFiveName":"","brandId":14,"brandName":"亮亮","brandIcon":null,"spuName":"蔡徐坤奶粉1","showPrice":null,"realPrice":null,"skuKey":null,"filialeId":23,"filialeName":"长沙分公司01","saleQty":62,"evaluateQty":0,"shopId":21},
    detail: {},
    swiperList: [
      {
        id: 0,
        url: '../images/rich.png'
      },
      {
        id: 1,
        url: '../images/rich.png'
      },
      {
        id: 2,
        url: '../images/rich.png'
      },
      {
        id: 3,
        url: '../images/rich.png'
      },
      {
        id: 4,
        url: '../images/rich.png'
      }
    ],
    // 猜你喜欢
    // commodityList: [
    //   {
    //     spuId: 1,
    //     spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
    //     spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
    //     showPrice: 88.0,
    //     postType: '免费配送'
    //   }
    // ],
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
    shopcarDetail: {},
    // 评论列表
    commentList: []
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

    wx.setStorage({
      key: 'shopcarList',
      data: shopcarList
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
      this.setData({
        shopcarDetail: params
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
      showSelectStandard: true
    })
  },

  // 关闭规格选择弹窗
  hideSelectStandardModal(e) {
    this.setData({
      showSelectStandard: false
    })
  },

  // // 收藏
  // collectCommodity() {},

  // // 客服
  // customerService() {
    
  // },

  // 添加到购物车
  shopingCart() {

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

    let self = this
    // 获取购物车数据
    let shopcarList = wx.getStorageSync("shopcarList") || []
    let params = {
      isActivity: this.data.detail.isActivity || false,
      shopId: this.data.detail.shopId,
      spuMainImg: this.data.detail.spuMainImg,
      spuName: this.data.detail.spuName,
      CURRENT_QUANTITY: this.data.detail.CURRENT_QUANTITY,
      showPrice: this.data.shopcarDetail.showPrice,
      realPrice: this.data.shopcarDetail.realPrice,
      skuId: this.data.shopcarDetail.skuId
    }
    wx.setStorage({
      key: 'shopcarList',
      data: shopcarList.concat([params]),
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

    // wx.navigateTo({
    //   url: '../shoping-car/shoping-car'
    // })
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

  onShow: function () {
    let self = this
    
    // 页面通信
    const eventChannel = this.getOpenerEventChannel()
    // 监听sendData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendData', function(data) {
      self.setData({
        detail: {
          ...data
        }
      })

      // 查询评论数量
      self.queryCommentList()

      console.log('获取到的参数：', JSON.stringify(data))
    })
    // 计算商品数量
    self.getShopCarCommodityNums()
    
    // 计算商品总价格
    self.computeTotalAmount()
  }
})