import request from '../../api/request'

// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Component({
	options: {
    addGlobalClass: true,
  },
	data: {
		title: '个人中心',
		cuCustomBGColor: 'bg-transparent',
		userInfo: {},
		shopId: wx.getStorageSync('shopDetails').id,
		isDelivery: false
	},
	ready: function () {
		this.getUserInfo()
		this.getUserRole()
	},
	methods: {

		// 是否为配送员
		getUserRole() {
			let params = {
				shopId: this.data.shopId
			}
			request('user/isdelivery', params).then(res => {
				this.setData({
					isDelivery: res.data.data
				})
			})
		},

		// 获取用户信息
		getUserInfo() {
			request('user/info').then(res => {
				this.setData({
					userInfo: res.data.data
				})
				wx.setStorage({
					key: 'userInfo',
					data: res.data.data
				})
			})
		},

		// 打开二维码页面
		openMyScanOpenPage() {
			wx.navigateTo({
				url: '../../pages/my-scan/my-scan'
			})
		},

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

		// 小二快跑
		openReceivingOrderPage() {
			wx.navigateTo({
				url: '../../pages/receiving-order/receiving-order',
				fail: err => {
					console.log(err)
				}
			})
		},

		// 快跑账单
		openReceivingBillPage() {
			wx.navigateTo({
				url: '../../pages/receiving-bill/receiving-bill',
				fail: err => {
					console.log(err)
				}
			})
		},

		// 关于我们
		openAboutUsPage() {
			wx.navigateTo({
				url: '../../pages/about-us/about-us',
				fail: err => {
					console.log(err)
				}
			})
		},

		// 法律条款
		openLegalTermsPage() {
			wx.navigateTo({
				url: '../../pages/legal-terms/legal-terms',
				fail: err => {
					console.log(err)
				}
			})
		}
		
	}
})
