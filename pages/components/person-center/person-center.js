// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Component({
	options: {
    addGlobalClass: true,
  },
	data: {
		title: '个人中心',
		cuCustomBGColor: '',
		userInfo: {
			avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINhLTx15w3Bm9iamcriaia0ELLTnyXtUJD9wHibQSOabeVSAqMmaDp8L1zTV1R2DlW9YnI5kOJ1fTlLg/132",
			city: "Shenzhen",
			country: "China",
			gender: 1,
			language: "zh_CN",
			nickName: "Fick",
			province: "Guangdong"
		},
		commodityList: [
      {
        id: 1,
        name: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
        price: 88.0,
        postType: '免费配送'
      },
      {
        id: 2,
        name: '红烧鱼',
        price: 30,
        postType: '免费配送'
      },
      {
        id: 4,
        name: '红烧肘子',
        price: 30,
        postType: '免费配送'
      },
      {
        id: 4,
        name: '红烧肘子',
        price: 30,
        postType: '免费配送'
      },
      {
        id: 3,
        name: '清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼清蒸鲈鱼',
        price: 38.0,
        postType: '免费配送'
      },
    ],
	},
	ready: function () {
		// let self = this
		// // console.log(app.globalData)
		// let userInfo = {
		// 	avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINhLTx15w3Bm9iamcriaia0ELLTnyXtUJD9wHibQSOabeVSAqMmaDp8L1zTV1R2DlW9YnI5kOJ1fTlLg/132",
		// 	city: "Shenzhen",
		// 	country: "China",
		// 	gender: 1,
		// 	language: "zh_CN",
		// 	nickName: "Fick",
		// 	province: "Guangdong"
		// }
		
		// wx.getStorage({
		// 	key: 'userInfo',
		// 	success (res) {
		// 		self.setData({
		// 			userInfo: res.data
		// 		})
		// 	}
		// })
	},
	methods: {
		// 跳转到设置页面
		goToSettingPage: function () {
			wx.navigateTo({
				url: '../../pages/setting/setting'
			})
		},
		// 页面滚动时
		pageScroll: function (event) {
			// event.detail = {
			// 	scrollLeft,
			// 	scrollTop,
			// 	scrollHeight,
			// 	scrollWidth,
			// 	deltaX,
			// 	deltaY
			// }
			let detail = event.detail
			if (detail.scrollTop >= 20) {
				this.setData({
					cuCustomBGColor: 'bg-cyan'
				})
			} else {
				this.setData({
					cuCustomBGColor: ''
				})
			}
		},
		// 获取所有订单
		openOrdersPage: function (e) {
			let type = e.currentTarget.dataset.orderType
			wx.navigateTo({
				url: `../../pages/orders/orders?type=${type}`,
				fail: e => {
					console.log(e)
				}
			})
		},
		// 我的明细
		openConsumerDetailsPage: function () {
			wx.navigateTo({
				url: '../../pages/consumer-details/consumer-details',
				fail: e => {
					console.log(e)
				}
			})
		},
		// 我的收藏
		openCollectionPage: function () {
			wx.navigateTo({
				url: '../../pages/collection-list/collection-list'
			})
		},
		// 购物车
		openShopingCarPage: function () {
			wx.navigateTo({
				url: '../../pages/shoping-car/shoping-car'
			})
		},
		
		openConfirm: function () {
			wx.showModal({
					content: '检测到您没打开地址权限，是否去设置打开？',
					confirmText: "确认",
					cancelText: "取消",
					success: function (res) {
							if (res.confirm) {
									wx.openSetting({
											success: (res) => { }   //打开设置面板
									})
							} else {
									console.log('用户点击取消')
							}
					}
			});
		},
		
	}
})
