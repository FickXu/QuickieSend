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
    title: "",
    // 搜索条件
    searchText: '请输入您要搜索的内容',
    commodityList: [],
    modalStatus: false,
    // 筛选条件参数
    params: {
      goodsTypeIdTwo: '',
      shopId: '',
      spuName: ''
    },
    layoutType: 'row',
    isLimitedBuying: ''
  },
  onLoad (e) {
    this.setData({
      'params.goodsTypeIdTwo': e.type,
      isLimitedBuying: e.isLimitedBuying || 'false',
      'params.spuName': e.searchStr || '',
      'params.shopId': wx.getStorageSync('shopDetails').shopId,
      title: (e.isLimitedBuying && e.isLimitedBuying == 'true') ? '活动商品' : '商品列表'
    })
    this.queryList()
  },

  bindinput(e) {
    this.setData({
      'params.spuName': e.detail.value
    })
  },

  // 查询商品列表
  queryList() {
    let params = {
      ...this.data.params
    }
    let api = this.data.isLimitedBuying == 'true' ? 'shop/activityspupagelist' : 'shop/shopspupagelist'
    request(api, params).then(res => {
      let arr = res.data.data
      arr.forEach(item => {
        item.showPrice = item.showPrice/100
        item.realPrice = item.realPrice/100
      })
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