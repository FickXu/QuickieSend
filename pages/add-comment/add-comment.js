import request from '../api/request'

const app = getApp();
// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '发布评论',
    // 评论图片
    files: [],
    // 订单详情
    commodityDetails: {},
    // 评论参数
    params: {
      // 服务评分
      serveScore: '',
      // 商品评分
      spuScore: '',
      // 订单编号
      orderNo: '',
      // 订单详情编号
      orderInfoNo: '',
      // 评论类容
      contentStr: '',
      // 评论图片
      commentImgArr: []
    }
  },

  onLoad() {
    let self = this
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('sendOrderInfo', function(data) {
      console.log(data)
      self.setData({
        commodityDetails: data.orderInfo,
        'params.orderNo': data.orderInfo.orderNo,
        'params.orderInfoNo': data.orderInfo.orderInfoNo
      })
    })

    // 图片上传
    // this.setData({
    //   selectFile: this.selectFile.bind(this),
    //   uplaodFile: this.uplaodFile.bind(this)
    // })
  },

  // 获取评论级别
  getStartValue(e) {
    let starts = e.detail
    this.setData({
      'params.spuScore': starts
    })
  },
  
  // 获取服务级别
  getStartValue1(e) {
    let starts = e.detail
    this.setData({
      'params.serveScore': starts
    })
  },

  // 输入评论内容
  bindinput(e) {
    let value = e.detail.value
    this.setData({
      'params.contentStr': value
    })
  },

  // 新增评论
  confirmComment() {
    let params = {
      ...this.data.params
    }
    let self = this
    request('order/comment', params).then(res => {
      wx.showToast({
        title: res.data.msg
      })
      const eventChannel = self.getOpenerEventChannel()
      eventChannel.emit('refresh');
      wx.navigateBack()
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

