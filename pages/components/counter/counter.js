const app = getApp();

Component({
  options: {
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  properties: {
    // 组件被绑定时的数据源，数量发生变化后
    item: {
      type: Object,
      value: null
    }
  },
  observers: {
    'item.**': function(item) {
      this.setData({
        number: item.CURRENT_QUANTITY
      })
    }
  },
  data: {
    number: 0
  },
  lifetimes: {
    ready () {
      this.setData({
        number: this.data.item.CURRENT_QUANTITY
      })
    },
  },
  methods: {
    // 选择的商品数量发生变化时
    // numberChange(e) {
    //   console.log(e)
    //   let number = e.detail.value
    //   this.setData({
    //     number: number
    //   })
    //   // 通知父组件变化
    //   this.triggerEvent('numberChange', this.data.number)
    // },
    // 计数器按钮操作
    counter(e) {
      let type = e.currentTarget.dataset.type
      if (type === 'minus') {
        this.setData({
          number: this.data.number == 0 ? 0 : --this.data.number
        })
      } else {
        this.setData({
          number: ++this.data.number
        })
      }

      let result = {
        ...this.data.item,
        CURRENT_QUANTITY: this.data.number
      }

      // 通知父组件数量变化
      this.triggerEvent('numberChange', result)
    },
  }
})