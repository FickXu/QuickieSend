const app = getApp();

Component({
  options: {
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  properties: {
    // 列表数据源
    info: {
      type: Array,
      defalut: []
    },
    // 列表布局方式， layout：row/column 单列多行/两列多行。默认两列多行
    layout: {
      type: String,
      value: 'column'
    },
    // 列表是否需要选择功能， 默认不需要
    isSelect: {
      type: Boolean,
      value: false
    },
    // 列表是否需要操作item的数量，默认不需要。如果是可选列表，不需要设置isCount参数
    isCount: {
      type: Boolean,
      value: false
    },
    // 列表是否需要显示item的数量，默认不需要
    isShowCount: {
      type: Boolean,
      value: false
    },
    // 列表是否需要显示item的购物车，默认不需要
    isShopingCart: {
      type: Boolean,
      value: false
    },
    // 是否为限时抢购商品，默认不是
    isLimitedBuying: {
      type: String,
      value: 'false'
    },
    // 是否跳转到详情，默认跳转
    isGoToDetailPage: {
      type: Boolean,
      value: true
    },
    // 数据是否来自购物车
    isInfoFromShopCar: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    'info.**': function(info) {
      this.setData({
        commodityList: info
      })
    },
    // 如果是可选列表，需要计数器
    'isSelect': function(status) {
      if (status) {
        this.setData({
          isCount: true
        })
      }
    },
  },
  data: {
    commodityList: []
  },
  lifetimes: {
    ready () {
    },
  },
  methods: {
    // 选择的商品数量发生变化时
    numberChange(e) {
      let detail = e.detail
      // console.log('detail', detail)
      this.triggerEvent('numberChange', detail)
    },

    // 选择的商品发生变化时
    checkboxChange(e) {
      let ids = e.detail.value

      this.triggerEvent('checkedChange', ids)
    },
    // 商品详情
    goToDetail (e) {
      if (!this.data.isGoToDetailPage) return
      let dataset = e.currentTarget.dataset
      // let self = this
      wx.navigateTo({
        url: `../../pages/commodity-detail/commodity-detail?isLimitedBuying=${this.data.isLimitedBuying}&id=${dataset.id}`,
        // success: function (res) {
        //   let params = {
        //     id:dataset.id,
        //     // ...self.data.info[dataset.index]
        //   }
        //   res.eventChannel.emit('sendData', params)
        // },
        // fail: function(err) {
        //   console.log(err)
        // }
      })
    }
  }
})