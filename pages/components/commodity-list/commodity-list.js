const app = getApp();

Component({
  options: {
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  properties: {
    info: {
      type: Array,
      defalut: null
    },
    layout: {
      type: String,
      value: 'column'
    }
  },
  data: {},
  lifetimes: {
    ready () {
    },
  },
  methods: {
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