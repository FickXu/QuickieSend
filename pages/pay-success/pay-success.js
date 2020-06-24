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
        id: 1,
        name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
        postType: '免费配送',
        price: 37.3
      },
      {
        id: 2,
        name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
        postType: '免费配送',
        price: 37.3
      },
      {
        id: 4,
        name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
        postType: '免费配送',
        price: 37.3
      },
      {
        id: 3,
        name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
        postType: '免费配送',
        price: 37.3
      },
      {
        id: 5,
        name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
        postType: '免费配送',
        price: 37.3
      },
      {
        id: 6,
        name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
        postType: '免费配送',
        price: 37.3
      },
      {
        id: 7,
        name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
        postType: '免费配送',
        price: 37.3
      },
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