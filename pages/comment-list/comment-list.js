const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    customBar: app.globalData.CustomBar,
    title: '商品评价列表',
    detail: {
      nickName: 'Fick',
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINhLTx15w3Bm9iamcriaia0ELLTnyXtUJD9wHibQSOabeVSAqMmaDp8L1zTV1R2DlW9YnI5kOJ1fTlLg/132",
    },
  },

  // 查看所有评论
  allComment() {
    wx.navigateTo({
      url: 'pages/comment-list/comment-list'
    })
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
    self.setData({
      PageCur: data,
      loginCode: 0,
      showSearch: 'block'
    })
    
    // if (!this.data.isLogin && data == 'person-center') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '用户未登录，请重新登录',
    //     success (res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '../../pages/login/login'
    //         })
    //         // wx.clearStorage({
    //         //   success () {
    //         //     app.globalData.loginCode = 10007
    //         //     self.setData({
    //         //       isLogin: false,
    //         //       showSearch: 'none',
    //         //       loginCode: app.globalData.loginCode
    //         //     })
    //         //   }
    //         // })
    //       }
    //     }
    //   })
    //   return
    // } else {
    //   self.setData({
    //     PageCur: data,
    //     loginCode: 0,
    //     showSearch: 'block'
    //   })
    // }
  },

  // 页面显示时检查登录状态
  onShow: function () {
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