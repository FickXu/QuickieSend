import {getStandardDate} from '../../utils/util'
import request from '../api/request';
const app = getApp();
Page({
  options: {
    addGlobalClass: true
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    title: "支付成功",
    ctx: null,
    noPrize: './img/cover-prize.png',
    details: null
  },

  onLoad(query) {
    let params = {
      orderNo: query.orderNo
    }
    this.getPaySuccessCoupon(params)
    // this.loadCanvas()
    // // 加载奖券画布
    // this.loadCouponCanvas()
  },
  // 支付后领券
  getPaySuccessCoupon(params) {
    request('coupons/payaftercouponslist', params).then(res => {
      if (!res.data.data) {
        let details = res.data.data
        details.timeUseEnd = getStandardDate(details.timeUseEnd, 'year')
        details.gouponsGroupItemEsModelList[0].useWayStr = app.getCouponDesc(details.gouponsGroupItemEsModelList[0].useWay)
        this.setData({
          details: details
        })
      }
    })
  },
  // 用户领券
  quickPullCoupon(e) {
    app.isLogin().then(() => {
      let dataset = e.currentTarget.dataset
      let params = {
        gouponsGroupId: dataset.id
      }
      wx.showLoading({
        title: '领取中...',
      })
      request('coupons/ledthesecurities', params).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: res.data.msg,
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 700);
      })
    })
   },
  goToRuleDetail(e) {
     let self = this
     let dataset = e.currentTarget.dataset
     wx.navigateTo({
       url: '../coupon-rule-info/coupon-rule-info',
       success: function(res) {
         // 通过eventChannel向被打开页面传送数据
         res.eventChannel.emit('sendCouponInfo', {
           data: self.data.details,
           cIndex: 0
         })
       }
     })
  },
  // 手指触摸动作开始
  bindtouchstart(e) {
    let touches = e.touches
    console.log('bindtouchstart', e, touches[0])
    this.getImageData(touches[0].x, touches[0].y, 10, 10)
  },
  // 手指移动
  bindtouchmove(e) {
    // console.log('bindtouchmove', e.changedTouches[0], e.touches[0])
    let touches = e.changedTouches
    // this.data.ctx.arc(touches[0].x, touches[0].y, 10, 0, 2 * Math.PI)
    // this.data.ctx.setFillStyle('#f37b1d')
    // this.data.ctx.fill()
    // this.data.ctx.clearRect(touches[0].x, touches[0].y, 15, 15)
    // this.data.ctx.draw(true)
    this.getImageData(touches[0].x, touches[0].y, 15, 15)
    setTimeout(() => {
    }, 50)
  },
  // 手指触摸停止
  bindtouchend(e) {
    let touches = e.touches
    console.log('bindtouchend', touches[0])
  },
  // 长按 500ms之后
  bindlongtap(e) {
    let touches = e.touches
    console.log('bindlongtap', touches[0])
    wx.showModal({
      title: '领取奖券',
      content: '确认领取奖券吗？',
      success: res => {
        if (res.confirm) {
          wx.showToast({
            title: '已领取'
          })
        }
      }
    })
  },
  // 将像素绘制到指定区域
  putImageData(data, x, y, w, h) {
    wx.canvasPutImageData({
      canvasId: 'canvas2',
      x: x,
      y: y,
      width: w,
      height: h,
      data: data
    })
  },
  // 获取奖券指定区域图片数据
  getImageData(x, y, w, h) {
    let self = this
    wx.canvasGetImageData({
      canvasId: 'canvas1',
      x: x,
      y: y,
      width: w,
      height: h,
      success(res) {
        self.putImageData(res.data, x, y, w, h)
      }
    })
  },
  // 有奖券时
  getPrizeImageData(ctx) {
    // 设置字体颜色
    ctx.setFillStyle('#FFFFFF')
    // 设置符号
    ctx.setFontSize(12)
    ctx.fillText('¥', 20, 50)
    // 设置优惠金额
    ctx.setFontSize(30)
    ctx.fillText('100', 30, 50)
    // 设置字体颜色
    ctx.setFillStyle('#eeeeee')
    // 设置符号
    ctx.setFontSize(12)
    ctx.fillText('有效期至：2020-8-28', 20, 70)
    ctx.draw(true)
  },
  // 没奖券时
  getPrizeImageDataNull(ctx) {
    // 设置字体颜色
    ctx.setFillStyle('#FFFFFF')
    // 设置符号
    ctx.setFontSize(20)
    ctx.fillText('很遗憾，未中奖', 60, 50)
    // 设置优惠金额
    ctx.setFontSize(14)
    ctx.fillText('不要灰心 么么哒', 80, 80)
    ctx.draw(true)
  },
  // 加载奖券画布
  loadCouponCanvas() {
    let self = this
    const query = wx.createSelectorQuery()
    query.select('.coupon').boundingClientRect()
    query.exec(function(res){
      let ctx = wx.createCanvasContext('canvas1', this)
      // 设置背景色
      ctx.setFillStyle('#f37b1d')
      ctx.fillRect(0, 0, res[0].width, res[0].height)
      // self.getPrizeImageDataNull(ctx)
      self.getPrizeImageData(ctx)
    })
  },
  // 加载画布
  loadCanvas() {
    let self = this
    const query = wx.createSelectorQuery()
    query.select('.coupon').boundingClientRect()
    query.exec(function(res){
      self.setData({
        ctx: wx.createCanvasContext('canvas2', this)
      })
      console.log('res', res, self.data.ctx)
      self.data.ctx.drawImage(self.data.noPrize, 0, 0, res[0].width, res[0].height)
      self.data.ctx.draw(true)
    })
  }
}) 