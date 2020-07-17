// import request from '../api/request'

const app = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    title: "商品分类",
    // 搜索条件
    searchText: '请输入您要搜索的内容',
    vtabs: [],
    activeTab: 0,
    TabCur: 0,
    MainCur: 0,
    navList: [],
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 120,
      name: '营养快餐'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 1,
      name: '防辐射围裙'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '防滑垫'
    }, {
      icon: 'noticefill',
      color: 'olive',
      badge: 22,
      name: '空调被'
    }],
    load: true
  },
  ready () {
    this.setData({
      navList: wx.getStorageSync('goodsTypeList')
    })
  },
  methods: {
    // 商品列表
    openCommodityListPage(e) {
      wx.navigateTo({
        url: '../../pages/commodity-list/commodity-list',
        fail(err) {
          console.log(err)
        }
      })
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
  }
})