const app = getApp();

Component({
  options: {
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  properties: {
    // 组件被绑定时的数据源，数量发生变化后
    showLabel: {
      type: Boolean,
      value: false
    }
  },
  data: {
    number: 0,
    rates: [1, 2, 3, 4, 5],
    desc: ['非常差', '差', '一般', '好', '非常好'],
    currentIndex: 0
  },
  lifetimes: {
    ready () {
    },
  },
  methods: {
    // 选择评分
    clickStart(e) {
      let value = e.currentTarget.dataset.itemValue
      this.setData({
        currentIndex: value
      })

      this.triggerEvent('getStartValue', value)
    }
  }
})