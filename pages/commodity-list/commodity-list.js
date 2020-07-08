const app = getApp();

Page({
  options: {
    addGlobalClass: true
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    title: "母婴用品",
    // 搜索条件
    searchText: '请输入您要搜索的内容',
    commodityList: [
      {
        spuId: 1,
        spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
        spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
        showPrice: 88.0,
        postType: '免费配送'
      }
    ],
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

  // 点击分类tab
  onTabCLick(e) {
    const index = e.detail.index
    console.log('tabClick', index)
  },

  // 页面滚动时分类列表变化
  onChange(e) {
    const index = e.detail.index
    console.log('change', index)
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
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.navList;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().in(this).select("#main-" + i);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        navList: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  }
})