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
    }
  },
  data: {},
  lifetimes: {
    ready () {
      this.getAllCommodityItem()
    },
  },
  methods: {
    getAllCommodityItem () {
      const query = wx.createSelectorQuery()
      console.log(query.select('.commodity-item'))
    }
  }
})