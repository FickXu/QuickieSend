import request from '../api/request'
import {convertRMB, getStandardDate} from '../../utils/util'

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
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
    isShowNoneData: false,
    // 搜索字符串
    searchStr: '',
    refreshTrigger: false,
    // 定位城市
    locationStr: '',
    // 骨架屏
    loading: true,
    // 店铺营业开始时间
    beginShopHours: '',
    // 店铺营业结束时间
    endShopHours: '',
    // 轮播广告
    swiperList: []
  },

  // 商品搜索
  bindinput(e) {
    let value = e.detail.value
    this.setData({
      searchStr: value
    })
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
      // "latitude":28.239069,"longitude":112.874908,
      ...obj
    }
    request('area/getlatelyareaone', params).then(res => {
      this.setData({
        shopDetails: res.data.data,
        'commodityListQueryParams.shopId': res.data.data.shopId,
        locationStr: res.data.data.city,
        beginShopHours: res.data.data.beginShopHours,
        endShopHours: res.data.data.endShopHours
      })

      // 获取店铺广告
      this.queryAdvertising(res.data.data.shopId)
      
      // 获取店铺分类
      this.getCategroyListByShopId()
      
      wx.setStorage({
        key: 'shopDetails',
        data: res.data.data
      })
    })
  },

  // 下拉刷新被触发
  bindrefresherpulling: function () {
    setTimeout(() => {
      this.setData({
        refreshTrigger: false
      })
    }, 1600)
  },

  // 获取最近的医院列表
  openHospitalListPage: function () {
    let slef = this
    wx.navigateTo({
      url: `../hospital-list/hospital-list?localtion=${this.data.locationStr}`,
      events: {
        refresh(params) {
          slef.queryShopInfo(params)
          wx.removeStorageSync('shopcarList')
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
    let self = this
    wx.navigateTo({
      url: `../../pages/commodity-list/commodity-list?isLimitedBuying=false&searchStr=${this.data.searchStr}`,
      success() {
        self.setData({
          searchStr: ''
        })
      },
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
          // 活动商品实际显示的价格为活动价格
          item.showPrice = item.actPrice / 100
          item.realPrice = item.actPrice / 100
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
      this.setData({
        loading: false
      })
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
    
    if (data == 'person-center') {
      // 用户登录缓存是否失效
      request('auth/islogin').then(res => {
        if (!res.data.data) {
          wx.showModal({
            title: '提示',
            content: '用户未登录，请重新登录',
            success (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../pages/login/login'
                })
                wx.removeStorageSync('openId')
                wx.removeStorageSync('isLogin')
                wx.removeStorageSync('userInfo')
                app.globalData.loginCode = 10007
                self.setData({
                  isLogin: false,
                  showSearch: 'none',
                  loginCode: app.globalData.loginCode
                })
              }
            }
          })
        } else {
          self.setData({
            PageCur: data,
            loginCode: 0,
            showSearch: 'block'
          })
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
        self.queryShopInfo(params)
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

  // 获取店铺广告
  queryAdvertising(shopId) {
    let params = {
      shopId: shopId
    }
    request('advertising/getadvertising', params).then(res => {
      this.setData({
        swiperList: res.data.data
      })
    })
  },

  // 点击首页广告
  tapAdvertising(e) {
    let dataset = e.currentTarget.dataset
    let type = dataset.type
    if (type == 1) {
      // 链接广告
      let htmlUrl = dataset.htmlUrl
      wx.navigateTo({
        url: `../advertising/advertising?htmlUrl=${htmlUrl}`,
      })
    } else if (type == 2) {
      // 商品广告
      let spuId = dataset.spuId
      wx.navigateTo({
        url: `../commodity-detail/commodity-detail?isAdvertising=true&isLimitedBuying=true&spuId=${spuId}`,
        success: (res) => {
          res.eventChannel.emit('sendData')
        },
      })
    } else {
      console.log('未知的广告类型', type)
    }
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
        self.setData({
          shopDetails: res.data
        })
        
        self.queryNearHospitalInfo()
      },
      fail (err) {
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