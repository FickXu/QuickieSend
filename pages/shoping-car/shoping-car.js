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
    console.log('已选商品', this.data.commodityList, ids)
    // // 获取总价和已选总件数
    this.calculationAmountAndNumber()
    // // 设置全选状态
    this.setAllSelectedStatus()
  },

  // 全选选中状态
  setAllSelectedStatus() {
    let arr = this.data.commodityList
    let selectedList = arr.filter(item => item.checked)
    console.log(selectedList.length == this.data.commodityList.length)

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
    console.log(this.data.commodityList, '===============')
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

    totalAmount = Number.parseFloat(Number.parseFloat(totalAmount).toFixed(2))

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