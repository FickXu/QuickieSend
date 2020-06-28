const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    customBar: app.globalData.CustomBar,
    title: '商品详情',
    detail: {
      nickName: 'Fick',
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINhLTx15w3Bm9iamcriaia0ELLTnyXtUJD9wHibQSOabeVSAqMmaDp8L1zTV1R2DlW9YnI5kOJ1fTlLg/132",
    },
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
    showSelectStandard: false 
  },

  // 商品数量发生变化
  numberChange(e) {
    let numbers = e.detail
    console.log('number', numbers)
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

  // 选择规格
  showSelectStandardModal() {
    this.setData({
      showSelectStandard: true
    })
  },

  // 关闭规格选择
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

  // 收藏
  collectCommodity() {},

  // 客服
  customerService() {
    
  },

  // 添加到购物车
  shopingCart() {
    wx.showToast({
      title: '已添加到购物车'
    })
    // wx.navigateTo({
    //   url: '../shoping-car/shoping-car'
    // })
  },

  // 立即购买
  buyNow() {},

  // 选择规格
  chooseStandard() {},

  // 页面显示时检查登录状态
  onShow: function () {
    let self = this

    // 页面通信
    // const eventChannel = this.getOpenerEventChannel()
    // // 监听sendData事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('sendData', function(data) {
    //   self.setData({
    //     detail: {
    //       ...self.data.detail,
    //       ...data
    //     }
    //   })
    //   console.log('获取到的参数：', data, self.data.detail)
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