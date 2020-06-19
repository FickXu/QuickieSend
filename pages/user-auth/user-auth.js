// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Page({
	options: {
    addGlobalClass: true
  },
	data: {
		title: '实名认证',
		cuCustomBGColor: '',
		birthday: '1992-02-3',
		userInfo: {
			avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINhLTx15w3Bm9iamcriaia0ELLTnyXtUJD9wHibQSOabeVSAqMmaDp8L1zTV1R2DlW9YnI5kOJ1fTlLg/132",
			city: "Shenzhen",
			country: "China",
			gender: 1,
			language: "zh_CN",
			nickName: "Fick",
			province: "Guangdong"
		},
		genderArray: ['男', '女'],
		genderIndex: 0
	},
	// 修改生日
	DateChange(e) {
		this.setData({
			birthday: e.detail.value
		})
	},
	// 选择男女
	PickerChange(e) {
		this.setData({
			genderIndex: e.detail.value
		})
	}
})
