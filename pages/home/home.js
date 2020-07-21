import request from '../api/request'
import {convertRMB, getStandardDate} from '../../utils/util'

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '马上送到',
    PageCur: 'home',
    isLogin: false,
    loginCode: 10007,
    commodityList: [
      // {
      //   spuId: 1,
      //   spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
      //   spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
      //   showPrice: 88.0,
      //   postType: '免费配送'
      // }
    ],
    // 限时抢购商品
    limitedTimeCommodityList: [],
    // 抢购开始时间
    limitedStartTime: [],
    // 抢购结束时间
    limitedEndTime: [],
    searchPlaceholder: '请输入要搜索的商品',
    // 热门分类列表
    hotCategoryList: [],
    // 当前热门分类下标
    categoryIndex: 0,
    // 当前查询的店铺详情
    shopDetails: {},
    // 是否显示首单奖励
    isShow: false,
    // 首单减免金额
    firstOrderRewardNewAamount: '',
    // 首单减免有效期
    firstOrderRewardNewValidity: '',
    // 商品列表查询参数
    commodityListQueryParams: {
      goodsTypeIdOne: '',
      goodsTypeIdTwo: '',
      goodsTypeIdThree: '',
      goodsTypeIdFour: '',
      goodsTypeIdFive: '',
      shopId: '',
      spuCode: '',
      spuName: '',
    },
    // 是否显示无数据提示页面
    isShowNoneData: false
  },

  // 关闭弹窗
  hideModal() {
    this.setData({
      isShow: false
    })
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
        shopDetails: res.data.data,
        'commodityListQueryParams.shopId': res.data.data.shopId
        // 'commodityListQueryParams.shopId': 21
      })
      
      // 获取店铺分类
      this.getCategroyListByShopId()
      
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
  chooseCategory: function (e) {
    let type = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../pages/commodity-list/commodity-list?type=${type}`,
      fail(err) {
        console.log(err)
      }
    })
    // 跳转到二级分类
    // let id = event.currentTarget.dataset.id
    // let index = event.currentTarget.dataset.index
    // this.setData({
    //   'commodityListQueryParams.goodsTypeIdTwo': id,
    //   categoryIndex: index
    // })

    // // 刷新商品列表
    // this.getCommodityList()
  },

  // 活动商品列表
  openDiscountCommodityPage() {
    wx.navigateTo({
      url: `../../pages/commodity-list/commodity-list?isLimitedBuying=true`,
      fail(err) {
        console.log(err)
      }
    })
  },

  // 普通商品列表
  openCommodityListPage() {
    wx.navigateTo({
      url: `../../pages/commodity-list/commodity-list?isLimitedBuying=false`,
      fail(err) {
        console.log(err)
      }
    })
  },

  // 获取店铺的分类
  getCategroyListByShopId: function () {
    let shopId = this.data.commodityListQueryParams.shopId
    request(`shop/getshopgoodstype/${shopId}`).then(res => {

      this.setData({
        hotCategoryList: res.data.data.splice(0, 4),
        // 'commodityListQueryParams.goodsTypeIdTwo': res.data.data[0].id
        // 'commodityListQueryParams.goodsTypeIdTwo': 38
      })

      wx.setStorage({
        key: 'goodsTypeList',
        data: res.data.data
      })
      
      this.getActivityCommodityList()
      this.getCommodityList()
    })
  },

  // 商家-商品-分页查询活动商品列表
  getActivityCommodityList: function () {
    wx.showLoading({
      title: '加载中...'
    })
    let params = {
      ...this.data.commodityListQueryParams
    }
    
    request('shop/activityspupagelist', params).then(res => {

      if (res.data.data && res.data.data.length > 0) {
        let data = res.data.data
        data.forEach(item => {
          item.showPrice = item.showPrice / 100
          item.realPrice = item.realPrice / 100
        })
        
        this.setData({
          limitedTimeCommodityList: [].concat(res.data.data).splice(0, 2),
          limitedStartTime: getStandardDate(res.data.data[0].startTime, 'hm').split(':'),
          limitedEndTime: getStandardDate(res.data.data[0].endTime, 'hm').split(':')
        })
        // console.log(this.data.limitedStartTime, this.data.limitedEndTime)
      } else {
        this.setData({
          limitedTimeCommodityList: res.data.data,
        })
      }

      wx.hideLoading()
      
    })
  },

  // 获取商品列表
  getCommodityList: function () {
    wx.showLoading({
      title: '加载中...'
    })
    let params = {
      ...this.data.commodityListQueryParams
    }
    
    this.setData({
      isShowNoneData: false
    })

    request('shop/shopspupagelist', params).then(res => {

      if (res.data.data && res.data.data.length > 0) {
        let data = res.data.data
        data.forEach(item => {
          item.showPrice = item.showPrice / 100
          item.realPrice = item.realPrice / 100
        })
  
        this.setData({
          commodityList: [].concat(res.data.data),
        })
      } else {
        this.setData({
          commodityList: res.data.data,
          isShowNoneData: true
        })
      }

      wx.hideLoading()
      
    })
  },

  // 页面导航
  routerPage: function(event) {
    let self = this
    let data = event.currentTarget.dataset.page;
    
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

  // 获取最近的医院
  queryNearHospitalInfo() {
    let self = this
    // 获取位置
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        let params = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        request('area/getlatelyarealist', params).then(res => {
          let params = {
            latitude: res.data.data[0].latitude,
            longitude: res.data.data[0].longitude
          }
          self.queryShopInfo(params)
        })
      }
    })
  },
  
  onShow: function () {
    
    // 是否已经登录
    let isLogin = wx.getStorageSync('isLogin')
    this.setData({
      isLogin: isLogin ? true : false
    })

  },

  // 页面显示时检查店铺信息
  onLoad: function () {
    
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 加载商品分类和商品列表
    let self = this
    wx.getStorage({
      key: 'shopDetails',
      success (res) {
        console.log('Page home:', res)
        self.setData({
          shopDetails: res.data
        })
        
        self.queryNearHospitalInfo()
      },
      fail (err) {
        console.log('get storage fail:', err)
        self.queryNearHospitalInfo()
      }
    })
    
    // 新用户首单减免，只弹出一次。后端已经做了首次登录判断，所以前端只需根据字段判断，有值显示没值不显示，且只显示一次
    let isFirstShow = wx.getStorageSync('isFirstShow')
    
    if (!isFirstShow) {
      // 减免金额，分
      let firstOrderRewardNewAamount = wx.getStorageSync('userInfo').firstOrderRewardNewAamount
      
      if (firstOrderRewardNewAamount) {
        firstOrderRewardNewAamount = convertRMB(parseInt(firstOrderRewardNewAamount), 'cent')
        
        // 活动有效期，天
        let firstOrderRewardNewValidity = wx.getStorageSync('userInfo').firstOrderRewardNewValidity
        this.setData({
          isShow: true,
          firstOrderRewardNewAamount: firstOrderRewardNewAamount,
          firstOrderRewardNewValidity: firstOrderRewardNewValidity
        })
        
        wx.setStorage({
          key: 'isFirstShow',
          data: true
        })
      }
    }

    // 是否已经登录
    let isLogin = wx.getStorageSync('isLogin')
    this.setData({
      isLogin: isLogin ? true : false
    })

  }
})