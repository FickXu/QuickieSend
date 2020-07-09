import request from '../api/request'

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
        spuId: 1,
        spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
        spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
        showPrice: 88.0,
        postType: '免费配送'
      }
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
    categoryIndex: 0,
    // 当前查询的店铺详情
    shopDetails: {}
  },

  // 打开购物车
  openShopingCartPage() {
    wx.navigateTo({
      url: '../shoping-car/shoping-car'
    })
  },
  
  // 查询已选医院最近店铺
  queryShopInfo(obj) {
    let params = {
      ...obj
    }
    request('area/getlatelyareaone', params).then(res => {
      this.setData({
        shopDetails: res.data.data
      })
      wx.setStorage({
        key: 'shopDetails',
        data: res.data.data
      })
    })
  },

  // 下拉刷新
  bindrefresherpulling: function () {
    console.log(234)
  },

  // 获取最近的医院列表
  openHospitalListPage: function () {
    let slef = this
    wx.navigateTo({
      url: '../hospital-list/hospital-list',
      events: {
        refresh(params) {
          slef.queryShopInfo(params)
        }
      }
    })
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

  // 页面显示时检查店铺信息
  onShow: function () {
    let self = this
    wx.getStorage({
      key: 'shopDetails',
      success (res) {
        console.log('Page home:', res)
        self.setData({
          shopDetails: res.data,
        })
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