const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '马上送到',
    PageCur: 'home',
    isLogin: true,
    loginCode: 10007,
    commodityList: [
      {
        id: 1,
        name: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
        price: 88.0,
        postType: '免费配送'
      },
      {
        id: 2,
        name: '红烧鱼',
        price: 30,
        postType: '免费配送'
      },
      {
        id: 4,
        name: '红烧肘子',
        price: 30,
        postType: '免费配送'
      },
      {
        id: 4,
        name: '红烧肘子',
        price: 30,
        postType: '免费配送'
      },
      {
        id: 3,
        name: '清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼',
        price: 38.0,
        postType: '免费配送'
      },
    ],
    searchPlaceholder: '一次性一用口罩',
    // 热门分类列表
    hotCategoryList: [
      {
        id: 1,
        name: '营养餐'
      },
      {
        id: 2,
        name: '陪护餐'
      },
      {
        id: 3,
        name: '营养品'
      },
      {
        id: 4,
        name: '住院相关'
      }
    ],
    // 当前热门分类下标
    categoryIndex: 0
  },

  // 打开购物车
  openShopingCartPage() {
    wx.navigateTo({
      url: '../shoping-car/shoping-car'
    })
  },

  // 下拉刷新
  bindrefresherpulling: function () {
    console.log(234)
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

  // 选择热门分类
  chooseCategory: function (event) {
    let index = event.currentTarget.dataset.index
    this.setData({
      categoryIndex: index
    })

    // 刷新商品列表
    this.getCommodityByCategoryId()
  },

  // 获取商品列表
  getCommodityByCategoryId: function () {
    let id = this.data.categoryIndex
    console.log('获取商品列表', id)
  },

  // 通知登录状态
  login: function (res) {
    let detail = res.detail
    if (detail.status == 200) {
      this.setData({
        isLogin: true,
        loginCode: 0
      })
    }
  },

  // 页面导航
  routerPage: function(event) {
    let self = this
    let data = event.currentTarget.dataset.page;
    // self.setData({
    //   PageCur: data,
    //   loginCode: 0,
    //   showSearch: 'block'
    // })
    
    if (!this.data.isLogin && data == 'person-center') {
      wx.showModal({
        title: '提示',
        content: '用户未登录，请重新登录',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../pages/login/login'
            })
            wx.clearStorage({
              success () {
                app.globalData.loginCode = 10007
                self.setData({
                  isLogin: false,
                  showSearch: 'none',
                  loginCode: app.globalData.loginCode
                })
              }
            })
          }
        }
      })
      return
    } else {
      self.setData({
        PageCur: data,
        loginCode: 0,
        showSearch: 'block'
      })
    }
  },

  // 页面显示时检查登录状态
  onShow: function () {
    let self = this
    if (app.globalData.loginCode == 10007) {
      self.setData({
        isLogin: false,
        loginCode: app.globalData.loginCode
      })
      return
    }

    wx.getStorage({
      key: 'userInfo',
      success (res) {
        // console.log('Page home:', res)
        self.setData({
          isLogin: true,
        })
        // 缓存到全局
        app.globalData.userInfo = res.data
      },
      fail (err) {
        console.log('get storage fail:', err)
        self.setData({
          isLogin: false
        })
      }
    })
  }
})