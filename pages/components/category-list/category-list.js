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
    navList: [
      {
        id: 0,
        name: '精选推荐',
        list: [
          {
            id: 1,
            name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精选推荐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      },
      {
        id: 1,
        name: '营养快餐',
        list: [
          {
            id: 1,
            name: '营养快餐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '营养快餐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '营养快餐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '营养快餐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '营养快餐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '营养快餐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '营养快餐清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      },
      {
        id: 2,
        name: '母婴用品',
        list: [
          {
            id: 1,
            name: '母婴用品清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '母婴用品清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '母婴用品清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '母婴用品清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '母婴用品清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '母婴用品清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '母婴用品清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      },
      {
        id: 3,
        name: '时尚女装',
        list: [
          {
            id: 1,
            name: '时尚女装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '时尚女装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '时尚女装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '时尚女装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '时尚女装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '时尚女装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '时尚女装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      },
      {
        id: 4,
        name: '精品男装',
        list: [
          {
            id: 1,
            name: '精品男装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精品男装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精品男装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精品男装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精品男装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精品男装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '精品男装清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      },
      {
        id: 5,
        name: '美妆个护',
        list: [
          {
            id: 1,
            name: '美妆个护清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '美妆个护清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '美妆个护清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '美妆个护清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '美妆个护清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '美妆个护清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '美妆个护清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      },
      {
        id: 6,
        name: '水果尝鲜',
        list: [
          {
            id: 1,
            name: '水果尝鲜清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '水果尝鲜清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '水果尝鲜清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '水果尝鲜清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '水果尝鲜清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '水果尝鲜清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '水果尝鲜清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      },
      {
        id: 7,
        name: '箱包皮具',
        list: [
          {
            id: 1,
            name: '箱包皮具清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '箱包皮具清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '箱包皮具清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '箱包皮具清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '箱包皮具清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '箱包皮具清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '箱包皮具清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      },
      {
        id: 8,
        name: '手表配饰',
        list: [
          {
            id: 1,
            name: '手表配饰清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '手表配饰清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '手表配饰清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '手表配饰清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '手表配饰清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '手表配饰清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
          {
            id: 1,
            name: '手表配饰清蒸鲤鱼+米饭+时蔬+筒骨海带汤',
            price: 37.3
          },
        ]
      }
    ],
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
  },
  methods: {
    // 商品列表
    goToCommodityList(e) {
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