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
    title: "购物车",
    // 搜索条件
    searchText: '请输入您要搜索的内容',
    commodityList: [
      // {
      //   spuId: 1,
      //   spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
      //   spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
      //   showPrice: 88.0,
      //   postType: '免费配送'
      // }
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
    layoutType: 'row'
  },
  onShow () {
    this.setData({
      commodityList: wx.getStorageSync('shopcarList')
    })
  },

  // 选中商品时
  checkedChange(e) {
    let ids = e.detail
    let arr = this.data.commodityList
    arr.forEach(item => {
      if (ids.includes(item.id.toString())) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    this.setData({
      // selectedList: arr
      commodityList: arr
    })
    console.log('已选商品', this.data.commodityList.filter(item => ids.includes(item.id.toString())), ids)
    // // 获取总价和已选总件数
    this.calculationAmountAndNumber()
    // // 设置全选状态
    this.setAllSelectedStatus()
  },

  // 全选选中状态
  setAllSelectedStatus() {
    let arr = this.data.commodityList
    let selectedList = arr.filter(item => item.checked)

    this.setData({
      isAllSelected: this.data.commodityList.length == selectedList.length ? true : false
    })
  },

  // 全选按钮
  checkboxChange(e) {
    let selectedList = e.detail.value
    let arr = this.data.commodityList
    arr.forEach(item => {
      item.checked = selectedList.length > 0 ? true : false
    })
    this.setData({
      commodityList: arr,
      isAllSelected: selectedList.length > 0 ? true : false
    })
    console.log('已选商品', this.data.commodityList.filter(item => item.checked))
    this.calculationAmountAndNumber()
  },

  // 计算总价级件数
  calculationAmountAndNumber() {

    let selectedList = this.data.commodityList.filter(item => item.checked)
    let count = selectedList.length
    // let count = this.data.selectedList.length
    let totalAmount = 0
    selectedList.forEach(item => {
      totalAmount += item.price || 0
    })

    totalAmount = calculationMoney(totalAmount)

    this.setData({
      totalAmount: totalAmount,
      selectedTotal: count
    })
  },

  showModal(e) {
    this.setData({
      modalStatus: true
    })
  },

  hideModal(e) {
    this.setData({
      modalStatus: false
    })
  },
})