const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    // 是否带有选中按钮
    videoUrl: {
      type: String
    },
    videoShow: {
      type: Boolean,
      default: false
    }
  },
  data: {
    modalShow: true
  },
  methods: {
    // 关闭弹窗
    hideModal: function () {
      this.setData({
        videoShow: false
      })
    }
  }
})