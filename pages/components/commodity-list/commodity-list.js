const app = getApp();

Component({
  options: {
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  properties: {
    // 数据
    info: {
      type: Array,
      defalut: null
    },
    // 列表的布局方式（多行单列或多行两列）
    layout: {
      type: String,
      value: 'column'
    },
    // 是否为选中列表
    isSelect: {
      type: Boolean,
      value: false
    },
    // 是否全选列表
    isAllSelected: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    'info': function(info) {
      this.setData({
        commodityList: info
      })
    }
  },
  data: {
    commodityList: []
  },
  lifetimes: {
    ready () {
    },
  },
  methods: {
    // 商品选择
    checkboxChange(e) {
      let ids = e.detail.value

      this.triggerEvent('checkedChange', ids)
    },
    // 商品详情
    goToDetail (e) {
      let dataset = e.currentTarget.dataset
      let self = this

      wx.navigateTo({
        url: '../../pages/commodity-detail/commodity-detail',
        events: {
          sendData: function (data) {
          }
        },
        success: function (res) {
          let params = {
            id:dataset.id,
            ...self.data.info[dataset.index]
          }
          res.eventChannel.emit('sendData', params)
        },
        fail: function(err) {
          console.log(err)
        }
      })
    }
  }
})