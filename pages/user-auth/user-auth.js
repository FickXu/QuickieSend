// const { default: request } = require("../api/request");
import request from '../api/request'

// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Page({
	options: {
    addGlobalClass: true
  },
	data: {
		title: '实名认证',
		testImageUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTINhLTx15w3Bm9iamcriaia0ELLTnyXtUJD9wHibQSOabeVSAqMmaDp8L1zTV1R2DlW9YnI5kOJ1fTlLg/132",
		params: {
			// 身份证号码
			idCard: '',
			// 身份证正面
			idCardFrong: '',
			// 身份证反面
			idCardReverse: '',
			// 真实姓名
			realName: '',
			// 性别
			sex: ''
		},
		genderArray: ['', '男', '女'],
		genderIndex: 0,
		disabled: true,
		details: {}
	},

	onLoad(query) {
		console.log(query)
		request('user/info').then(res => {
			this.setData({
				details: res.data.data,
				disabled: (query.isRealName == 0 || query.isRealName == 3) ? false : true,
				genderIndex: res.data.data.sex
			})
		})
	},

	// 选择男女
	PickerChange(e) {
		this.setData({
			genderIndex: e.detail.value,
			'params.sex': e.detail.value
		})
	},

	// 输入事件
	bindinput(e) {
		console.log(e)
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

	// 图片上传
	uploaderImage(e) {

		// 待审核和已通过不允许修改
		if (this.data.disabled) return

		let self = this
		let key = e.currentTarget.dataset.key
		wx.chooseImage({
			success(e) {
				const tempFilePaths = e.tempFilePaths
				console.log('=============', tempFilePaths)
				wx.uploadFile({
					url: 'https://m.quickssend.com/wechaapplet/api/base/uploadone', //仅为示例，非真实的接口地址
					filePath: tempFilePaths[0],
					name: 'file',
					// formData: {
					// 	'file': tempFilePaths[0]
					// },
					success (res){
						const data = JSON.parse(res.data)
						let params = {
							...self.data.params
						}
						params[key] = data.data.reqUrl
						self.setData({
							params: params
						})
						console.log('upload file:', data.data.reqUrl)
					},
					fail (err) {
						console.log('upload file fail', err)
					}
				})
			}
		})
	},

	// 提交实名信息
	confirmUserAuth() {
		let params = {
			...this.data.params
		}
		request('user/realname', params).then(res => {
			if (res.data.code === 10000) {
				wx.showToast({
					title: res.data.msg
				})

				setTimeout(() => {
					wx.navigateBack()
				}, 1500);
			}
		})
	}
})
