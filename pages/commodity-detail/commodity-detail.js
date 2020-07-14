const { default: request } = require("../api/request");

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    customBar: app.globalData.CustomBar,
    title: '商品详情',
    detail:{"id":62,"shopSpuId":"21-62","spuId":62,"spuMainImg":"spuMainImg","spuBannerImgList":[{"id":168,"spuId":62,"spuInfoImg":"spuBannerImgArr","orderNo":1,"imgType":2}],"mallSpuSpecModelList":[{"value":"52","label":null,"spuId":62,"id":52,"childs":[{"value":"81","label":"单开门","id":81,"spuSpecId":52},{"value":"82","label":"双开门","id":82,"spuSpecId":52}]}],"spuInfoImgList":[{"id":167,"spuId":62,"spuInfoImg":"spuInfoImgArr","orderNo":1,"imgType":1}],"spuCode":"001","spuAbstract":"spuAbstract","goodsTypeIdOne":37,"goodsTypeIdTwo":38,"goodsTypeIdThree":null,"goodsTypeIdFour":null,"goodsTypeIdFive":null,"goodsTypeIdOneName":"家电","goodsTypeIdTwoName":"冰箱","goodsTypeIdThreeName":"","goodsTypeIdFourName":"","goodsTypeIdFiveName":"","brandId":14,"brandName":"亮亮","brandIcon":null,"spuName":"蔡徐坤奶粉1","showPrice":null,"realPrice":null,"skuKey":null,"filialeId":23,"filialeName":"长沙分公司01","saleQty":62,"evaluateQty":0,"shopId":21},
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
    commodityList: [
      {
        spuId: 1,
        spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
        spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
        showPrice: 88.0,
        postType: '免费配送'
      }
    ],
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
    totalAmount: 0
  },

  // 商品数量发生变化
  numberChange(e) {
    let detail = e.detail
    this.setData({
      detail: detail
    })
    console.log('number', detail)
  },

  // 查看所有评论
  allComment() {
    wx.navigateTo({
      url: '../../pages/comment-list/comment-list',
      fail(err) {
        console.log(err)
      }
    })
  },

  // 页面显示的已选中规格
  getStandardLabes() {
    let label = ''
    for (let key in this.data.SPEC_OBJ) {
      label += this.data.SPEC_OBJ[key].label + '&emsp;'
    }
    this.setData({
      standardLabel: label
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

    this.getStandardLabes()

    console.log('已选规格：', this.data.SPEC_OBJ)
  },

  // 根据规格获取单品
  getCommodityBySpec() {
    let params = {
      skuKey: '',
      spuId: ''
    }
    request('shop/shopspupagespecinfo', params).then(res => {

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

  // 获取定位信息
  getLocation: function () {
    // 获取位置
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        console.log('get location', res)
      }
    })
    // 通过位置获取附近的店铺列表
    this.getNearShopsList()
  },

  // 获取附近的店铺列表
  getNearShopsList: function () {
    console.log('附近店铺列表')
  },

  // 收藏
  collectCommodity() {},

  // 客服
  customerService() {
    
  },

  // 添加到购物车
  shopingCart() {

    // 商品的默认数量为0，添加购物车需要选择规格
    if (!this.data.detail.SPEC_OBJ) {
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
    wx.setStorage({
      key: 'shopcarList',
      data: shopcarList.concat([this.data.detail]),
      success() {
        wx.showToast({
          title: '已添加到购物车'
        })

        self.hideSelectStandardModal()
        self.getShopCarCommodityNums()
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
                self.getShopCarCommodityNums()
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
    // 购物车商品数量
    this.setData({
      shopCarCommodityNums: wx.getStorageSync('shopcarList').length || 0
    })
  },

  // 页面显示时检查登录状态
  onShow: function () {
    this.getShopCarCommodityNums()
    // let self = this

    // 页面通信
    // const eventChannel = this.getOpenerEventChannel()
    // // 监听sendData事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('sendData', function(data) {
    //   self.setData({
    //     detail: {
    //       ...data
    //     }
    //   })
    //   console.log('获取到的参数：', JSON.stringify(data))
    // })

    // if (app.globalData.loginCode == 10007) {
    //   self.setData({
    //     isLogin: false,
    //     loginCode: app.globalData.loginCode
    //   })
    //   return
    // }

    // wx.getStorage({
    //   key: 'userInfo',
    //   success (res) {
    //     // console.log('Page home:', res)
    //     self.setData({
    //       isLogin: true,
    //     })
    //     // 缓存到全局
    //     app.globalData.userInfo = res.data
    //   },
    //   fail (err) {
    //     console.log('get storage fail:', err)
    //     self.setData({
    //       isLogin: false
    //     })
    //   }
    // })
  }
})