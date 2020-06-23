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