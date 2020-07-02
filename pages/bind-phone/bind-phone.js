import request from '../api/request'

// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Page({
	options: {
    addGlobalClass: true
  },
	data: {
		title: '绑定手机号',
		btnCodeText: '获取验证码',
		params: {
			// 短信验证码
			code: '',
			// 手机号
			telephone: '',
		}
	},

	// 获取短信验证码
	getMsg() {
		// let params = {
		// 	telephone: this.data.params.telephone
		// }
		// request('user/bindphonecode', params).then(res => {
		// 	if (res.data.code == 10000) {
		// 		wx.showToast({
		// 			title: res.data.msg
		// 		})
		// 	}
		// })
	},

	// 获取表单数据
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

	bindPhone() {
		let params = {
			...this.data.params
		}
		request('user/bindphone', params).then(res => {
			if (res.data.code == 10000) {
				wx.showToast({
					title: res.data.msg
				})

				wx.navigateBack()
			}
		})
	},
})
