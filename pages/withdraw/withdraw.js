import request from '../api/request'
import {convertRMB} from '../../utils/util'

// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Page({
	options: {
    addGlobalClass: true
  },
	data: {
		title: '提现',
		params: {
			// 提现金额
			amount: '',
			// 银行卡号
			bankAccount: '',
			// 银行卡持卡人
			bankCardholder: '',
			// 银行名称
			bankName: '',
			// 手机号
			telephone: ''
		}
	},
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

	// 表单输入
	bindinput(e) {
		let key = e.currentTarget.dataset.key
		let value = e.detail.value
		let params = {
			...this.data.params
		}

		// 元转分
		if (key === 'amount') {
			value = convertRMB(parseFloat(value), 'yuan')
		}

		params[key] = value
		this.setData({
			params: params
		})
	},

	// 确认提现
	confirmWithdraw() {
		let params = {
			...this.data.params
		}
		request('user/money/withdrawal', params).then(res => {
			wx.navigateBack()
			wx.showToast({
				title: res.data.msg
			})
		})
	},
})
