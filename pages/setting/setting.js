// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Page({
	options: {
    addGlobalClass: true
  },
	data: {
		title: '个人资料',
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
	},
	// ready: function () {
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
	// },
	// 个人信息
	personInfoPage: function () {
		wx.navigateTo({
			url: '../person-info/person-info'
		})
	},
	// 地址列表
	addressListPage: function () {
		wx.navigateTo({
			url: '../address-list/address-list'
		})
	},
})
