import request from '../api/request'

// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Page({
	options: {
    addGlobalClass: true
  },
	data: {
		title: '个人资料',
		// birthday: '1992-02-3',
		userInfo: {
			// avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINhLTx15w3Bm9iamcriaia0ELLTnyXtUJD9wHibQSOabeVSAqMmaDp8L1zTV1R2DlW9YnI5kOJ1fTlLg/132",
			// city: "Shenzhen",
			// country: "China",
			// gender: 1,
			// language: "zh_CN",
			// nickName: "Fick",
			// province: "Guangdong"
		},
		genderArray: ['女', '男'],
		isEdit: false,
		params: {
			telephone: '',
			headPortrait: '',
			nickName: ''
		}
	},

	onShow() {

		this.queryInfo()
		
	},

	// 获取用户信息
	queryInfo() {
		request('user/info').then(res => {
			if (res.data.code == 10000) {
				this.setData({
					userInfo: res.data.data
				})
			}
		})
	},

	// 编辑信息
	editInfo() {
		this.setData({
			isEdit: true,
			'params.headPortrait': this.data.userInfo.headPortrait,
			'params.telephone': this.data.userInfo.telephone,
			'params.nickName': this.data.userInfo.nickName
		})
	},

	// 取消编辑
	cancelEdit() {
		this.setData({
			isEdit: false
		})
	},

	// 提交编辑
	confirmEdit() {
		this.updateInfo()
	},

	// 修改用户信息
	updateInfo() {
		let params = {
			...this.data.params
		}
		request('user/update', params).then(res => {
			if (res.data.code === 10000) {
				this.queryInfo()
				this.setData({
					isEdit: false,
					'userInfo.headPortrait': params.headPortrait,
					'userInfo.nickName': params.nickName
				})
				wx.showToast({
					title: res.data.msg
				})
			}
		})
	},

	// 输入时间
	bindinput(e) {
		let key = e.currentTarget.dataset.key
		let value = e.detail.value
		let params = {
			...this.data.params
		}
		params[key] = value
		this.setData({
			params: params
		})
	},

	// 手机号码绑定
	openBindPhonePage(e) {
		let value = e.currentTarget.dataset.key
		if (!value) {
			wx.navigateTo({
				url: '../bind-phone/bind-phone'
			})
		}
	},

	// // 修改生日
	// DateChange(e) {
	// 	this.setData({
	// 		birthday: e.detail.value
	// 	})
	// },
	
	// 选择男女
	PickerChange(e) {
		console.log(e)
		this.setData({
			'userInfo.sex': e.detail.value
		})
	}
})
