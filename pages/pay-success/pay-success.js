import {calculationMoney} from '../utils/tools'

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
    // 搜索条件
    commodityList: [
      {
        spuId: 1,
        spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
        spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
        showPrice: 88.0,
        postType: '免费配送'
      }
    ],
    layoutType: 'row',
  },

  // 返回首页
  openHomePage() {
    // 获取当前页面栈
    let pages = getCurrentPages()
    wx.navigateBack({
      delta: pages.length - 1
    })
  }
})