import request from '../api/request'
import {convertRMB, getStandardDate} from '../../utils/util'

const app = getApp();

Page({
  /**
   * 页面的初始数据
   * 获取所有二级分类 dic/goodstypetwo
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    title: '马上送到',
    PageCur: 'home',
    isLogin: false,
    // 限时抢购商品
    // limitedTimeCommodityList: [],
    // 抢购开始时间
    limitedStartTime: [],
    // 抢购结束时间
    limitedEndTime: [],
    // 热门分类列表
    // hotCategoryList: [],
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
    swiperList: [],
    // 是否为活动商品
    isLimitedBuying: true,
    VerticalNavTop: 0,
    vtabs: [],
    activeTab: 0,
    TabCur: 0,
    MainCur: 0,
    navList: [],
    // 活动商品或热卖商品
    commodityList: [],
    // iconList: [],
    load: true,
    // 显示购物车
    showShopCar: false,
    // 购物车数据
    shopcarList: [],
    // 购物车商品数量
    shopCarCommodityNums: 0,
    // 购物车商品的总价
    totalAmount: 0,
    // 免配送费金额
    freeDisMoney: '',
    // 配送费
    disMoney: '',
    // 选择规格后获取商品列表中的信息
    tempDetail: {},
    // 选择规格后通过接口获取的单品详情
    shopcarDetail: {},
    // 已选规格
    SPEC_OBJ: {},
    standardLabel: [],
    // 单品库存
    inventoryQty: -1
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
      let self = this
      wx.setStorage({
        key: 'shopDetails',
        data: res.data.data,
        success: () => {
          // 获取免配送费金额和配送费
          self.getFreeDisMoneyAndDisMoney()
        }
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
  // 活动商品列表
  openDiscountCommodityPage() {
    wx.navigateTo({
      url: `../../pages/commodity-list/commodity-list?isLimitedBuying=true`,
      fail(err) {
        console.log(err)
      }
    })
  },
  // 商品详情
  goToDetail (e) {
    let dataset = e.currentTarget.dataset
    // 已售完商品不进入详情
    let whetherSoldOut = dataset.whetherSoldOut
    if (whetherSoldOut) {
      return
    }
    wx.navigateTo({
      url: `../../pages/commodity-detail/commodity-detail?isLimitedBuying=${this.data.isLimitedBuying}&id=${dataset.id}`,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
    let navId = e.currentTarget.dataset.navId
    // 区分活动商品和热卖商品
    if (navId === -1) {
      this.setData({
        isLimitedBuying: true
      })
      this.getActivityCommodityList()
    } else {
      this.setData({
        isLimitedBuying: false,
        'commodityListQueryParams.goodsTypeIdTwo': navId
      })
      this.getCommodityList()
    }
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.navList;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().in(this).select("#main-" + i);
        view.fields({
          size: true
        }, data => {
          if(!data) return
          list[i].top = tabHeight;
          tabHeight = tabHeight + (data.height || 0);
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        navList: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  // 获取店铺的分类(二级分类)
  getCategroyListByShopId: function () {
    let params = {
      shopId: this.data.commodityListQueryParams.shopId
    }
    request('dic/goodstypetwoall', params).then(res => {
      let navList = this.data.navList.splice(0, 1)
      this.setData({
        navList: navList.concat(res.data.data)
      })
      this.getActivityCommodityList()
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
      // 隐藏骨架屏
      this.setData({
        loading: false
      })
      if (res.data.data && res.data.data.length > 0) {
        let data = res.data.data
        data.forEach(item => {
          // 活动商品实际显示的价格为活动价格
          item.showPrice = item.realPrice / 100
          item.realPrice = item.actPrice / 100
          if (item.spuAbstract === '') {
            item.spuAbstractTags = []
          } else {
            item.spuAbstractTags = item.spuAbstract.split('、')
            console.log(item.spuAbstractTags)
          }
        })
        let tempNavList = this.data.navList
        if (tempNavList[0].id != -1) {
          let navActivity = {
            id: -1,
            name: '活动'
          }
          tempNavList.splice(0, 0, navActivity)
          this.setData({
            navList: tempNavList
          })
        } 
        this.setData({
          isLimitedBuying: true,
          commodityList: data,
          limitedStartTime: getStandardDate(res.data.data[0].startTime, 'hm').split(':'),
          limitedEndTime: getStandardDate(res.data.data[0].endTime, 'hm').split(':')
        })
      } else {
        this.setData({
          isLimitedBuying: false,
          'commodityListQueryParams.goodsTypeIdTwo': (this.data.navList[0]&&this.data.navList[0].id) || ''
        })
        // 如果没有活动商品，则请求第一个商品分类下的商品列表
        this.getCommodityList()
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
      // 隐藏骨架屏
      this.setData({
        loading: false
      })
      if (res.data.data && res.data.data.length > 0) {
        let data = res.data.data
        data.forEach(item => {
          item.showPrice = item.showPrice / 100
          item.realPrice = item.realPrice / 100
          if (item.spuAbstract === '') {
            item.spuAbstractTags = []
          } else {
            item.spuAbstractTags = item.spuAbstract.split('、')
          }
        })
  
        this.setData({
          commodityList: [].concat(res.data.data),
        })
      } else {
        this.setData({
          commodityList: [],
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
                self.setData({
                  isLogin: false,
                  showSearch: 'none',
                })
              }
            }
          })
        } else {
          self.setData({
            PageCur: data,
            showSearch: 'block'
          })
        }
      })
      return
    } else {
      self.setData({
        PageCur: data,
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
      },
      fail (fail) {
        wx.showModal({
          title: '定位失败',
          content: '请关闭WiFi仅通过流量定位或请稍后再试',
        })
        wx.hideLoading()
      }
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
      let id = dataset.id
      wx.navigateTo({
        url: `../commodity-detail/commodity-detail?isActivity=true&isLimitedBuying=true&id=${id}`,
        success: (res) => {
          res.eventChannel.emit('sendData')
        },
      })
    } else {
      console.log('未知的广告类型', type)
    }
  },
  // 阻止children节点事件冒泡
  fixedCloseModal() {},
  // 显示选择规格弹窗
  showSelectStandardModal(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      showSelectStandard: true,
      tempDetail: {
        ...this.data.commodityList[index],
        CURRENT_QUANTITY: 1
      }
    })
    // 非活动商品默认选择规格
    if (!this.data.isLimitedBuying) {
      this.setDefaultStandard()
    }
  },
  // 隐藏选择规格弹窗
  hideSelectStandardModal() {
    this.setData({
      showSelectStandard: false,
      // 重置已选规格
      SPEC_OBJ: {},
      // 重置单品库存，即重置添加到购物车按钮样式
      inventoryQty: 0,
      // 重置临时的商品详情变量
      tempDetail: {}
    })
  },
  // 选择规格时商品数量发生变化
  numberChange(e) {
    let detail = e.detail
    this.setData({
      tempDetail: detail
    })
  },
  //默认选中的规格
  setDefaultStandard() {
    let standardList = this.data.tempDetail.mallSpuSpecModelList
    let params = {
      ...this.data.SPEC_OBJ
    }
    // 遍历默认规格
    standardList.forEach(item => {
      params[item.value] = {
        label: item.childs[0].label,
        value: item.childs[0].value
      }
    })
    this.setData({
      SPEC_OBJ: params,
      detail: {
        ...this.data.detail,
        SPEC_OBJ: params
      }
    })
    this.getStandardLabes()
    this.getCommodityBySpec()
  }, 
  // 用户选择规格
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
    // 获取单品
    this.getCommodityBySpec()
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
   // 根据规格获取单品（热卖商品）
   getCommodityBySpec() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let params = {
      skuKey: this.data.standardLabel.split(',').join('-'),
      spuId: this.data.tempDetail.spuId,
      shopId: this.data.tempDetail.shopId
    }
    request('shop/shopspupagespecinfo', params).then(res => {
      let params = {}
      if (res.data.data.inventoryQty == 0) {
        // 重置单品数据
        params = {}
      } else {
        params = {
          ...res.data.data
        }
        params.realPrice = params.realPrice / 100
        params.showPrice = params.showPrice / 100
      }
      this.setData({
        shopcarDetail: params,
        inventoryQty: params.inventoryQty
      })
      wx.hideLoading()
    })
  },
  // 显示或关闭购物车列表
  showShopCarModal() {
    this.setData({
      showShopCar: !this.data.showShopCar
    })
    if (this.data.showShopCar) {
      this.setData({
        shopcarList: wx.getStorageSync('shopcarList')
      })
    }
  },
  // 设置起送金额和配送费
  getFreeDisMoneyAndDisMoney() {
    // 起送金额
    let freeDisMoney = wx.getStorageSync('shopDetails').freeDisMoney/100 || ''
    // 配送费
    let disMoney = wx.getStorageSync('shopDetails').disMoney/100 || ''
    this.setData({
      freeDisMoney: freeDisMoney,
      disMoney: disMoney
    })
  },
  // 计算购物车商品数量和商品总价
  getCommodityNumberAndAmount() {
    let arr = wx.getStorageSync('shopcarList') || []
    let num = 0
    let price = 0
    arr.forEach(item => {
      // 累计商品数量
      num += item.CURRENT_QUANTITY
      // 累计商品价格
      price += item.realPrice * 100 * item.CURRENT_QUANTITY
    })

    this.setData({
      // 商品总数
      shopCarCommodityNums: num,
      // 商品总价（单位：元）
      totalAmount: price / 100
    })
  },
  // 购物车中商品数量发生变化  CURRENT_QUANTITY
  numberChange1(e) {
    let detail = e.detail
    let shopcarList = wx.getStorageSync('shopcarList')
    // 获取单品的下标
    let index = shopcarList.findIndex(item => item.skuId == detail.skuId)
    shopcarList[index].CURRENT_QUANTITY = detail.CURRENT_QUANTITY
    // 单品数量为0时移除单品
    if (detail.CURRENT_QUANTITY == 0) {
      shopcarList.splice(index, 1)
    }
    // 缓存购物车数据
    wx.setStorage({
      key: 'shopcarList',
      data: shopcarList
    })
    // 更新本地数据
    this.setData({
      shopcarList: shopcarList
    })
    // 获取购物车单品数量和总价
    this.getCommodityNumberAndAmount()
  },
  // 添加到购物车
  shopingCart() {
    if (this.data.isLimitedBuying == 'false') {
      // 商品的默认数量为1，添加购物车需要选择完整规格
      let specKeys = Object.keys(this.data.tempDetail.SPEC_OBJ)
      if (!this.data.tempDetail.SPEC_OBJ || specKeys.length != this.data.tempDetail.mallSpuSpecModelList.length) {
        wx.showToast({
          title: '请选择商品规格',
          icon: 'none'
        })
        return
      }
      // 商品的默认数量为1，添加购物车需要选择商品数量
      if (!this.data.tempDetail.CURRENT_QUANTITY) {
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
    let skuIndex = shopcarList.findIndex(item => this.data.isLimitedBuying ? this.data.tempDetail.mallSkuId == item.skuId : this.data.shopcarDetail.skuId == item.skuId)
    if (skuIndex > -1) {
      // 存在同一单品时合并到购物车
      shopcarList[skuIndex].CURRENT_QUANTITY += this.data.tempDetail.CURRENT_QUANTITY
    } else {
      // 添加新的单品到购物车
      let params = {
        isActivity: this.data.isLimitedBuying || false,
        shopId: wx.getStorageSync('shopDetails').shopId,
        spuMainImg: this.data.tempDetail.spuMainImg,
        spuName: this.data.tempDetail.spuName,
        CURRENT_QUANTITY: this.data.tempDetail.CURRENT_QUANTITY,
        // 实际售价为realPrice,展示价为showPrice。在商品详情中realPrice和showPrice相等时，只显示一个价格
        showPrice: this.data.isLimitedBuying==true?this.data.tempDetail.showPrice:this.data.shopcarDetail.showPrice,
        // 实际售价为realPrice,展示价为showPrice。在活动商品中actPrice才是实际售价
        realPrice: this.data.isLimitedBuying==true?this.data.tempDetail.realPrice:this.data.shopcarDetail.realPrice,
        // 加入购物车时，活动商品可以在列表中获取skuid和skukey而热卖商品需要选择规格后才能知道单品信息，所以区分了tempDetail和shopcarDetail
        skuId: this.data.isLimitedBuying==true?this.data.tempDetail.mallSkuId:this.data.shopcarDetail.skuId,
        skuKey: this.data.isLimitedBuying==true?this.data.tempDetail.mallSkuKey:this.data.shopcarDetail.skuKey,
        spuId: this.data.isLimitedBuying==true?this.data.tempDetail.mallSpuId:this.data.shopcarDetail.spuId,
        mallActivityId:  this.data.isLimitedBuying==true?this.data.tempDetail.mallActivityId:''
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
        // 计算商品购物车单品数量和单品总价
        self.getCommodityNumberAndAmount()
        // 关闭规格选择弹窗
        self.hideSelectStandardModal()
        // 获取购物车数据
        self.setData({
          shopcarList: wx.getStorageSync('shopcarList') || []
        })
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
                // 获取购物车商品数量和商品总价
                self.getCommodityNumberAndAmount()
                self.setData({
                  shopcarList: []
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
  // 加载购物车数据
  loadShopCar() {
    // 获取购物车商品数量和总价
    this.getCommodityNumberAndAmount()
    // 获取起送金额和配送费
    this.getFreeDisMoneyAndDisMoney()
  },
  // 页面显示时检查店铺信息
  onLoad: function (query) {
    // 获取推荐人
    if (query.scene) {
      let scene = query.scene
      wx.setStorage({
        data: scene,
        key: 'scene',
      })
    }
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
      },
      complete () {
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
  },
  onShow: function () {
    // 是否已经登录
    let isLogin = wx.getStorageSync('isLogin')
    this.setData({
      isLogin: isLogin ? true : false
    })
    // // 加载商品分类和商品列表
    // let self = this
    // wx.getStorage({
    //   key: 'shopDetails',
    //   success (res) {
    //     self.setData({
    //       shopDetails: res.data
    //     })
    //   },
    //   complete () {
    //     self.queryNearHospitalInfo()
    //   }
    // })
    // 加载购物车数据
    this.loadShopCar()
  },
})