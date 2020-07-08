import request from '../api/request'

// 获取app实例，包含了用户信息和全局方法
const app = getApp();

Page({
	options: {
    addGlobalClass: true
  },
	data: {
		title: '个人资料',
		detials: {},
		isRealName: 0,
		isRealNameText: ''
	},

	// 获取个人信息
	onShow() {
		request('user/info').then(res => {
			this.setData({
				detials: res.data.data,
				isRealNameText: res.data.data.isRealName == 0 ? '未实名' : (res.data.data.isRealName == 1 ? '待审' : (res.data.data.isRealName == 2 ? '已认证' : '未通过')),
				isRealName: res.data.data.isRealName
			})
			// console.log(this.data.detials)
		})
	},

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
	
	// 实名认证
	userAuthPage: function () {
		wx.navigateTo({
			url: `../user-auth/user-auth?isRealName=${this.data.isRealName}`
		})
	},
})
