import request from '../../api/request'

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
			// avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINhLTx15w3Bm9iamcriaia0ELLTnyXtUJD9wHibQSOabeVSAqMmaDp8L1zTV1R2DlW9YnI5kOJ1fTlLg/132",
			// city: "Shenzhen",
			// country: "China",
			// gender: 1,
			// language: "zh_CN",
			// nickName: "Fick",
			// province: "Guangdong"
		},
		commodityList: [
      {
        spuId: 1,
        spuMainImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591877770824&di=cdc675bd42b9d0859497ab1b79f1e98d&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F200%2Fw600h400%2F20181030%2FhL8E-hnaivxq8444371.jpg',
        spuName: '酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼酸菜鱼',
        showPrice: 88.0,
        postType: '免费配送'
      }
    ],
	},
	ready: function () {
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
	methods: {
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
		}
		
	}
})
