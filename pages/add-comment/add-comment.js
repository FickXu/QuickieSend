const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '发布评论',
    commodityDetails: {
      id: 2,
      goodsImg: '../images/rich.png',
      goodsTypeName: '香香大米',
      name: '香香大米',
      price: 109,
      goodsDesc: '1kg,进口',
      goodsDiscount: 2,
      goodsRealPrice: 109
    },
    files: [],
    // 默认图片-空托
    defalultImageUrlTz: app.globalData.defalultImageUrlTz,
  },

  onLoad(params) {
    // this.queryorderlist()
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },

  // 获取评论级别
  getStartValue(e) {
    let starts = e.detail
    console.log(starts)
  },

  // 输入评论内容
  bindinput(e) {
    let value = e.detail.value
    console.log(value)
  },

  // 获取订单列表
  queryorderlist() {
    let params = {
      goodsType: this.data.TabCur,   // 订单状态 0, 订单失效/取消;1, 待付款;2, 已付款待发货;3, 已下单待快递拿货; 4, 已发货待收货;5, 已收货待评价;6, 已评价)
      openId: app.globalData.openId
    }
    let self = this
    request('order/queryorderlist', params).then(res => {
      if (res.data.code == 0) {
        if (res.data.data) {
          self.setData({
            orderList: res.data.data
          })
        } else {
          self.setData({
            orderList: []
          })
        }
      }
    })
  },

  // 图片上传失败
  uploadError(e) {
    console.log('error', e)
  },

  // 图片上传成功
  uploadSuccess(e) {},

  // 选择图片时的过滤函数，返回true表示图片有效
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },

  // 图片上传的函数，返回Promise，Promise的callback里面必须resolve({urls})表示成功，否则表示失败
  uplaodFile(files) {
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      resolve({files})
      console.log('upload file', files)
    })
  },

})

