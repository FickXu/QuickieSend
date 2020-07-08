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
    title: "确认订单",
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
    selectedList: [],
    // 总价
    totalAmount: 0,
    // 已选中间数
    selectedTotal: 0,
    // 是否全选
    isAllSelected: false,
    modalStatus: false,
    // 筛选条件参数
    params: {
      minPrice: '',
      maxPrice: ''
    },
    layoutType: 'row',
    isShow: false
  },
  onShow () {
  },

  // 去支付
  pay() {
    this.setData({
      isShow: true
    })
  },

  // 支付失败
  payFail() {
    this.setData({
      isShow: false
    })
  },
  
  // 支付成功
  paySuccess() {
    wx.navigateTo({
      url: '../pay-success/pay-success',
      success: res => {
        this.setData({
          isShow: false
        })
      }
    })
  },

  // 商品数量发生变化时
  numberChange(e) {
    let detail = e.detail
    let arr = this.data.commodityList
    let index = arr.findIndex(item => item.id == detail.id)

    arr[index] = { ...detail }

    this.setData({
      commodityList: arr
    })

    this.calcualtionTotalAmount()
    // console.log('支付', this.data.commodityList)
  },

  // 计算总价格
  calcualtionTotalAmount() {
    let arr = this.data.commodityList
    let total = 0
    arr.forEach(item => {
      if (item.CURRENT_QUANTITY) {
        total += item.price * item.CURRENT_QUANTITY
      }
    });

    this.setData({
      totalAmount: calculationMoney(total)
    })
  }
})