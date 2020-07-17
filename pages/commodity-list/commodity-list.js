import request from '../api/request'

const app = getApp();

Page({
  options: {
    addGlobalClass: true
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    title: "母婴用品",
    // 搜索条件
    searchText: '请输入您要搜索的内容',
    commodityList: [],
    modalStatus: false,
    // 筛选条件参数
    params: {
      goodsTypeIdTwo: '',
      shopId: wx.getStorageSync('shopDetails').shopId || ''
    },
    layoutType: 'row'
  },
  onLoad (e) {
    let type = e.type
    this.setData({
      'params.goodsTypeIdTwo': type
    })
    this.queryList()
  },

  // 查询商品列表
  queryList() {
    let params = {
      ...this.data.params
    }
    console.log(params)
    request('shop/shopspupagelist', params).then(res => {
      this.setData({
        commodityList: res.data.data
      })
    })
  },

  // 修改商品列表布局
  changeLayout() {
    this.setData({
      layoutType: this.data.layoutType == 'row' ? 'column' : 'row'
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

  // 重置
  resetFilter() {
    this.hideModal()
    // 清空搜索条件
  },

  // 输入时搜索
  inputSearch: function () {

  },
  // 清空搜索框字符串
  clearSearchText: function () {
    this.setData({
      searchText: ''
    })
  },
})